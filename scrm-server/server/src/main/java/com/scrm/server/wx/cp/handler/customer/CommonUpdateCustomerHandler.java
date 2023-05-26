package com.scrm.server.wx.cp.handler.customer;

import com.alibaba.fastjson.JSON;
import com.scrm.api.wx.cp.dto.WxCpXmlOutMessageDTO;
import com.scrm.api.wx.cp.dto.WxMsgDTO;
import com.scrm.server.wx.cp.service.IWxCustomerService;
import com.scrm.server.wx.cp.utils.WxMsgUtils;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.cp.bean.external.WxCpWelcomeMsg;
import me.chanjar.weixin.cp.bean.external.contact.WxCpExternalContactInfo;
import me.chanjar.weixin.cp.bean.message.WxCpXmlMessage;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/2 14:09
 * @description：默认的新增客户后的回调
 **/
@Slf4j
@Service
public class CommonUpdateCustomerHandler implements AbstractUpdateCustomerHandler {

    @Autowired
    private IWxCustomerService wxCustomerService;

    @Override
    public int getSort() {
        return Integer.MAX_VALUE;
    }

    @Override
    public boolean match(String extCorpId, String extStaffId, String state) {
        return false;
    }

    @Override
    public void saveHandle(WxCpXmlOutMessageDTO dto){

    }

    @Override
    public void deleteHandle(WxCpXmlOutMessageDTO dto) {

    }

    void sendMsg(WxCpXmlOutMessageDTO dto, WxMsgDTO msgDTO){
        if (StringUtils.isBlank(dto.getWelcomeCode())) {
            log.info("[{}]客户不是首次添加，不需要发送欢迎语", JSON.toJSONString(dto));
            return;
        }

        WxCpWelcomeMsg msg = changeWelcomeMsg(dto, msgDTO);
        wxCustomerService.sendWelcomeMsg(msg);
        dto.setWelcomeCode(null);
        log.info("发送欢迎语成功，[{}],[{}], [{}]", JSON.toJSONString(dto), JSON.toJSONString(msgDTO), JSON.toJSONString(msg));

    }

    /**
     * 转换成欢迎语数据
     * @param wxMessage
     * @param wxMsgDTO
     * @return
     */
    private WxCpWelcomeMsg changeWelcomeMsg(WxCpXmlMessage wxMessage, WxMsgDTO wxMsgDTO) {
        WxCpWelcomeMsg result = new WxCpWelcomeMsg();

        //发送欢迎语的码
        result.setWelcomeCode(wxMessage.getWelcomeCode());

        //文本内容，拿客户昵称做占位符
        WxCpExternalContactInfo customInfo = wxCustomerService.getCustomInfo(wxMessage.getExternalUserId());

        result.setText(WxMsgUtils.changeToText(wxMsgDTO, customInfo.getExternalContact().getName()));

        //附件
        result.setAttachments(WxMsgUtils.changeToAttachment(wxMsgDTO, wxMessage.getUserId()));
        return result;
    }
}
