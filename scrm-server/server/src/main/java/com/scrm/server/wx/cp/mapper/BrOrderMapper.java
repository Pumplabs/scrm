package com.scrm.server.wx.cp.mapper;

import com.scrm.server.wx.cp.entity.BrOrder;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scrm.server.wx.cp.vo.DailyTotalVO;
import com.scrm.server.wx.cp.vo.TopNStatisticsVo;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 订单 Mapper接口
 * @author xxh
 * @since 2022-07-17
 */
public interface BrOrderMapper extends BaseMapper<BrOrder> {
    Long addedByDate(Date date, String extCorpId);
    List<Map<String, Object>> countByDateAndCorp(@Param("date") Date date);
    List<TopNStatisticsVo> getStaffTotalAmountByDates(@Param("extCorpId") String extCorpId, @Param("dates") Integer dates, @Param("topN") Integer topN);
    List<DailyTotalVO> getLastNDaysCountDaily(
            @Param("startTime") Date startTime,
            @Param("endTime") Date endTime,@Param("extCorpId") String extCorpId);
}
