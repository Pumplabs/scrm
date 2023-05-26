package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.entity.BrProductInfo;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.dto.BrProductInfoPageDTO;
import com.scrm.server.wx.cp.dto.BrProductInfoSaveDTO;
import com.scrm.server.wx.cp.dto.BrProductInfoUpdateDTO;

import com.scrm.server.wx.cp.dto.BrProductInfoQueryDTO;
import com.scrm.server.wx.cp.vo.BrProductInfoVO;

import com.scrm.api.wx.cp.dto.*;

import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;

/**
 * 产品信息 服务类
 * @author xxh
 * @since 2022-07-17
 */
public interface IBrProductInfoService extends IService<BrProductInfo> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-07-17
     * @param dto 请求参数
     */
    IPage<BrProductInfoVO> pageList(BrProductInfoPageDTO dto);

    /**
     * 查询列表
     * @author xxh
     * @date 2022-07-17
     * @param dto 请求参数
     */
    List<BrProductInfoVO> queryList(BrProductInfoQueryDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-07-17
     * @param id 主键
     */
    BrProductInfoVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-07-17
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrProductInfo
     */
    BrProductInfo save(BrProductInfoSaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2022-07-17
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.BrProductInfo
      */
    BrProductInfo update(BrProductInfoUpdateDTO dto);


    /**
     * 删除
     * @author xxh
     * @date 2022-07-17
     * @param id 产品id
     */
    void delete(String id);

    /**
     * 批量删除
     * @author xxh
     * @date 2022-07-17
     * @param dto 请求参数
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-07-17
     * @param id 产品id
     * @return com.scrm.server.wx.cp.entity.BrProductInfo
     */
    BrProductInfo checkExists(String id);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-07-17
     * @param id 产品分类id
     */
    void addViews(String id);
}
