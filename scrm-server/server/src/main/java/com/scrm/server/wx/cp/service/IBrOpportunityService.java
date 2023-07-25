package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.BrOpportunity;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.vo.BrOpportunityVO;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.server.wx.cp.vo.DailyTotalVO;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 商机 服务类
 * @author ouyang
 * @since 2022-06-07
 */
public interface IBrOpportunityService extends IService<BrOpportunity> {


    /**
     * 分页查询
     * @author ouyang
     * @date 2022-06-07
     * @param dto 请求参数
     */
    IPage<BrOpportunityVO> pageList(BrOpportunityPageDTO dto);

    /**
     * 查询列表
     * @author ouyang
     * @date 2022-06-07
     * @param dto 请求参数
     */
    List<BrOpportunityVO> queryList(BrOpportunityQueryDTO dto);

    /**
     * 根据id查询
     * @author ouyang
     * @date 2022-06-07
     * @param id 主键
     */
    BrOpportunityVO findById(String id);


    /**
     * 新增
     * @author ouyang
     * @date 2022-06-07
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrOpportunity
     */
    BrOpportunity save(BrOpportunitySaveDTO dto);

     /**
      * 修改
      * @author ouyang
      * @date 2022-06-07
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.BrOpportunity
      */
    BrOpportunity update(BrOpportunityUpdateDTO dto);


    /**
     * 删除
     * @author ouyang
     * @date 2022-06-07
     * @param id 商机id
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
     * @param id 商机id
     * @return com.scrm.server.wx.cp.entity.BrOpportunity
     */
    BrOpportunity checkExists(String id);

    /**
     * 修改状态
     * @author ouyang
     * @date 2022-04-17
     * @param dto 请求参数
     */
    void updateStage(BrOpportunityUpdateStageDTO dto);
    Long getAddedCountByDate(Date date, String extCorpId);
    List<Map<String,Object>> countByDateAndCorp (Date date);

    Long countByDateAndStaff();
    Long countByToday();
    List<DailyTotalVO> getLastNDaysCountDaily(Integer days);
}
