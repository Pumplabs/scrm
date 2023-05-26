package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.entity.BrSopDetail;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.dto.BrSopDetailPageDTO;
import com.scrm.server.wx.cp.dto.BrSopDetailSaveDTO;
import com.scrm.server.wx.cp.dto.BrSopDetailUpdateDTO;

import com.scrm.server.wx.cp.dto.BrSopDetailQueryDTO;
import com.scrm.server.wx.cp.vo.BrSopDetailVO;

import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;

/**
 * 群sop-规则执行详情表 服务类
 * @author ouyang
 * @since 2022-04-17
 */
public interface IBrSopDetailService extends IService<BrSopDetail> {


    /**
     * 分页查询
     * @author ouyang
     * @date 2022-04-17
     * @param dto 请求参数
     */
    IPage<BrSopDetailVO> pageList(BrSopDetailPageDTO dto);

    /**
     * 查询列表
     * @author ouyang
     * @date 2022-04-17
     * @param dto 请求参数
     */
    List<BrSopDetailVO> queryList(BrSopDetailQueryDTO dto);

    /**
     * 根据id查询
     * @author ouyang
     * @date 2022-04-17
     * @param id 主键
     */
    BrSopDetailVO findById(String id);


    /**
     * 新增
     * @author ouyang
     * @date 2022-04-17
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrSopDetail
     */
    BrSopDetail save(BrSopDetailSaveDTO dto);

     /**
      * 修改
      * @author ouyang
      * @date 2022-04-17
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.BrSopDetail
      */
    BrSopDetail update(BrSopDetailUpdateDTO dto);


    /**
     * 删除
     * @author ouyang
     * @date 2022-04-17
     * @param id 群sop-规则执行详情表id
     */
    void delete(String id);

    /**
     * 批量删除
     * @author ouyang
     * @date 2022-04-17
     * @param dto 请求参数
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author ouyang
     * @date 2022-04-17
     * @param id 群sop-规则执行详情表id
     * @return com.scrm.server.wx.cp.entity.BrSopDetail
     */
    BrSopDetail checkExists(String id);

}
