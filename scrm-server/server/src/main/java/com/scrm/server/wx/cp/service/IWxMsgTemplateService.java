package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.WxMsgTemplate;
import com.scrm.api.wx.cp.vo.MsgTemplateExportVO;
import com.scrm.api.wx.cp.vo.WxMsgTemplateVO;
import com.scrm.api.wx.cp.dto.WxMsgTemplateSaveDTO;
import com.scrm.api.wx.cp.dto.WxMsgTemplateUpdateDTO;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.impl.WxCpExternalContactServiceImpl;
import me.chanjar.weixin.cp.bean.external.contact.WxCpGroupMsgListResult;
import me.chanjar.weixin.cp.bean.external.contact.WxCpGroupMsgSendResult;
import me.chanjar.weixin.cp.bean.external.contact.WxCpGroupMsgTaskResult;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Date;
import java.util.List;

/**
 * 客户群发 服务类
 * @author xxh
 * @since 2022-02-12
 */
public interface IWxMsgTemplateService extends IService<WxMsgTemplate> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-02-12
     * @param dto 请求参数
     */
    IPage<WxMsgTemplateVO> pageList(WxMsgTemplatePageDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-02-12
     * @param id 主键
     */
    WxMsgTemplateVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-02-12
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.WxMsgTemplate
     */
    WxMsgTemplate save(WxMsgTemplateSaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2022-02-12
      * @param dto 请求参数
      * @return com.scrm.api.wx.cp.entity.WxMsgTemplate
      */
    WxMsgTemplate update(WxMsgTemplateUpdateDTO dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-02-12
     * @param id 客户群发id
     * @return com.scrm.api.wx.cp.entity.WxMsgTemplate
     */
    WxMsgTemplate checkExists(String id);

    /**
     * 统计符合条件的客户人数
     * @param dto
     * @return
     */
    Integer countCustomer(WxMsgTemplateCountCustomerDTO dto);

    /**
     * 取消
     * @param id
     * @return
     */
    WxMsgTemplate cancel(String id);

    /**
     * 导出客户列表
     * @param vo
     * @param request
     * @param response
     */
    void exportCustomer(MsgTemplateExportVO vo, HttpServletRequest request, HttpServletResponse response);

    /**
     * 导出员工列表
     * @param vo
     * @param request
     * @param response
     */
    void exportStaff(MsgTemplateExportVO vo, HttpServletRequest request, HttpServletResponse response);

    /**
     * 客户提醒
     * @param dto
     */
    void remind(WxMsgTemplateRemindDTO dto);

    /**
     * 扫描到期了没发送的任务
     */
    void scanMsgTemplate();

    /**
     * 查群发消息发送结果
     * @param externalContactService
     * @param msgId
     * @param staffId
     * @param limit
     * @param cursor
     * @return
     */
    List<WxCpGroupMsgSendResult.ExternalContactGroupMsgSendInfo> getSendResult(WxCpExternalContactServiceImpl externalContactService,
                                                                               String msgId, String staffId, Integer limit, String cursor);

    /**
     * 通用的消息群发,返回群发消息id
     * @param msgDTO           发送的消息
     * @param extStaffId       员工id
     * @param extCustomerIds   发送的客户
     */
    String commonSendMsg(WxMsgDTO msgDTO, String extStaffId, List<String> extCustomerIds, String extCorpId);

    /**
     * 新增个人群发
     * @param dto
     * @return
     */
    WxMsgTemplate savePerson(WxPersonTemplateSaveDTO dto) throws WxErrorException;

    /**
     * 查询群发详情
     *
     * @param chatType 群发任务的类型，默认为single，表示发送给客户，group表示发送给客户群
     * @param startTime
     * @param endTime
     * @param creator
     * @param filterType 创建人类型。0：企业发表 1：个人发表 2：所有，包括个人创建以及企业创建，默认情况下为所有类型
     * @param cursor
     * @return
     */
    List<WxCpGroupMsgListResult.ExternalContactGroupMsgInfo> getGroupMsgList(String extCorpId, String chatType,
                                                                             Date startTime, Date endTime,
                                                                             String creator, Integer filterType,
                                                                             String cursor) throws WxErrorException;

    /**
     * 获取群发成员发送任务列表
     * @param extCorpId
     * @param msgId
     * @param cursor
     * @return
     */
    List<WxCpGroupMsgTaskResult.ExternalContactGroupMsgTaskInfo> getGroupMsgTask(String extCorpId, String msgId, String cursor, Integer retrySeconds) throws WxErrorException;

    /**
     * 获取企业群发成员执行结果
     * @param extCorpId
     * @param msgId
     * @param staffId
     * @param cursor
     * @return
     * @throws WxErrorException
     */
    List<WxCpGroupMsgSendResult.ExternalContactGroupMsgSendInfo> getGroupMsgSendResult(String extCorpId, String msgId, String staffId, String cursor) throws WxErrorException;


    List<WxMsgTemplateStaffDTO> getStaffByStatus(TemplateFilterDTO dto);
    
    void deleteById(String id);

}
