package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.vo.StaffTransferGroupChatVO;
import com.scrm.api.wx.cp.vo.WxGroupChatTransferInfoVO;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.WxResignedStaffGroupChat;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.vo.WxResignedStaffGroupChatPageDTO;
import com.scrm.server.wx.cp.vo.WxResignedStaffGroupChatStatisticsVO;
import com.scrm.server.wx.cp.vo.WxResignedStaffGroupChatVO;

import com.scrm.api.wx.cp.dto.*;

import com.baomidou.mybatisplus.core.metadata.IPage;
import me.chanjar.weixin.common.error.WxErrorException;

/**
 * 离职员工-群聊关联 服务类
 * @author xxh
 * @since 2022-06-27
 */
public interface IWxResignedStaffGroupChatService extends IService<WxResignedStaffGroupChat> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-06-27
     * @param dto 请求参数
     */
    IPage<WxResignedStaffGroupChatStatisticsVO> pageList(WxResignedStaffGroupChatPageDTO dto);


    /**
     * 同步群聊离职继承信息
     * @author xuxh
     * @date 2022/7/4 10:52
     * @param extCorpId 企业ID
     * @return void
     */
    void sync(String extCorpId) throws WxErrorException;

    /**
     * 分配客户群
     * @author xuxh
     * @date 2022/3/12 17:16
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.vo.WxStaffResignedTransferCustomerVO
     */
    StaffTransferGroupChatVO transferGroupChat(WxStaffResignedTransferGroupChatDTO dto);


    /**
     * 分页查询待移交群聊列表
     * @author xuxh
     * @date 2022/7/4 15:58
     * @param dto
     * @return com.baomidou.mybatisplus.core.metadata.IPage<com.scrm.server.wx.cp.vo.WxResignedStaffGroupChatVO>
     */
    IPage<WxResignedStaffGroupChatVO> waitTransferPageList(WxResignedStaffGroupChatWaitPageDTO dto);

    /**
     * 查询移交记录列表
     * @author xuxh
     * @date 2022/7/4 17:30
     * @param dto
     * @return com.baomidou.mybatisplus.core.metadata.IPage<com.scrm.api.wx.cp.vo.WxGroupChatTransferInfoVO>
     */
    IPage<WxGroupChatTransferInfoVO> transferPageInfo(WxGroupChatTransferInfoPageDTO dto);
}
