package com.scrm.server.wx.cp.handler.tp;

import com.alibaba.fastjson.JSON;
import com.scrm.api.wx.cp.dto.WxCpXmlOutMessageDTO;
import com.scrm.api.wx.cp.dto.WxStaffDeleteCustomerDTO;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.api.wx.cp.entity.WxCustomerStaff;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.constant.Constants;
import com.scrm.common.util.SpringUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.builder.TextBuilder;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.dto.WxStaffCustomerTransferFailDTO;
import com.scrm.server.wx.cp.handler.AbstractHandler;
import com.scrm.server.wx.cp.handler.customer.AbstractUpdateCustomerHandler;
import com.scrm.server.wx.cp.service.IBrCustomerDynamicService;
import com.scrm.server.wx.cp.service.IContactWayService;
import com.scrm.server.wx.cp.service.IWxCustomerService;
import com.scrm.server.wx.cp.service.IWxCustomerStaffService;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.cp.api.WxCpExternalContactService;
import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.api.impl.WxCpExternalContactServiceImpl;
import me.chanjar.weixin.cp.bean.external.contact.FollowedUser;
import me.chanjar.weixin.cp.bean.external.contact.WxCpExternalContactBatchInfo;
import me.chanjar.weixin.cp.bean.external.contact.WxCpExternalContactInfo;
import me.chanjar.weixin.cp.bean.message.WxCpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlOutMessage;
import me.chanjar.weixin.cp.constant.WxCpConsts;
import me.chanjar.weixin.cp.message.WxCpMessageHandler;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;
import org.apache.commons.lang3.StringUtils;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 更改外部联系人事件业务处理
 *
 * @author xuxh
 * @date 2022/2/15 10:53
 */

@Slf4j
@Service(WxCpConsts.EventType.CHANGE_EXTERNAL_CONTACT)
@Transactional
public class WxChangeExternalContactHandler extends AbstractHandler {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    @Lazy
    private IContactWayService contactWayService;

    @Autowired
    private IWxCustomerService customerService;

    @Autowired
    private WxCpConfiguration wxCpConfiguration;

    @Autowired
    private IWxCustomerStaffService customerStaffService;

    @Autowired
    private IBrCustomerDynamicService customerDynamicService;

    private static List<AbstractUpdateCustomerHandler> updateCustomerHandlerList;

    @Autowired
    private RedissonClient redissonClient;

    @Override
    public WxCpXmlOutMessage handle(WxCpXmlMessage wxMessage, Map<String, Object> map, WxCpService wxCpService, WxSessionManager wxSessionManager) throws WxErrorException {

        WxCpXmlOutMessageDTO dto = new WxCpXmlOutMessageDTO();
        BeanUtils.copyProperties(wxMessage, dto);
        dto.setExtCorpId(ScrmConfig.getExtCorpID());

        log.debug("客户相关mq发送：[{}], [{}]", wxMessage.getChangeType(), JSON.toJSONString(dto));
        rabbitTemplate.convertAndSend(wxMessage.getChangeType(), dto);
        try {
            String content = "感谢反馈，您的信息已收到！";
            return new TextBuilder().build(content, wxMessage, null);
        } catch (Exception e) {
            log.error("联系人变更消息接收异常", e);
            return null;
        }
    }


    /**
     * 监听事件: 客户删除员工
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = WxCpConsts.ExternalContactChangeType.DEL_FOLLOW_USER)
    public void customerDeleteStaff(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[del_follow_user],事件描述:[客户删除员工],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        try {
            WxStaffDeleteCustomerDTO customerDTO = new WxStaffDeleteCustomerDTO()
                    .setExtCorpId(dto.getExtCorpId())
                    .setCustomerExtId(dto.getExternalUserId())
                    .setDeleteTime(dto.getCreateTime() == null ? new Date() : new Date(dto.getCreateTime() * 1000))
                    .setType(1)
                    .setStaffExtId(dto.getUserId());
            customerService.staffDeleteCustomer(customerDTO);


            //应用宝和渠道活码的处理
            otherDeleteHandle(dto);
            //客户动态
            customerDynamicService.saveByQueue(WxCpConsts.ExternalContactChangeType.DEL_FOLLOW_USER, dto.getExtCorpId(), dto.getUserId(), dto.getExternalUserId(), null);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[del_follow_user],事件描述:[客户删除员工],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "系统异常", e);
        }
    }


    /**
     * 监听事件: 员工删除客户
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = WxCpConsts.ExternalContactChangeType.DEL_EXTERNAL_CONTACT)
    public void staffDeleteCustomer(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[del_external_contact],事件描述:[员工删除客户],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        try {
            WxStaffDeleteCustomerDTO customerDTO = new WxStaffDeleteCustomerDTO()
                    .setDeleteByTransfer(Objects.equals("DELETE_BY_TRANSFER",dto.getSource()))
                    .setExtCorpId(dto.getExtCorpId())
                    .setCustomerExtId(dto.getExternalUserId())
                    .setDeleteTime(dto.getCreateTime() == null ? new Date() : new Date(dto.getCreateTime() * 1000))
                    .setType(2)
                    .setStaffExtId(dto.getUserId());
            customerService.staffDeleteCustomer(customerDTO);

            //应用宝和渠道活码的处理
            otherDeleteHandle(dto);
            //客户动态
            customerDynamicService.saveByQueue(WxCpConsts.ExternalContactChangeType.DEL_EXTERNAL_CONTACT, dto.getExtCorpId(), dto.getUserId(), dto.getExternalUserId(), null);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[del_external_contact],事件描述:[员工删除客户],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "系统异常", e);
        }
    }

    private void otherDeleteHandle(WxCpXmlOutMessageDTO dto) {
        for (AbstractUpdateCustomerHandler handler : getUpdateCustomerHandlerList()) {

            if (handler.match(dto.getExtCorpId(), dto.getUserId(), dto.getState())) {
                log.info("客户删除事件，匹配到handle：" + handler);
                handler.deleteHandle(dto);
            }

        }
    }

    /**
     * 监听事件: 外部联系人免验证添加成员事件
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = WxCpConsts.ExternalContactChangeType.ADD_HALF_EXTERNAL_CONTACT)
    public void addHalfExternalContact(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[add_half_external_contact],事件描述:[外部联系人免验证添加成员事件],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);

        RLock lock = customerService.getCustomerSyncLock(dto.getExtCorpId(), dto.getExternalUserId());
        try {
            if (customerService.trySyncLock(lock)) {
                refreshCustomer(dto);
                //渠道活码和应用宝
//                WxCpConfiguration.getExtCorpIdThread().set(dto.getExtCorpId());
                otherAddHandler(dto);
                //客户动态
                customerDynamicService.saveByQueue(WxCpConsts.ExternalContactChangeType.ADD_HALF_EXTERNAL_CONTACT, dto.getExtCorpId(), dto.getUserId(), dto.getExternalUserId(), null);
            }
        } catch (WxErrorException e) {
            e.printStackTrace();
            log.error("消费MQ异常:[add_half_external_contact],事件描述:[外部联系人免验证添加成员事件],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "调用企业微信接口异常", e);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[add_half_external_contact],事件描述:[外部联系人免验证添加成员事件],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "系统异常", e);
        } finally {
            customerService.releaseSyncLock(lock);
        }

    }

    /**
     * 监听事件: 修改客户
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = Constants.WX_UPDATE_EDIT_EXTERNAL_CONTACT)
    public void updateCustomer(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[edit_external_contact],事件描述:[修改客户],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        RLock lock = customerService.getCustomerSyncLock(dto.getExtCorpId(), dto.getExternalUserId());
        try {
            if (customerService.trySyncLock(lock)) {
                refreshCustomer(dto);
            }
        } catch (WxErrorException e) {
            e.printStackTrace();
            log.error("消费MQ异常:[edit_external_contact],事件描述:[修改客户],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "调用企业微信接口异常", e);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[edit_external_contact],事件描述:[修改客户],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "系统异常", e);
        } finally {
            customerService.releaseSyncLock(lock);
        }
    }

    /**
     * 监听事件: 新增客户
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = WxCpConsts.ExternalContactChangeType.ADD_EXTERNAL_CONTACT)
    public void addCustomer(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[add_external_contact],事件描述:[添加客户],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        RLock lock = customerService.getCustomerSyncLock(dto.getExtCorpId(), dto.getExternalUserId());
        try {
            if (customerService.trySyncLock(lock)) {
                refreshCustomer(dto, true);
                //渠道活码和应用宝
//                WxCpConfiguration.getExtCorpIdThread().set(dto.getExtCorpId());
                otherAddHandler(dto);
                //客户动态
                customerDynamicService.saveByQueue(WxCpConsts.ExternalContactChangeType.ADD_EXTERNAL_CONTACT, dto.getExtCorpId(), dto.getUserId(), dto.getExternalUserId(), null);
            }
        } catch (WxErrorException e) {
            e.printStackTrace();
            log.error("消费MQ异常:[add_external_contact],事件描述:[添加客户],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "调用企业微信接口异常", e);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[add_external_contact],事件描述:[添加客户],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "系统异常", e);
        } finally {
            customerService.releaseSyncLock(lock);
        }

    }

    private void otherAddHandler(WxCpXmlOutMessageDTO dto) {
        log.info("客户新增渠道分析开始...");
        try {
            for (AbstractUpdateCustomerHandler handler : getUpdateCustomerHandlerList()) {
                if (handler.match(dto.getExtCorpId(), dto.getUserId(), dto.getState())) {
                    log.info("客户新增渠道分析匹配到：" + handler);
                    handler.saveHandle(dto);
                }

            }
        } catch (Exception e) {
            log.error("客户新增渠道分析异常，[{}]，异常信息：", JSON.toJSONString(dto), e);
        }

    }


    /**
     * 监听事件: 客户接替失败事件
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/04/01 00:32
     */
    @RabbitListener(queues = Constants.WX_STAFF_CUSTOMER_TRANSFER_FAIL)
    public void staffCustomerTransferFail(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[transfer_fail],事件描述:[客户接替失败事件],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        RLock lock = customerService.getCustomerSyncLock(dto.getExtCorpId(), dto.getExternalUserId());
        try {
            if (customerService.trySyncLock(lock)) {
                refreshCustomer(dto);
                customerService.transferFail(new WxStaffCustomerTransferFailDTO()
                        .setExtCorpId(dto.getExtCorpId())
                        .setTakeoverStaffExtId(dto.getUserId())
                        .setCustomerExtId(dto.getExternalUserId())
                        .setFailReason(dto.getFailReason()));

            }
        } catch (WxErrorException e) {
            e.printStackTrace();
            log.error("消费MQ异常:[transfer_fail],事件描述:[客户接替失败事件],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "调用企业微信接口异常", e);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[transfer_fail],事件描述:[客户接替失败事件],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "系统异常", e);
        } finally {
            customerService.releaseSyncLock(lock);
        }
    }

    private void refreshCustomer(WxCpXmlOutMessageDTO dto) throws WxErrorException {
        refreshCustomer(dto, false);
    }


    /**
     * 刷新客户信息
     *
     * @param dto    请求参数
     * @param isSave 是否为新增（将是否移除员工状态置为false）
     * @throws WxErrorException
     */
    private void refreshCustomer(WxCpXmlOutMessageDTO dto, boolean isSave) throws WxErrorException {

        //渠道活码，判断是否是新客户
        checkNewCustomer(dto);

        if (isSave) {
            //如果在离职继承/在职继承中，给该客户新增标签，详情
            customerService.handlerTransfer(dto.getExtCorpId(),dto.getUserId(),dto.getExternalUserId());
        }

        //获取客户信息
        WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
        WxCpExternalContactInfo contactDetail = externalContactService.getContactDetail(dto.getExternalUserId(), null);
        List<FollowedUser> followedUsers = contactDetail.getFollowedUsers();
        buildWxCpExternalContactInfo(externalContactService, contactDetail.getNextCursor(), followedUsers, dto.getExternalUserId());

        //刷新客户信息
        followedUsers.forEach(followedUser -> {
            WxCpExternalContactBatchInfo.ExternalContactInfo externalContactInfo = new WxCpExternalContactBatchInfo.ExternalContactInfo();
            externalContactInfo.setExternalContact(contactDetail.getExternalContact());
            externalContactInfo.setFollowInfo(followedUser);
            if ((followedUser.getTagIds() == null || followedUser.getTagIds().length < 1) && followedUser.getTags() != null && followedUser.getTags().length > 0) {
                followedUser.setTagIds(Arrays.stream(followedUser.getTags()).filter(f -> f.getType() == 1).map(FollowedUser.Tag::getTagId).toArray(String[]::new));
            }
            WxCustomer customer = customerService.refreshCustomer(externalContactInfo, dto.getExtCorpId());

            WxCustomerStaff customerStaff = customerStaffService.checkExists(dto.getExtCorpId(), followedUser.getUserId(), dto.getExternalUserId());

            if (isSave) {
                if (customer != null) {
                    customerService.updateById(customer.setIsDeletedStaff(false));
                }

                //设置当前跟进信息未被客户删除
                if (customerStaff != null && dto.getUserId().equals(customerStaff.getExtStaffId())) {
                    customerStaffService.updateById(customerStaff.setIsDeletedStaff(false));
                }
            }

        });

    }

    private void checkNewCustomer(WxCpXmlOutMessageDTO dto) {

        dto.setIsNewCustomer(!customerService.countByCustomerId(dto.getExtCorpId(), dto.getExternalUserId()));

    }


    private void buildWxCpExternalContactInfo(WxCpExternalContactService externalContactService, String nextCursor, List<FollowedUser> followedUsers, String userId) throws WxErrorException {
        if (StringUtils.isNotBlank(nextCursor)) {
            WxCpExternalContactInfo contactDetail = externalContactService.getContactDetail(userId, nextCursor);
            followedUsers.addAll(contactDetail.getFollowedUsers());
            buildWxCpExternalContactInfo(externalContactService, nextCursor, followedUsers, userId);
        }

    }

    private List<AbstractUpdateCustomerHandler> getUpdateCustomerHandlerList() {

        if (updateCustomerHandlerList == null) {
            Map<String, AbstractUpdateCustomerHandler> handlerMap = SpringUtils.getBeanMap(AbstractUpdateCustomerHandler.class);
            updateCustomerHandlerList = new ArrayList<>(handlerMap.values());

            updateCustomerHandlerList.sort(Comparator.comparingInt(AbstractUpdateCustomerHandler::getSort));
        }

        return updateCustomerHandlerList;
    }

}
