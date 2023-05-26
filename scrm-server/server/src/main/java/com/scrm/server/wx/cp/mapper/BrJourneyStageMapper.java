package com.scrm.server.wx.cp.mapper;

import com.scrm.api.wx.cp.entity.BrJourneyStage;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scrm.server.wx.cp.vo.BrJourneyStageStatisticsInfoVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 旅程阶段 Mapper接口
 *
 * @author xxh
 * @since 2022-04-06
 */
public interface BrJourneyStageMapper extends BaseMapper<BrJourneyStage> {

    /**
     * 获取统计信息
     *
     * @param journeyId 客户旅程ID
     * @param extCorpId 企业ID
     * @return
     */
    List<BrJourneyStageStatisticsInfoVO> getStatisticsInfo(@Param("extCorpId") String extCorpId, @Param("journeyId") String journeyId);
}
