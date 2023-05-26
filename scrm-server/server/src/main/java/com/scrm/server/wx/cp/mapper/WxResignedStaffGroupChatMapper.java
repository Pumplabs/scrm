package com.scrm.server.wx.cp.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.scrm.server.wx.cp.entity.WxResignedStaffGroupChat;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scrm.server.wx.cp.vo.WxResignedStaffGroupChatPageDTO;
import com.scrm.server.wx.cp.vo.WxResignedStaffGroupChatStatisticsVO;
import org.apache.ibatis.annotations.Param;

/**
 * 离职员工-群聊关联 Mapper接口
 * @author xxh
 * @since 2022-06-27
 */
public interface WxResignedStaffGroupChatMapper extends BaseMapper<WxResignedStaffGroupChat> {

    IPage<WxResignedStaffGroupChatStatisticsVO> pageList(@Param("page") Page<WxResignedStaffGroupChatStatisticsVO> page, @Param("dto") WxResignedStaffGroupChatPageDTO dto);
}
