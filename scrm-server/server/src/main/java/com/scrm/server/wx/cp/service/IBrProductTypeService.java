package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.entity.BrProductType;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.dto.BrProductTypePageDTO;
import com.scrm.server.wx.cp.dto.BrProductTypeSaveDTO;
import com.scrm.server.wx.cp.dto.BrProductTypeUpdateDTO;

import com.scrm.server.wx.cp.dto.BrProductTypeQueryDTO;
import com.scrm.server.wx.cp.vo.BrProductTypeVO;

import com.scrm.api.wx.cp.dto.*;

import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;

/**
 * 产品分类 服务类
 * @author xxh
 * @since 2022-07-17
 */
public interface IBrProductTypeService extends IService<BrProductType> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-07-17
     * @param dto 请求参数
     */
    IPage<BrProductTypeVO> pageList(BrProductTypePageDTO dto);

    /**
     * 查询列表
     * @author xxh
     * @date 2022-07-17
     * @param dto 请求参数
     */
    List<BrProductTypeVO> queryList(BrProductTypeQueryDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-07-17
     * @param id 主键
     */
    BrProductTypeVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-07-17
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrProductType
     */
    BrProductType save(BrProductTypeSaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2022-07-17
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.BrProductType
      */
    BrProductType update(BrProductTypeUpdateDTO dto);


    /**
     * 删除
     * @author xxh
     * @date 2022-07-17
     * @param id 产品分类id
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
     * @param id 产品分类id
     * @return com.scrm.server.wx.cp.entity.BrProductType
     */
    BrProductType checkExists(String id);

}
