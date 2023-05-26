package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.entity.BrOpportunityGroup;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.dto.BrOpportunityGroupPageDTO;
import com.scrm.server.wx.cp.dto.BrOpportunityGroupSaveDTO;
import com.scrm.server.wx.cp.dto.BrOpportunityGroupUpdateDTO;

import com.scrm.server.wx.cp.dto.BrOpportunityGroupQueryDTO;
import com.scrm.server.wx.cp.vo.BrOpportunityGroupVO;

import com.scrm.api.wx.cp.dto.*;

import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;

/**
 * 商机分组 服务类
 * @author ouyang
 * @since 2022-06-07
 */
public interface IBrOpportunityGroupService extends IService<BrOpportunityGroup> {


    /**
     * 分页查询
     * @author ouyang
     * @date 2022-06-07
     * @param dto 请求参数
     */
    IPage<BrOpportunityGroupVO> pageList(BrOpportunityGroupPageDTO dto);

    /**
     * 查询列表
     * @author ouyang
     * @date 2022-06-07
     * @param dto 请求参数
     */
    List<BrOpportunityGroupVO> queryList(BrOpportunityGroupQueryDTO dto);

    /**
     * 根据id查询
     * @author ouyang
     * @date 2022-06-07
     * @param id 主键
     */
    BrOpportunityGroupVO findById(String id);


    /**
     * 新增
     * @author ouyang
     * @date 2022-06-07
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrOpportunityGroup
     */
    BrOpportunityGroup save(BrOpportunityGroupSaveDTO dto);

     /**
      * 修改
      * @author ouyang
      * @date 2022-06-07
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.BrOpportunityGroup
      */
    BrOpportunityGroup update(BrOpportunityGroupUpdateDTO dto);


    /**
     * 删除
     * @author ouyang
     * @date 2022-06-07
     * @param id 商机分组id
     */
    void delete(String id);

    /**
     * 校验是否存在
     * @author ouyang
     * @date 2022-06-07
     * @param id 商机分组id
     * @return com.scrm.server.wx.cp.entity.BrOpportunityGroup
     */
    BrOpportunityGroup checkExists(String id);

}
