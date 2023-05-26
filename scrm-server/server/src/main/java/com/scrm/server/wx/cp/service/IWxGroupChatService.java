package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.WxGroupChat;
import com.scrm.api.wx.cp.vo.*;
import com.scrm.server.wx.cp.dto.WxGroupChatStatisticsInfoExportDTO;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpExternalContactService;

import java.util.List;

/**
 * 客户群 服务类
 *
 * @author xxh
 * @since 2022-01-19
 */
public interface IWxGroupChatService extends IService<WxGroupChat> {


    /**
     * 分页查询
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-01-19
     */
    IPage<WxGroupChatVO> pageList(WxGroupChatPageDTO dto);


    /**
     * 根据id查询
     *
     * @param id 主键
     * @author xxh
     * @date 2022-01-19
     */
    WxGroupChatVO findById(String id);


    /**
     * 校验是否存在(抛异常)
     *
     * @param id 客户群id
     * @return com.scrm.api.wx.cp.entity.WxGroupChat
     * @author xxh
     * @date 2022-01-19
     */
    WxGroupChat checkExists(String id);

    /**
     * 校验是否存在(不抛异常)
     * @param extCorpId
     * @param extChatId
     * @return
     */
    WxGroupChat checkExists(String extCorpId, String extChatId);

    /**
     * 同步数据
     *
     * @param extCorpId 企业ID
     * @author xuxh
     * @date 2022/1/19 9:46
     */
    void sync(String extCorpId, String id) throws WxErrorException;

    /**
     * 获取统计信息
     *
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.vo.WxGroupChatStatisticsInfoVO
     * @author xuxh
     * @date 2022/2/11 15:38
     */
    IPage<WxGroupChatStatisticsInfoVO> getStaticsInfo(WxGroupChatStatisticsInfoDTO dto) throws WxErrorException;


    /**
     * 新增/修改
     *
     * @param extCorpId              企业ID
     * @param chatId                 群聊ID
     * @param status                 状态
     * @param externalContactService serviceBean
     * @author xuxh
     * @date 2022/2/21 10:24
     */
    WxGroupChat saveOrUpdate(String extCorpId, String chatId, Integer status,WxCpExternalContactService externalContactService) throws WxErrorException;

    /**
     * 导出客户群
     *
     * @param dto 请求参数
     * @author xuxh
     * @date 2022/2/23 17:41
     */
    void exportList(WxGroupChatExportDTO dto);

    /**
     * 条件查询群聊列表
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-01-19
     */
    List<WxGroupChat> queryList(WxGroupChatQueryDTO dto);

    /**
     * 导出统计信息
     * @author xuxh
     * @date 2022/5/5 16:16
     * @param dto 请求参数
     * @return void
     */
    void exportStaticsInfo(WxGroupChatStatisticsInfoExportDTO dto);

    /**
     * 翻译
     * @author xuxh
     * @date 2022/5/17 16:52
     * @param wxGroupChat 实体类
     * @return com.scrm.api.wx.cp.vo.WxGroupChatVO
     */
    WxGroupChatVO translation(WxGroupChat wxGroupChat);

    /**
     * 删除
     * @param extCorpId
     * @param chatExtId
     */
    void delete(String extCorpId, String chatExtId);

    /**
     * 获取首页统计信息
     * @author xuxh
     * @date 2022/6/7 11:25
     * @param dto
     * @return com.scrm.api.wx.cp.vo.WxGroupChatStatisticsResultVO
     */
    WxGroupChatStatisticsResultVO getStatics(WxGroupChatStatisticsDTO dto);

    /**
     * 根据外部id获取
     * @param extCorpId 企业ID
     * @param extId 群聊extId
     * @return 群聊详情
     */
    WxGroupChatVO getByExtId(String extCorpId, String extId);

    /**
     * 获取一条群聊数据
     * @author xuxh
     * @date 2022/7/4 11:13
     * @param extCorpId 企业ID
     * @param extId 群聊extId
     * @return com.scrm.api.wx.cp.entity.WxGroupChat
     */
    WxGroupChat find(String extCorpId, String extId);

    /**
     * 获取群聊今日统计信息
     *
     * @param extCorpId
     * @param isPermission
     * @return com.scrm.api.wx.cp.vo.WxGroupChatStatisticsVO
     * @author xuxh
     * @date 2022/7/7 19:37
     */
    WxGroupChatTodayStatisticsVO getTodayStatics(String extCorpId, Boolean isPermission);
}
