package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.BrJourneyStage;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.vo.BrJourneyStageStatisticsInfoVO;
import com.scrm.server.wx.cp.vo.BrJourneyStageVO;

import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.List;

/**
 * 旅程阶段 服务类
 *
 * @author xxh
 * @since 2022-04-06
 */
public interface IBrJourneyStageService extends IService<BrJourneyStage> {


    /**
     * 分页查询
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-04-06
     */
    IPage<BrJourneyStageVO> pageList(BrJourneyStagePageDTO dto);

    /**
     * 查询列表
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-04-06
     */
    List<BrJourneyStageVO> queryList(BrJourneyStageQueryDTO dto);

    /**
     * 根据id查询
     *
     * @param id 主键
     * @author xxh
     * @date 2022-04-06
     */
    BrJourneyStageVO findById(String id);


    /**
     * 新增
     *
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.BrJourneyStage
     * @author xxh
     * @date 2022-04-06
     */
    BrJourneyStage save(BrJourneyStageSaveDTO dto);

    /**
     * 修改
     *
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.BrJourneyStage
     * @author xxh
     * @date 2022-04-06
     */
    BrJourneyStage update(BrJourneyStageUpdateDTO dto);


    /**
     * 删除
     *
     * @param id 旅程阶段id
     * @author xxh
     * @date 2022-04-06
     */
    void delete(String id);

    /**
     * 删除
     *
     * @param journeyId 旅程id
     * @author xxh
     * @date 2022-04-06
     */
    void deleteByJourneyId(String journeyId);

    /**
     * 批量删除
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-04-06
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     *
     * @param id 旅程阶段id
     * @return com.scrm.api.wx.cp.entity.BrJourneyStage
     * @author xxh
     * @date 2022-04-06
     */
    BrJourneyStage checkExists(String id);

    /**
     * 移动阶段的所有客户
     *
     * @param dto
     * @return com.scrm.api.wx.cp.entity.BrJourneyStage
     * @author xuxh
     * @date 2022/4/11 17:09
     */
    BrJourneyStage moveAllCustomer(BrJourneyStageMoveAllCustomerDTO dto);

    /**
     * 获取统计信息
     *
     * @param journeyId 客户旅程ID
     * @param extCorpId 企业ID
     * @return
     */
    List<BrJourneyStageStatisticsInfoVO> getStatisticsInfo(String extCorpId, String journeyId);

    Integer getMaxSort(String journeyId);
}
