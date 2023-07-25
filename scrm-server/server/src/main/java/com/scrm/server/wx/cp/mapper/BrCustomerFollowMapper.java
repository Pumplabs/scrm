package com.scrm.server.wx.cp.mapper;

import com.scrm.server.wx.cp.entity.BrCustomerFollow;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scrm.server.wx.cp.vo.TopNStatisticsVo;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 客户跟进 Mapper接口
 * @author xxh
 * @since 2022-05-19
 */
public interface BrCustomerFollowMapper extends BaseMapper<BrCustomerFollow> {

    Long addedByDate(Date date, String extCorpId);
    List<Map<String, Object>> countByDateAndCorp(Date date);
    List<TopNStatisticsVo> getStaffTotalFollowUpByDates(@Param("extCorpId") String extCorpId, @Param("dates") Integer dates, @Param("topN") Integer topN);

}
