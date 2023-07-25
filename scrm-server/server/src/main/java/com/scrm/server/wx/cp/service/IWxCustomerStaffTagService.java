package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.entity.WxTag;
import com.scrm.common.dto.BatchDTO;
import com.scrm.api.wx.cp.entity.WxCustomerStaffTag;
import com.baomidou.mybatisplus.extension.service.IService;

import java.util.List;

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

    /**
     * 获取员工-客户标签
     * @param extCorpId 企业ID
     * @param staffExtId 员工extId
     * @param customerExtId 客户extId
     * @return
     */
    List<WxTag> findTagList(String extCorpId, String staffExtId, String customerExtId);
}
