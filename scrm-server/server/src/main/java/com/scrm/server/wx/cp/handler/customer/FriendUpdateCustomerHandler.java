package com.scrm.server.wx.cp.handler.customer;

import com.scrm.api.wx.cp.dto.WxCpXmlOutMessageDTO;
import com.scrm.api.wx.cp.dto.WxMsgDTO;
import com.scrm.server.wx.cp.service.IBrFriendWelcomeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/24 19:58
 * @description：好友欢迎语
 **/
@Slf4j
@Service
public class FriendUpdateCustomerHandler extends CommonUpdateCustomerHandler {

    @Autowired
    private IBrFriendWelcomeService friendWelcomeService;

    @Override
    public boolean match(String extCorpId, String extStaffId, String state) {

        //这个员工要发欢迎语就返回true，不用发欢迎语就返回false
        return friendWelcomeService.getMxgByStaffExtId(extCorpId, extStaffId) != null;
    }

    /**
     * 在这里发送欢迎语
     *
     * @param dto
     */
    @Override
    public void saveHandle(WxCpXmlOutMessageDTO dto) {
        WxMsgDTO msgDTO = friendWelcomeService.getMxgByStaffExtId(dto.getExtCorpId(), dto.getUserId());
        if (msgDTO != null) {
            sendMsg(dto, msgDTO);
        }
    }
}
