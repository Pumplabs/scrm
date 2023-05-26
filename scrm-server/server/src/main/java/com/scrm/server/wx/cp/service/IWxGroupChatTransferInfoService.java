package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.entity.WxGroupChatTransferInfo;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.WxGroupChatTransferInfoPageDTO;
import com.scrm.api.wx.cp.vo.WxGroupChatTransferInfoVO;
import com.baomidou.mybatisplus.core.metadata.IPage;


/**
 * 微信群聊-离职继承详情 服务类
 * @author xxh
 * @since 2022-03-12
 */
public interface IWxGroupChatTransferInfoService extends IService<WxGroupChatTransferInfo> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-03-12
     * @param dto 请求参数
     */
    IPage<WxGroupChatTransferInfoVO> pageList(WxGroupChatTransferInfoPageDTO dto);



}
