package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.dto.BrSopCountCustomerDTO;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.BrSop;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.vo.BrSopExecuteDetailVO;
import com.scrm.server.wx.cp.vo.BrSopPushDetailVO;
import com.scrm.server.wx.cp.vo.BrSopRuleDetailVO;
import com.scrm.server.wx.cp.vo.BrSopVO;

import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * sop 服务类
 * @author ouyang
 * @since 2022-04-17
 */
public interface IBrSopService extends IService<BrSop> {


    /**
     * 分页查询
     * @author ouyang
     * @date 2022-04-17
     * @param dto 请求参数
     */
    IPage<BrSopVO> pageList(BrSopPageDTO dto);

    /**
     * 查询列表
     * @author ouyang
     * @date 2022-04-17
     * @param dto 请求参数
     */
    List<BrSop> queryList(BrSopQueryDTO dto);

    /**
     * 根据id查询
     * @author ouyang
     * @date 2022-04-17
     * @param id 主键
     */
    BrSopVO findById(String id);


    /**
     * 新增
     * @author ouyang
     * @date 2022-04-17
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrSop
     */
    BrSop save(BrSopSaveDTO dto);

     /**
      * 修改
      * @author ouyang
      * @date 2022-04-17
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.BrSop
      */
    BrSop update(BrSopUpdateDTO dto);

    /**
     * 创建停止定时任务
     */
    Integer createStopJob(Date executeAt,String ruleId,String ruleName,String creator, Integer type);
    /**
     * 创建推送定时任务
     */
    Integer createXxlJob(Map<String, List<String>> idMap, Date executeAt, BrSopRuleParamDto rule, String handleName,Boolean isPeriod,Integer sopType);
    /**
     * 删除
     * @author ouyang
     * @date 2022-04-17
     * @param id sopid
     */
    void delete(String id);

    /**
     * 批量删除
     * @author ouyang
     * @date 2022-04-17
     * @param dto 请求参数
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author ouyang
     * @date 2022-04-17
     * @param id sopid
     * @return com.scrm.server.wx.cp.entity.BrSop
     */
    BrSop checkExists(String id);

    /**
     * 修改状态
     * @author ouyang
     * @date 2022-04-17
     * @param dto 请求参数
     */
    void updateStatus(BrSopUpdateStatusDTO dto);

    /**
     * 获取推送详情
     * @author ouyang
     * @date 2022-04-17
     */
    BrSopPushDetailVO getPushDetail(String ruleId, String executeAt, String staffId, Integer jobId, String extCorpId);

    /**
     * 添加好友时触发创建定时任务
     * @author ouyang
     * @date 2022-04-17
     */
    void createTaskForAddFriend(WxCustomer customer);


    /**
     * @description 获取规则执行详情
     * @param
     * @return
     */
    List<BrSopRuleDetailVO> getExecuteDetail(String sopId);

    /**
     * @description 获取规则发送详情
     * @param
     * @return
     */
    List<BrSopExecuteDetailVO> getSendDetail(SendDetailQueryDTO dto);

    /**
     * 修改发送状态
     * @author ouyang
     * @date 2022-04-17
     * @param dto 请求参数
     */
    void updateSendStatus(BrSopUpdateSendStatusDTO dto);

    /**
     * 提醒发送
     * @author ouyang
     * @date 2022-04-17
     * @param dto 请求参数
     */
    void remind(BrSopRemindDTO dto);

    /**
     * 统计符合条件的客户人数
     * @param dto
     * @return
     */
    Integer countCustomer(BrSopCountCustomerDTO dto);
}