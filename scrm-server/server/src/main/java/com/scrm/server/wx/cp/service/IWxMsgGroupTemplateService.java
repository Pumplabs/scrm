package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.WxMsgGroupTemplate;
import com.scrm.api.wx.cp.vo.IdVO;
import com.scrm.api.wx.cp.vo.StaffVO;
import com.scrm.api.wx.cp.vo.WxMsgGroupTemplateVO;
import com.scrm.api.wx.cp.dto.WxMsgGroupTemplateSaveDTO;
import com.scrm.api.wx.cp.dto.WxMsgGroupTemplateUpdateDTO;
import me.chanjar.weixin.common.error.WxErrorException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 客户群聊-群发消息 服务类
 * @author xxh
 * @since 2022-03-02
 */
public interface IWxMsgGroupTemplateService extends IService<WxMsgGroupTemplate> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-03-02
     * @param dto 请求参数
     */
    IPage<WxMsgGroupTemplateVO> pageList(WxMsgGroupTemplatePageDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-03-02
     * @param id 主键
     */
    WxMsgGroupTemplateVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-03-02
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.WxMsgGroupTemplate
     */
    WxMsgGroupTemplate save(WxMsgGroupTemplateSaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2022-03-02
      * @param dto 请求参数
      * @return com.scrm.api.wx.cp.entity.WxMsgGroupTemplate
      */
    WxMsgGroupTemplate update(WxMsgGroupTemplateUpdateDTO dto);


    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-03-02
     * @param id 客户群聊-群发消息id
     * @return com.scrm.api.wx.cp.entity.WxMsgGroupTemplate
     */
    WxMsgGroupTemplate checkExists(String id);

    /**
     * 取消，只能取消未生成任务的
     * @param id
     */
    WxMsgGroupTemplate cancel(String id);

    /**
     * 查询群主
     * @param dto
     * @return
     */
    IPage<StaffVO> pageChatOwnerList(StaffPageDTO dto);

    /**
     * 提醒接口
     * @param dto
     */
    void remind(WxMsgTemplateRemindDTO dto);

    /**
     * 获取客户群详情
     * @param dto
     * @return
     */
    IPage<MsgGroupChatDTO> getChatDetails(MsgGroupChatSearchDTO dto);

    /**
     * 更新详情数据
     * @param dto
     */
    void updateData(IdVO dto);

    /**
     * 获取群主发送详情列表
     * @param dto
     * @return
     */
    IPage<MsgGroupStaffDTO> getStaffDetails(MsgGroupStaffSearchDTO dto);

    /**
     * 客户群详情导出
     * @param vo
     * @param request
     * @param response
     */
    void exportChatDetails(MsgGroupChatSearchDTO vo, HttpServletRequest request, HttpServletResponse response);

    /**
     * 群主发送详情导出
     * @param dto
     * @param request
     * @param response
     */
    void exportStaffDetails(MsgGroupStaffSearchDTO dto, HttpServletRequest request, HttpServletResponse response);

    /**
     * 定时任务扫描
     */
    void scanMsgGroupTemplate();

    /**
     * 新增个人客户群群发
     * @param dto
     * @return
     * @throws WxErrorException
     */
    WxMsgGroupTemplate savePerson(WxPersonTemplateSaveDTO dto) throws WxErrorException;

    void deleteById(String id);
}
