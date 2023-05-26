package com.scrm.server.wx.cp.handler.customer;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.scrm.api.wx.cp.dto.WxCpXmlOutMessageDTO;
import com.scrm.api.wx.cp.dto.WxCustomerTagSaveOrUpdateDTO;
import com.scrm.api.wx.cp.entity.ContactWay;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.common.constant.Constants;
import com.scrm.common.util.ListUtils;
import com.scrm.server.wx.cp.service.IContactWayService;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.service.IWxCustomerService;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.external.WxCpUpdateRemarkRequest;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/2 14:36
 * @description：渠道活码欢迎语
 **/
@Slf4j
@Service
public class ContactUpdateCustomerHandler extends CommonUpdateCustomerHandler {

    @Autowired
    private IContactWayService contactWayService;

    @Autowired
    private IWxCustomerService wxCustomerService;

    @Autowired
    private IStaffService staffService;

    @Override
    public int getSort() {
        return 1;
    }

    @Override
    public boolean match(String extCorpId, String extStaffId, String state) {
        return StringUtils.isNotBlank(state) && state.startsWith(Constants.CONTACT_WAY_STATE_PRE);
    }

    @Override
    @Transactional
    public void saveHandle(WxCpXmlOutMessageDTO wxMessage) {
        ContactWay contactWay = contactWayService.getOne(new QueryWrapper<ContactWay>().lambda()
                .eq(ContactWay::getExtCorpId, wxMessage.getExtCorpId())
                .eq(ContactWay::getState, wxMessage.getState()), false);

        if (contactWay == null) {
            log.error("渠道活码新增回调，找不到对应的state=[{}]", JSON.toJSONString(wxMessage));
            return;
        }

        //先发欢迎语，防止超时
        if (contactWay.getAutoReplyType() == ContactWay.REPLY_SELF) {
            sendMsg(wxMessage, contactWay.getReplyInfo());
        }

        //扫码添加人数+1
        contactWay.setAddCustomerCount(Optional.ofNullable(contactWay.getAddCustomerCount()).orElse(0) + 1);
        contactWayService.updateById(contactWay);
        WxCustomer wxCustomer = wxCustomerService.checkExists(wxMessage.getExtCorpId(), wxMessage.getExternalUserId());
        
        //打标
        if (contactWay.getAutoTagEnable() && ListUtils.isNotEmpty(contactWay.getCustomerTagExtIds())) {
            WxCustomerTagSaveOrUpdateDTO dto = new WxCustomerTagSaveOrUpdateDTO();
            dto.setId(wxCustomer.getId()).setExtCorpId(wxCustomer.getExtCorpId())
                    .setAddTags(contactWay.getCustomerTagExtIds())
                    .setOrigin(Constants.DYNAMIC_TAG_TYPE_CONTACT)
                    .setOperatorExtId(wxMessage.getUserId())
                    .setStaffId(staffService.checkExists(wxMessage.getUserId(), wxMessage.getExtCorpId()).getId());

            wxCustomerService.queueEditTag(dto);

        }

        //客户备注和客户描述
        boolean needUpdate = false;
        WxCpUpdateRemarkRequest remarkRequest = new WxCpUpdateRemarkRequest();
        remarkRequest.setUserId(wxMessage.getUserId());
        remarkRequest.setExternalUserId(wxMessage.getExternalUserId());
        //客户备注
        if (contactWay.getCustomerRemarkEnable() && StringUtils.isNotBlank(contactWay.getCustomerRemark())) {
            needUpdate = true;
            remarkRequest.setRemark(wxCustomer.getName() + "-" + contactWay.getCustomerRemark());
        }
        //客户描述
        if (contactWay.getCustomerDescEnable()) {
            needUpdate = true;
            remarkRequest.setDescription(contactWay.getCustomerDesc());
        }
        if (needUpdate) {
            try {
                wxCustomerService.updateRemark(remarkRequest, wxMessage.getExtCorpId());
            } catch (WxErrorException e) {
                log.error("渠道活码回调，给客户打备注或描述失败，参数=[{}],[{}]", JSON.toJSONString(wxMessage), JSON.toJSONString(remarkRequest));
            }
        }

        //看是否有员工上限,有员工上限要更新码的员工
        if (contactWay.getDailyAddCustomerLimitEnable()) {
            contactWayService.updateRealityStaff(contactWay.getId());
        }
    }

    @Override
    public void deleteHandle(WxCpXmlOutMessageDTO dto) {
        super.deleteHandle(dto);
    }
}
