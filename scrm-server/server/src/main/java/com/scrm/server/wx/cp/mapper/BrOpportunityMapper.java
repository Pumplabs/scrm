package com.scrm.server.wx.cp.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.scrm.server.wx.cp.dto.BrOpportunityPageDTO;
import com.scrm.server.wx.cp.dto.BrOpportunityQueryDTO;
import com.scrm.server.wx.cp.entity.BrOpportunity;
import com.scrm.server.wx.cp.vo.DailyTotalVO;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 商机 Mapper接口
 * @author ouyang
 * @since 2022-06-07
 */
public interface BrOpportunityMapper extends BaseMapper<BrOpportunity> {

    Page<BrOpportunity> pageList(Page<BrOpportunity> page, @Param("dto") BrOpportunityPageDTO dto);

    List<BrOpportunity> queryList(@Param("dto") BrOpportunityQueryDTO dto);

    Long addedByDate(Date date, String extCorpId);

    List<Map<String, Object>> countByDateAndCorp(Date date);

    List<DailyTotalVO> getLastNDaysCountDaily(
            @Param("startTime") Date startTime,
            @Param("endTime") Date endTime,@Param("extCorpId") String extCorpId);
}
