package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.api.wx.cp.vo.WxCustomerPullNewStatisticsVO;
import com.scrm.api.wx.cp.vo.WxCustomerStatisticsVO;
import com.scrm.api.wx.cp.vo.WxCustomerTodayStatisticsVO;
import com.scrm.api.wx.cp.vo.WxCustomerVO;
import com.scrm.common.vo.FailResultVO;
import com.scrm.server.wx.cp.dto.BrJourneyCustomerPageDTO;
import com.scrm.server.wx.cp.dto.WxCustomerAssistPageDTO;
import com.scrm.server.wx.cp.dto.WxStaffCustomerTransferFailDTO;
import com.scrm.server.wx.cp.feign.dto.UserInfoRes;
import com.scrm.server.wx.cp.vo.BatchMarkRes;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.external.WxCpUpdateRemarkRequest;
import me.chanjar.weixin.cp.bean.external.WxCpWelcomeMsg;
import me.chanjar.weixin.cp.bean.external.contact.WxCpExternalContactBatchInfo;
import me.chanjar.weixin.cp.bean.external.contact.WxCpExternalContactInfo;
import org.apache.ibatis.annotations.Param;
import org.redisson.api.RLock;

import java.util.List;


/**
 * 企业微信客户 服务类
 *
 * @author xxh
 * @since 2021-12-22
 */
public interface IWxCustomerService extends IService<WxCustomer> {


    /**
     * 分页查询
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2021-12-22
     */
    IPage<WxCustomerVO> pageList(WxCustomerPageDTO dto);


    /**
     * 根据id查询
     *
     * @param id 主键
     * @author xxh
     * @date 2021-12-22
     */
    WxCustomerVO findById(String id);

    /**
     * 校验是否存在
     *
     * @param id 企业微信客户id
     * @return com.scrm.api.wx.cp.entity.WxCustomer
     * @author xxh
     * @date 2021-12-22
     */
    WxCustomer checkExists(String id);


    /**
     * 校验是否存在
     *
     * @param extCorpId 企业外部id
     * @param extId     客户userId
     * @return com.scrm.api.wx.cp.entity.Staff
     * @author xxh
     * @date 2021-12-16
     */
    WxCustomer checkExists(String extCorpId, String extId);

    /**
     * 校验是否存在(能查出非好友数据)
     *
     * @param extCorpId 企业外部id
     * @param extId     客户userId
     * @return com.scrm.api.wx.cp.entity.Staff
     * @author xxh
     * @date 2021-12-16
     */
    WxCustomer checkExistsWithNoFriend(String extCorpId, String extId);

    /**
     * 同步员工客户数据
     *
     * @param extCorpId 外包企业id
     * @return com.scrm.api.wx.cp.entity.WxCustomer
     * @author xxh
     * @date 2021-12-22
     */
    void sync(String extCorpId);
    /**
     * 同步员工客户数据
     *
     * @param extCorpId 外包企业id
     * @param isSync 是否已经从微信同步
     * @return com.scrm.api.wx.cp.entity.WxCustomer
     * @author xxh
     * @date 2021-12-22
     */
    void sync(String extCorpId, boolean isSync);

    /**
     * 修改客户详情
     *
     * @param dto 请求信息
     * @return 客户详情
     */
    WxCustomerVO updateCustomerInfo(WxCustomerInfoUpdateDTO dto);

    /**
     * 导出
     *
     * @param dto 请求信息
     */
    void exportList(WxCustomerExportDTO dto);

    /**
     * 编辑客户标签
     *
     * @param dto 请求信息
     * @return 客户详情
     */
    WxCustomerVO editTag(WxCustomerTagSaveOrUpdateDTO dto) throws WxErrorException;

    /**
     * 编辑客户标签
     *
     * @param dto 请求信息
     * @return 客户详情
     */
    FailResultVO priorityEditTag(WxCustomerTagSaveOrUpdateDTO dto);

    /**
     * 编辑客户标签
     *
     * @param dto 请求信息
     * @return 客户详情
     */
    void queueEditTag(WxCustomerTagSaveOrUpdateDTO dto);

    /**
     * 更新客户备注
     *
     * @param wxCpUpdateRemarkRequest
     * @throws WxErrorException
     */
    void updateRemark(WxCpUpdateRemarkRequest wxCpUpdateRemarkRequest, String extCorpId) throws WxErrorException;

    /**
     * 推送新用户欢迎语
     */
    void sendWelcomeMsg(WxCpWelcomeMsg msg);

    /**
     * 根据id查询客户信息
     *
     * @return
     */
    WxCpExternalContactInfo getCustomInfo(String userId);

    /**
     * 批量打标
     *
     * @param dto 请求参数
     * @author xuxh
     * @date 2022/1/17 16:46
     */
    BatchMarkRes batchMarking(WxCustomerBatchMarkingDTO dto);


    /**
     * 根据id查询（会查出被删除的数据）
     *
     * @param id 客户ID
     * @return 客户
     * @author xuxh
     */
    WxCustomer find(String id);

    /**
     * 根据id查询（会查出被删除的数据）
     *
     * @param extId     企业员工id
     * @param extCorpId 企业外部id
     * @author xxh
     * @date 2021-12-16
     */
    WxCustomer find(String extCorpId, String extId);

    /**
     * 根据id查询（会查出被删除的数据）
     *
     * @param extIds    企业员工ids
     * @param extCorpId 企业外部id
     * @author xxh
     * @date 2021-12-16
     */
    List<WxCustomerVO> find(String extCorpId, List<String> extIds);

    /**
     * 翻译
     *
     * @param wxCustomer 实体
     * @return WxCustomerVO 结果集
     * @author xxh
     * @date 2021-12-22
     */
    WxCustomerVO translation(WxCustomer wxCustomer);


    /**
     * 删除客户
     *
     * @param customerDTO 请求参数
     * @author xxh
     * @date 2022-03-26
     */
    void staffDeleteCustomer(WxStaffDeleteCustomerDTO customerDTO);

    /**
     * 根据条件查询extId，会查出被删除的
     *
     * @param extCorpId
     * @param extIds
     * @return
     */
    List<WxCustomerVO> findByExtIdsIncludeDel(String extCorpId, List<String> extIds);

    /**
     * 根据条件查询extId，会查出被删除的
     *
     * @param extCorpId
     * @param name
     * @return
     */
    List<String> findByNameIncludeDel(String extCorpId, String name);


    /**
     * 刷新客户信息
     *
     * @param externalContactInfo
     * @param extCorpId
     * @return
     */
    WxCustomer refreshCustomer(WxCpExternalContactBatchInfo.ExternalContactInfo externalContactInfo, String extCorpId);

    /**
     * 下拉分页查询
     *
     * @param dto 请求参数
     * @return com.baomidou.mybatisplus.core.metadata.IPage<com.scrm.api.wx.cp.vo.WxCustomerVO>
     * @author xuxh
     * @date 2022/4/2 11:32
     */
    IPage<WxCustomerVO> dropDownPageList(WxCustomerDropDownPageDTO dto);


    /**
     * 获取客户列表(去除已存在该旅程的客户)
     *
     * @param dto
     * @return com.baomidou.mybatisplus.core.metadata.IPage<com.scrm.api.wx.cp.vo.WxCustomerVO>
     * @author xuxh
     * @date 2022/4/8 17:28
     */
    IPage<WxCustomerVO> pageCustomerList(@Param("dto") BrJourneyCustomerPageDTO dto);

    /**
     * 条件查询客户列表
     */
    List<WxCustomer> getCustomerListByCondition(WxMsgTemplateCountCustomerDTO dto);

    /**
     * 获取客户详情
     *
     * @param extCorpId 企业id
     * @param extId     客户外部id
     */
    WxCustomerVO getDetails(String extCorpId, String extId);

    /**
     * 特殊的检查这个客户在不在（事务传播特性不一样）
     *
     * @param extCorpId
     * @param extCustomerId
     * @return
     */
    boolean countByCustomerId(String extCorpId, String extCustomerId);

    /**
     * 根据跟进员工获取客户详情
     *
     * @param extCorpId 外部企业ID
     * @param id        客户ID
     * @param staffId   员工ID
     * @return com.scrm.api.wx.cp.vo.WxCustomerVO
     * @author xuxh
     * @date 2022/5/13 10:34
     */
    WxCustomerVO getByIdAndStaffId(String extCorpId, String id, String staffId, String extId);


    /**
     * 新的根据id获取企业信息
     *
     * @param id
     * @return
     */
    WxCustomer getByIdNewTr(String id);

    /**
     * 获取统计信息
     *
     * @param dto
     * @return com.scrm.api.wx.cp.vo.WxCustomerStatisticsVO
     * @author xuxh
     * @date 2022/6/6 16:55
     */
    WxCustomerStatisticsVO getStatisticsInfo(WxCustomerStatisticsDTO dto);

    /**
     * 获取员工拉新统计
     *
     * @param dto
     * @return
     */
    WxCustomerPullNewStatisticsVO getPullNewStatisticsInfo(WxCustomerPullNewStatisticsDTO dto);

    /**
     * 获取已经删除的客户详情
     *
     * @param extCorpId
     * @param id
     * @param staffId
     * @param extId
     * @return
     */
    WxCustomerVO getDeleteInfo(String extCorpId, String id, String staffId, String extId);

    /**
     * 获取客户同步信息的锁
     *
     * @param extCorpId
     * @param extId
     * @return
     */
    RLock getCustomerSyncLock(String extCorpId, String extId);

    /**
     * 获取客户同步信息的锁
     *
     * @param extCorpId
     * @return
     */
    List<RLock> getCustomerSyncLock(String extCorpId);

    /**
     * 尝试锁
     *
     * @param rLock
     * @return
     */
    boolean trySyncLock(RLock rLock) throws InterruptedException;

    /**
     * 释放锁
     *
     * @param rLock
     */
    void releaseSyncLock(RLock rLock);
    /**
     * 获取客户同步信息的锁
     *
     * @param extCorpId
     * @param needCache 是否需要缓存
     * @return
     */
    List<RLock> getCustomerSyncLock(String extCorpId, boolean needCache);

    /**
     * 获取所有客户的extId
     *
     * @return
     */
    List<String> getAllExtId();

    /**
     * 获取今日统计信息
     *
     * @param dto
     * @return com.scrm.api.wx.cp.vo.WxCustomerTodayStatisticsVO
     * @author xuxh
     * @date 2022/7/7 19:11
     */
    WxCustomerTodayStatisticsVO getTodayStatisticsInfo(WxCustomerTodayStatisticsDTO dto);

    /**
     * 获取不是企业好友的客户
     *
     * @param userInfoRes
     * @return
     */
    WxCustomer getNoFriendCustomer(String extCorpId, UserInfoRes userInfoRes);

    /**
     * 分页查询 客户+协助客户
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2021-12-22
     */
    IPage<WxCustomerVO> pageAssistList(WxCustomerAssistPageDTO dto);

    /**
     * 移交客户失败
     * @param dto 请求参数
     */
    void transferFail(WxStaffCustomerTransferFailDTO dto);

    /**
     * 处理移交客户数据（新增标签，详情，跟原来的跟进人保持一致,不用更数据库，后续会更新）
     * @param extCorpId 企业id
     * @param staffExtId 员工extId
     * @param customerExtId 客户extId
     */
    void handlerTransfer(String extCorpId, String staffExtId, String customerExtId);
}
