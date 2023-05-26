package com.scrm.server.wx.cp.mapper;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.scrm.api.wx.cp.dto.WxGroupChatPageDTO;
import com.scrm.api.wx.cp.entity.WxGroupChat;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scrm.api.wx.cp.vo.WxGroupChatPullNewStatisticsVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 客户群 Mapper接口
 *
 * @author xxh
 * @since 2022-01-19
 */
public interface WxGroupChatMapper extends BaseMapper<WxGroupChat> {

    @InterceptorIgnore(tenantLine = "true")
    IPage<WxGroupChat> pageList(Page<WxGroupChat> page, @Param("dto") WxGroupChatPageDTO dto);

    WxGroupChat find(@Param("extCorpId") String extCorpId, @Param("extId") String extId);

    List<WxGroupChatPullNewStatisticsVO> getPullNewStatisticsInfos(@Param("extCorpId") String extCorpId, @Param("topNum") Integer topNum, @Param("joinBeginTime") long joinBeginTime, @Param("joinEndTime") long joinEndTime);
}
