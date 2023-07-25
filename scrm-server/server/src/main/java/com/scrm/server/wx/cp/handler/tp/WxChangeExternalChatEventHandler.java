package com.scrm.server.wx.cp.handler.tp;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.scrm.api.wx.cp.dto.WxCpXmlOutMessageDTO;
import com.scrm.api.wx.cp.entity.WxGroupChat;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.constant.Constants;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.builder.TextBuilder;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.handler.AbstractHandler;
import com.scrm.server.wx.cp.service.IBrCustomerDynamicService;
import com.scrm.server.wx.cp.service.IWxGroupChatService;
import com.scrm.server.wx.cp.service.IWxGroupChatStatisticsService;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.cp.api.WxCpExternalContactService;
import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.api.impl.WxCpExternalContactServiceImpl;
import me.chanjar.weixin.cp.bean.message.WxCpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlOutMessage;
import me.chanjar.weixin.cp.constant.WxCpConsts;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/***
 * @author xuxh
 * @date 2022/4/28 17:27
 */
@Slf4j
@Service(WxCpConsts.EventType.CHANGE_EXTERNAL_CHAT)
public class WxChangeExternalChatEventHandler extends AbstractHandler {


    @Autowired
    private IWxGroupChatService groupChatService;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private WxCpConfiguration wxCpConfiguration;

    @Autowired
    private IWxGroupChatStatisticsService groupChatStatisticsService;

    @Autowired
    private IBrCustomerDynamicService customerDynamicService;

    @Override
    public WxCpXmlOutMessage handle(WxCpXmlMessage wxMessage, Map<String, Object> map, WxCpService wxCpTpService, WxSessionManager wxSessionManager) throws WxErrorException {
        WxCpXmlOutMessageDTO dto = new WxCpXmlOutMessageDTO();
        BeanUtils.copyProperties(wxMessage, dto);
        dto.setExtCorpId(ScrmConfig.getExtCorpID());
        log.debug("群聊相关mq发送：[{}], [{}]", wxMessage.getChangeType(), JSON.toJSONString(dto));
        //修改群聊
        if (Constants.WX_CHANGE_TYPE_UPDATE.equals(wxMessage.getChangeType())) {
            //发送MQ异步处理
            String updateDetail = (String) wxMessage.getAllFieldsMap().get("UpdateDetail");
            List<String> updateDetailInfos = Arrays.asList(Constants.WX_UPDATE_DETAIL_CHANGE_OWNER, Constants.WX_UPDATE_DETAIL_CHANGE_NAME, Constants.WX_UPDATE_DETAIL_CHANGE_NOTICE);
            //如果都是修改了详情数据，发同一个队列中
            if (updateDetailInfos.contains(updateDetail)) {
                rabbitTemplate.convertAndSend(Constants.WX_UPDATE_DETAIL, dto);
            } else {
                rabbitTemplate.convertAndSend(updateDetail, dto);
            }
        } else {
            rabbitTemplate.convertAndSend(wxMessage.getChangeType(), dto);
        }

        try {
            String content = "感谢反馈，您的信息已收到！";
            return new TextBuilder().build(content, wxMessage, null);
        } catch (Exception e) {
            log.error("联系人变更消息接收异常", e);
            return null;
        }
    }


    /**
     * 监听事件: 成员退群
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = Constants.WX_UPDATE_DETAIL_DEL_MEMBER)
    @Transactional(rollbackFor = Exception.class)
    public void updateDetailDelMemberListener(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[del_member],事件描述:[成员退群],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        try {
            WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(wxCpConfiguration.getWxCpService());
            groupChatService.saveOrUpdate(dto.getExtCorpId(), dto.getChatId(), null, externalContactService);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[del_member],事件描述:[成员退群],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "系统异常", e);
        }
    }

    /**
     * 监听事件: 成员入群
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = Constants.WX_UPDATE_DETAIL_ADD_MEMBER)
    @Transactional(rollbackFor = Exception.class)
    public void updateDetailAddMemberListener(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[add_member],事件描述:[成员入群],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        try {
            WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(wxCpConfiguration.getWxCpService());
            groupChatService.saveOrUpdate(dto.getExtCorpId(), dto.getChatId(), null, externalContactService);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[add_member],事件描述:[成员入群],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "系统异常", e);
        }
    }


    /**
     * 监听事件: 群公告变更
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = Constants.WX_UPDATE_DETAIL)
    @Transactional(rollbackFor = Exception.class)
    public void updateDetailChangeNoticeListener(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[change_detail],事件描述:[群详情变更],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        try {
            WxGroupChat groupChat = groupChatService.getOne(new LambdaQueryWrapper<WxGroupChat>()
                    .eq(WxGroupChat::getExtCorpId, dto.getExtCorpId())
                    .eq(WxGroupChat::getExtChatId, dto.getChatId())
            );

            //修改详情信息
            if (groupChat != null) {
                WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
                groupChatService.saveOrUpdate(dto.getExtCorpId(), dto.getChatId(), WxGroupChat.STATUS_NORMAL, externalContactService);
            }
        } catch (WxErrorException e) {
            e.printStackTrace();
            log.error("消费MQ异常:[change_detail],事件描述:[群详情变更],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "调用企业微信接口异常", e);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[change_detail],事件描述:[群详情变更],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "系统异常", e);
        }
    }

    /**
     * 监听事件: 新增群聊
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = Constants.WX_CHANGE_TYPE_CREATE)
    @Transactional(rollbackFor = Exception.class)
    public void createGroupChat(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[create],事件描述:[新增群聊],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        try {
            WxGroupChat groupChat = groupChatService.getOne(new LambdaQueryWrapper<WxGroupChat>()
                    .eq(WxGroupChat::getExtCorpId, dto.getExtCorpId())
                    .eq(WxGroupChat::getExtChatId, dto.getChatId())
            );

            //新增群聊
            if (groupChat == null) {
                WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
                groupChatService.saveOrUpdate(dto.getExtCorpId(), dto.getChatId(), null, externalContactService);
            }
        } catch (WxErrorException e) {
            e.printStackTrace();
            log.error("消费MQ异常:[create],事件描述:[新增群聊],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "调用企业微信接口异常", e);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[create],事件描述:[新增群聊],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "系统异常", e);
        }
    }

    /**
     * 监听事件: 解散群聊
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = WxCpConsts.ExternalChatChangeType.DISMISS)
    @Transactional(rollbackFor = Exception.class)
    public void dismissGroupChat(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[dismiss],事件描述:[解散群聊],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        try {
            groupChatService.delete(dto.getExtCorpId(), dto.getChatId());
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[dismiss],事件描述:[解散群聊],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "系统异常", e);
        }
    }

}
