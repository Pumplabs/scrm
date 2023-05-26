package com.scrm.server.wx.cp.handler.customer;

import com.scrm.api.wx.cp.dto.WxCpXmlOutMessageDTO;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.server.wx.cp.service.IBrSopService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/24 19:58
 * @description：创建sop定时任务
 **/
@Slf4j
@Service
public class FriendUpdateSopHandler extends CommonUpdateCustomerHandler {

    @Autowired
    private IBrSopService sopService;

    @Override
    public boolean match(String extCorpId, String extStaffId, String state) {

        return true;
    }

    /**
     * 创建sop定时任务
     *
     * @param dto
     */
    @Override
    public void saveHandle(WxCpXmlOutMessageDTO dto) {
        WxCustomer customer = new WxCustomer();
        customer.setExtCorpId(dto.getExtCorpId()).setCreatedAt(new Date())
                .setExtId(dto.getExternalUserId()).setExtCreatorId(dto.getUserId());

        sopService.createTaskForAddFriend(customer);
    }
}
