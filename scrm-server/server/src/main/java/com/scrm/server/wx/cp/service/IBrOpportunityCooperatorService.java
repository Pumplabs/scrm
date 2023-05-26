package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.entity.BrOpportunityCooperator;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.dto.BrOpportunityCooperatorPageDTO;
import com.scrm.server.wx.cp.dto.BrOpportunityCooperatorSaveDTO;
import com.scrm.server.wx.cp.dto.BrOpportunityCooperatorUpdateDTO;

import com.scrm.server.wx.cp.dto.BrOpportunityCooperatorQueryDTO;
import com.scrm.server.wx.cp.vo.BrOpportunityCooperatorVO;

import com.scrm.api.wx.cp.dto.*;

import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;

/**
 * 商机-协作人关联 服务类
 * @author ouyang
 * @since 2022-06-07
 */
public interface IBrOpportunityCooperatorService extends IService<BrOpportunityCooperator> {


    /**
     * 分页查询
     * @author ouyang
     * @date 2022-06-07
     * @param dto 请求参数
     */
    IPage<BrOpportunityCooperatorVO> pageList(BrOpportunityCooperatorPageDTO dto);

    /**
     * 查询列表
     * @author ouyang
     * @date 2022-06-07
     * @param dto 请求参数
     */
    List<BrOpportunityCooperatorVO> queryList(BrOpportunityCooperatorQueryDTO dto);

    /**
     * 根据id查询
     * @author ouyang
     * @date 2022-06-07
     * @param id 主键
     */
    BrOpportunityCooperatorVO findById(String id);

    /**
     * 根据商机id查询
     * @author ouyang
     * @date 2022-06-07
     * @param opportunityId 商机id
     */
    List<BrOpportunityCooperatorVO> findByOpportunityId(String opportunityId);


    /**
     * 新增
     * @author ouyang
     * @date 2022-06-07
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrOpportunityCooperator
     */
    BrOpportunityCooperator save(BrOpportunityCooperatorSaveDTO dto);

     /**
      * 修改
      * @author ouyang
      * @date 2022-06-07
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.BrOpportunityCooperator
      */
    BrOpportunityCooperator update(BrOpportunityCooperatorUpdateDTO dto);


    /**
     * 删除
     * @author ouyang
     * @date 2022-06-07
     * @param id 商机-协作人关联id
     */
    void delete(String id);

    /**
     * 批量删除
     * @author ouyang
     * @date 2022-06-07
     * @param dto 请求参数
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author ouyang
     * @date 2022-06-07
     * @param id 商机-协作人关联id
     * @return com.scrm.server.wx.cp.entity.BrOpportunityCooperator
     */
    BrOpportunityCooperator checkExists(String id);

}
