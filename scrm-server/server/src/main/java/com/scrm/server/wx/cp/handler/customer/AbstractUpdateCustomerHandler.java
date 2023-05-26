package com.scrm.server.wx.cp.handler.customer;

import com.scrm.api.wx.cp.dto.WxCpXmlOutMessageDTO;

public interface AbstractUpdateCustomerHandler {

    /**
     * 获取判断顺序
     * @return
     */
    int getSort();

    /**
     * 判断是否要用这个处理器，true就用，false不用
     * @return
     */
    boolean match(String extCorpId, String extStaffId, String state);

    /**
     * 新增客户回调处理
     * @param dto
     */
    void saveHandle(WxCpXmlOutMessageDTO dto);

    /**
     * 客户删除员工或者反过来回调处理
     * @param dto
     */
    void deleteHandle(WxCpXmlOutMessageDTO dto);
}
