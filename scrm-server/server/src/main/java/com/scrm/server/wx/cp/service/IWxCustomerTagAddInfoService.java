package com.scrm.server.wx.cp.service;

import com.scrm.server.wx.cp.entity.WxCustomerTagAddInfo;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.dto.WxCustomerTagAddInfoSaveDTO;
import com.scrm.server.wx.cp.dto.WxCustomerTagAddInfoUpdateDTO;

import com.scrm.server.wx.cp.dto.WxCustomerTagAddInfoQueryDTO;
import com.scrm.server.wx.cp.vo.WxCustomerTagAddInfoVO;

import com.scrm.api.wx.cp.dto.*;

import java.util.List;

/**
 * 企业微信客户-批量添加标签明细 服务类
 * @author xxh
 * @since 2022-04-12
 */
public interface IWxCustomerTagAddInfoService extends IService<WxCustomerTagAddInfo> {


    /**
     * 查询列表
     * @author xxh
     * @date 2022-04-12
     * @param dto 请求参数
     */
    List<WxCustomerTagAddInfoVO> queryList(WxCustomerTagAddInfoQueryDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-04-12
     * @param id 主键
     */
    WxCustomerTagAddInfoVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-04-12
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.WxCustomerTagAddInfo
     */
    WxCustomerTagAddInfo save(WxCustomerTagAddInfoSaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2022-04-12
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.WxCustomerTagAddInfo
      */
    WxCustomerTagAddInfo update(WxCustomerTagAddInfoUpdateDTO dto);



    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-04-12
     * @param id 企业微信客户-批量添加标签明细id
     * @return com.scrm.server.wx.cp.entity.WxCustomerTagAddInfo
     */
    WxCustomerTagAddInfo checkExists(String id);

}
