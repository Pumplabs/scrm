package com.scrm.server.wx.cp.mapper;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.scrm.api.wx.cp.dto.WxGroupChatMemberExportDTO;
import com.scrm.api.wx.cp.dto.WxGroupChatMemberPageDTO;
import com.scrm.api.wx.cp.entity.WxGroupChatMember;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scrm.api.wx.cp.vo.WxGroupChatMemberVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;


/**
 * 客户群聊成员 Mapper接口
 *
 * @author xxh
 * @since 2022-01-19
 */
public interface WxGroupChatMemberMapper extends BaseMapper<WxGroupChatMember> {

    /**
     * 分页查询
     *
     * @param page
     * @param dto
     * @return com.baomidou.mybatisplus.extension.plugins.pagination.Page<com.scrm.api.wx.cp.entity.WxGroupChatMember>
     * @author xuxh
     * @date 2022/5/5 11:47
     */
    Page<WxGroupChatMemberVO> pageList(Page<WxGroupChatMember> page, @Param("dto") WxGroupChatMemberPageDTO dto);


    /**
     * 条件查询
     *
     * @param dto
     * @return com.baomidou.mybatisplus.extension.plugins.pagination.Page<com.scrm.api.wx.cp.entity.WxGroupChatMember>
     * @author xuxh
     * @date 2022/5/5 11:47
     */
    List<WxGroupChatMemberVO> queryList(@Param("dto") WxGroupChatMemberExportDTO dto);

    List<String> queryTodayQuitIds(@Param("extCorpId") String extCorpId, @Param("extChatId") String extChatId);
}
