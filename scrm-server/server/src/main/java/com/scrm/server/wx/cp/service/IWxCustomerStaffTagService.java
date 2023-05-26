package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.api.wx.cp.entity.WxCustomerStaffTag;
import com.baomidou.mybatisplus.extension.service.IService;

/**
 * 客户标签 服务类
 * @author xxh
 * @since 2022-01-02
 */
public interface IWxCustomerStaffTagService extends IService<WxCustomerStaffTag> {


    /**
     * 批量删除
     * @param tagExtIds 标签id列表
     */
    void batchDelete(BatchDTO<String> tagExtIds);
}
