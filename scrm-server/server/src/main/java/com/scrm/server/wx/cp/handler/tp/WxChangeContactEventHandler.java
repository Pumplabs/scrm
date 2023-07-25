package com.scrm.server.wx.cp.handler.tp;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.scrm.api.wx.cp.dto.DepartmentSaveDTO;
import com.scrm.api.wx.cp.dto.DepartmentUpdateDTO;
import com.scrm.api.wx.cp.dto.WxCpXmlOutMessageDTO;
import com.scrm.api.wx.cp.entity.Department;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.builder.TextBuilder;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.handler.AbstractHandler;
import com.scrm.server.wx.cp.service.*;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.cp.api.WxCpDepartmentService;
import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.api.WxCpUserService;
import me.chanjar.weixin.cp.api.impl.WxCpDepartmentServiceImpl;
import me.chanjar.weixin.cp.api.impl.WxCpUserServiceImpl;
import me.chanjar.weixin.cp.bean.WxCpDepart;
import me.chanjar.weixin.cp.bean.WxCpUser;
import me.chanjar.weixin.cp.bean.message.WxCpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlOutMessage;
import me.chanjar.weixin.cp.constant.WxCpConsts;
import me.chanjar.weixin.cp.constant.WxCpTpConsts;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Date;
import java.util.Map;

/**
 * @author xuxh
 * @date 2022/3/14 10:50
 */
@Slf4j
@Service(WxCpTpConsts.InfoType.CHANGE_CONTACT)
@Transactional(rollbackFor = Exception.class)
public class WxChangeContactEventHandler extends AbstractHandler {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IDepartmentService departmentService;

    @Autowired
    private WxCpConfiguration wxCpConfiguration;

    @Autowired
    private IBrCorpAccreditService accreditService;


    @Override
    public WxCpXmlOutMessage handle(WxCpXmlMessage wxMessage, Map<String, Object> map, WxCpService wxCpService, WxSessionManager wxSessionManager) throws WxErrorException {
        WxCpXmlOutMessageDTO dto = new WxCpXmlOutMessageDTO();
        BeanUtils.copyProperties(wxMessage, dto);
        dto.setExtCorpId(ScrmConfig.getExtCorpID());
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
     * 监听事件: 创建部门
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = WxCpConsts.ContactChangeType.CREATE_PARTY)
    public void createPartyListener(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[create_party],事件描述:[创建部门],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        log.info("======================{}", JSONObject.toJSONString(dto));
        try {
            Department department = departmentService.getOne(new QueryWrapper<Department>().lambda()
                    .eq(Department::getExtId, Long.valueOf(dto.getId()))
                    .eq(Department::getExtCorpId, dto.getExtCorpId()));
            if (department == null) {
                DepartmentSaveDTO departmentSaveDTO = new DepartmentSaveDTO()
                        .setExtId(Long.valueOf(dto.getId()))
                        .setExtCorpId(dto.getExtCorpId())
                        .setExtParentId(Long.valueOf(dto.getParentId()))
                        .setName(dto.getId())
                        .setOrder(1l)
                        .setCreateTime(dto.getCreateTime() == null ? new Date() : new Date(dto.getCreateTime() * 1000))
                        .setNeedSynToWx(false);
                departmentService.save(departmentSaveDTO);
            }
        } catch (WxErrorException e) {
            e.printStackTrace();
            log.error("消费MQ异常:[create_party],事件描述:[创建部门],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto.toString(), "调用企业微信接口异常", e);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[create_party],事件描述:[创建部门],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto.toString(), "系统异常", e);
        }
    }


    /**
     * 监听事件: 修改部门
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = WxCpConsts.ContactChangeType.UPDATE_PARTY)
    public void updatePartyListener(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[update_party],事件描述:[修改部门],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        try {
            Department department = departmentService.getOne(new QueryWrapper<Department>().lambda()
                    .eq(Department::getExtId, Long.valueOf(dto.getId()))
                    .eq(Department::getExtCorpId, dto.getExtCorpId()));
            if (department == null) {
                DepartmentSaveDTO departmentSaveDTO = new DepartmentSaveDTO()
                        .setExtId(Long.valueOf(dto.getId()))
                        .setExtCorpId(dto.getExtCorpId())
                        .setExtParentId(Long.valueOf(dto.getParentId()))
                        .setName(dto.getId())
                        .setOrder(1l)
                        .setCreateTime(dto.getCreateTime() == null ? new Date() : new Date(dto.getCreateTime() * 1000))
                        .setNeedSynToWx(false);
                departmentService.save(departmentSaveDTO);
            } else {
                department.setName(dto.getId())
                        .setExtParentId(Long.valueOf(dto.getParentId()));
                DepartmentUpdateDTO updateDTO = new DepartmentUpdateDTO();
                BeanUtils.copyProperties(department, updateDTO);
                departmentService.update(updateDTO.setNeedSynToWx(false));
            }
        } catch (WxErrorException e) {
            e.printStackTrace();
            log.error("消费MQ异常:[update_party],事件描述:[修改部门],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto.toString(), "调用企业微信接口异常", e);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[update_party],事件描述:[修改部门],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto.toString(), "系统异常", e);
        }
    }


    /**
     * 监听事件: 删除部门
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = WxCpConsts.ContactChangeType.DELETE_PARTY)
    public void deletePartyListener(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[delete_party],事件描述:[删除部门],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        try {
            Department department = departmentService.getOne(new QueryWrapper<Department>().lambda()
                    .eq(Department::getExtId, Long.valueOf(dto.getId()))
                    .eq(Department::getExtCorpId, dto.getExtCorpId()));
            if (department != null) {
                departmentService.delete(department.getId(), false);
            }
        } catch (WxErrorException e) {
            e.printStackTrace();
            log.error("消费MQ异常:[delete_party],事件描述:[删除部门],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto.toString(), "调用企业微信接口异常", e);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[delete_party],事件描述:[删除部门],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto.toString(), "系统异常", e);
        }
    }

    /**
     * 监听事件: 用户修改
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = WxCpConsts.ContactChangeType.UPDATE_USER)
    public void updateUserListener(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[update_user],事件描述:[用户修改],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        try {
            WxCpUserService userService = new WxCpUserServiceImpl(WxCpConfiguration.getAddressBookWxCpService());
            WxCpUser user = userService.getById(dto.getUserId());
            staffService.saveOrUpdateUser(user, dto.getExtCorpId());
//            accreditService.getSeeStaffFromRedis(dto.getExtCorpId(), true);
        } catch (WxErrorException e) {
            e.printStackTrace();
            log.error("消费MQ异常:[update_user],事件描述:[用户修改],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto.toString(), "调用企业微信接口异常", e);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[update_user],事件描述:[用户修改],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto.toString(), "系统异常", e);
        }
    }


    /**
     * 监听事件: 用户删除
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = WxCpConsts.ContactChangeType.DELETE_USER)
    public void deleteUserListener(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[delete_user],事件描述:[用户删除],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto.toString());
        try {
            Staff staff = staffService.find(dto.getExtCorpId(), dto.getUserId());

            //修改详情信息
            if (staff != null) {
                staffService.batchDelete(new BatchDTO<String>().setIds(Collections.singletonList(staff.getId())), false);
            }

        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[delete_user],事件描述:[用户删除],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto.toString(), "系统异常", e.toString());
        }
    }

    /**
     * 监听事件: 用户新增
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = WxCpConsts.ContactChangeType.CREATE_USER)
    public void createUserListener(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[create_user],事件描述:[用户新增],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto.toString());
        try {
            WxCpUserService userService = new WxCpUserServiceImpl(wxCpConfiguration.getWxCpService());


            /**
             * TODO
             * 用户可见范围问题
             */
            WxCpUser user = userService.getById(dto.getUserId());
            staffService.saveOrUpdateUser(user, dto.getExtCorpId());
//            accreditService.getSeeStaffFromRedis(dto.getExtCorpId(), true);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[create_user],事件描述:[用户新增],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto.toString(), "系统异常", e);
        }
    }

    /**
     * 监听事件: 用户新增
     *
     * @param dto 消息
     * @author xuxh
     * @date 2022/2/16 10:29
     */
    @RabbitListener(queues = WxCpConsts.ContactChangeType.UPDATE_TAG)
    public void updateTag(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[update_tag],事件描述:[标签变更],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto.toString());
        try {
            staffService.sync(dto.getExtCorpId());
//            accreditService.getSeeStaffFromRedis(dto.getExtCorpId(), true);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[update_tag],事件描述:[标签变更],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto.toString(), "系统异常", e);
        }
    }

}
