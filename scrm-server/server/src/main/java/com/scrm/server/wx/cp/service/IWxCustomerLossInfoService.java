package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.vo.WxCustomerLossStatisticsVO;
import com.scrm.api.wx.cp.dto.WxCustomerLossInfoPageDTO;
import com.scrm.api.wx.cp.dto.WxCustomerLossInfoSaveDTO;
import com.scrm.api.wx.cp.dto.WxCustomerLossInfoUpdateDTO;
import com.scrm.api.wx.cp.entity.WxCustomerLossInfo;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.vo.WxCustomerLossInfoVO;
import com.baomidou.mybatisplus.core.metadata.IPage;

/**
 * 客户流失情况信息 服务类
 * @author xxh
 * @since 2022-03-26
 */
public interface IWxCustomerLossInfoService extends IService<WxCustomerLossInfo> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-03-26
     * @param dto 请求参数
     */
    IPage<WxCustomerLossInfoVO> pageList(WxCustomerLossInfoPageDTO dto);


    /**
     * 根据id查询
     * @author xxh
     * @date 2022-03-26
     * @param id 主键
     */
    WxCustomerLossInfoVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-03-26
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.WxCustomerLossInfo
     */
    WxCustomerLossInfo save(WxCustomerLossInfoSaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2022-03-26
      * @param dto 请求参数
      * @return com.scrm.api.wx.cp.entity.WxCustomerLossInfo
      */
    WxCustomerLossInfo update(WxCustomerLossInfoUpdateDTO dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-03-26
     * @param id 客户流失情况信息id
     * @return com.scrm.api.wx.cp.entity.WxCustomerLossInfo
     */
    WxCustomerLossInfo checkExists(String id);

    /**
     * 获取流失统计信息
     * @author xxh
     * @date 2022-03-26
     * @param extCorpId 企业id
     * @return com.scrm.api.wx.cp.entity.WxCustomerLossInfo
     */
    WxCustomerLossStatisticsVO getStatistics(String extCorpId);

    /**
     * 检查这个有没有
     * @param extCorpId
     * @param extCustomerId
     * @return
     */
    boolean checkExists(String extCorpId, String extCustomerId);
}
