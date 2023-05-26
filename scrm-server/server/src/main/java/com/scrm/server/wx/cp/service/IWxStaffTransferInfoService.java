package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.dto.WxCpXmlOutMessageDTO;
import com.scrm.api.wx.cp.dto.WxWaitTransferCustomerPageDTO;
import com.scrm.api.wx.cp.dto.WxWaitTransferGroupChatPageDTO;
import com.scrm.api.wx.cp.entity.WxStaffTransferInfo;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.WxStaffTransferInfoPageDTO;
import com.scrm.api.wx.cp.vo.WxCustomerVO;
import com.scrm.api.wx.cp.vo.WxGroupChatVO;
import com.scrm.api.wx.cp.vo.WxStaffTransferInfoVO;
import com.baomidou.mybatisplus.core.metadata.IPage;

/**
 * 员工转接记录 服务类
 *
 * @author xxh
 * @since 2022-03-05
 */
public interface IWxStaffTransferInfoService extends IService<WxStaffTransferInfo> {


    /**
     * 分页查询
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-03-05
     */
    IPage<WxStaffTransferInfoVO> pageList(WxStaffTransferInfoPageDTO dto);


    /**
     * 接替失败
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-04-01
     */
    void transferFail(WxCpXmlOutMessageDTO dto);

    /**
     * 分页查询待移交客户
     *
     * @param dto 请求参数
     * @return com.baomidou.mybatisplus.core.metadata.IPage<com.scrm.api.wx.cp.vo.WxCustomerVO>
     * @author xuxh
     * @date 2022/5/17 16:27
     */
    IPage<WxCustomerVO> waitTransferCustomerPage(WxWaitTransferCustomerPageDTO dto);

    /**
     * 分页查询待移交群聊
     *
     * @param dto 请求参数
     * @return com.baomidou.mybatisplus.core.metadata.IPage<com.scrm.api.wx.cp.vo.WxGroupChatVO>
     * @author xuxh
     * @date 2022/5/17 16:27
     */
    IPage<WxGroupChatVO> waitTransferGroupChatPage(WxWaitTransferGroupChatPageDTO dto);
}
