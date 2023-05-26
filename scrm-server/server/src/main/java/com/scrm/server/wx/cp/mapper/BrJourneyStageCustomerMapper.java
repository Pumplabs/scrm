package com.scrm.server.wx.cp.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.scrm.server.wx.cp.dto.BrJourneyStageCustomerPageDTO;
import com.scrm.server.wx.cp.dto.BrJourneyStageCustomerQueryDTO;
import com.scrm.server.wx.cp.entity.BrJourneyStageCustomer;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 旅程阶段-客户关联 Mapper接口
 *
 * @author xxh
 * @since 2022-04-06
 */
public interface BrJourneyStageCustomerMapper extends BaseMapper<BrJourneyStageCustomer> {


    IPage<BrJourneyStageCustomer> pageList(@Param("page") Page<BrJourneyStageCustomer> page, @Param("dto") BrJourneyStageCustomerPageDTO dto);

    List<BrJourneyStageCustomer> queryList(BrJourneyStageCustomerQueryDTO dto);
}
