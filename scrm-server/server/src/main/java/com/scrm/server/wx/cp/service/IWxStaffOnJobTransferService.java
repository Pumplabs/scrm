package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.dto.StaffOnJobTransferCustomerDTO;
import com.scrm.api.wx.cp.vo.StaffTransferCustomerVO;

public interface IWxStaffOnJobTransferService {

    /**
     * 企业员工转移客户
     * @author xuxh
     * @date 2022/3/05 18:18
     * @param dto 请求参数
     */
    StaffTransferCustomerVO transferCustomer(StaffOnJobTransferCustomerDTO dto);
}
