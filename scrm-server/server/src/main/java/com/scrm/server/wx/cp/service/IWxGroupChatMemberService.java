package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.WxGroupChatMemberExportDTO;
import com.scrm.api.wx.cp.dto.WxGroupChatMemberPageDTO;
import com.scrm.api.wx.cp.dto.WxGroupChatMemberQueryDTO;
import com.scrm.api.wx.cp.dto.WxGroupChatMemberSaveDTO;
import com.scrm.api.wx.cp.entity.WxGroupChatMember;
import com.scrm.api.wx.cp.vo.WxGroupChatMemberVO;
import com.scrm.common.dto.BatchDTO;

import java.util.List;

/**
 * 客户群聊成员 服务类
 * @author xxh
 * @since 2022-01-19
 */
public interface IWxGroupChatMemberService extends IService<WxGroupChatMember> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-01-19
     * @param dto 请求参数
     */
    IPage<WxGroupChatMemberVO> pageList(WxGroupChatMemberPageDTO dto);

    /**
     * 查询列表
     * @author xxh
     * @date 2022-01-19
     * @param dto 请求参数
     */
    List<WxGroupChatMemberVO> queryList(WxGroupChatMemberQueryDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-01-19
     * @param id 主键
     */
    WxGroupChatMemberVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-01-19
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.WxGroupChatMember
     */
    WxGroupChatMember save(WxGroupChatMemberSaveDTO dto);


    /**
     * 删除
     * @author xxh
     * @date 2022-01-19
     * @param id 客户群聊成员id
     */
    void delete(String id);

    /**
     * 批量删除
     * @author xxh
     * @date 2022-01-19
     * @param dto 请求参数
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-01-19
     * @param id 客户群聊成员id
     * @return com.scrm.api.wx.cp.entity.WxGroupChatMember
     */
    WxGroupChatMember checkExists(String id);

    /**
     * 导出列表
     * @author xuxh
     * @date 2022/5/5 15:15
     * @param dto 请求参数
     * @return void
     */
    void exportList(WxGroupChatMemberExportDTO dto);

    /**
     * 获取今天退出的成员id列表（去重）
     * @param extCorpId
     * @param chatId
     * @return
     */
    List<String> queryTodayQuitIds(String extCorpId, String chatId);
}
