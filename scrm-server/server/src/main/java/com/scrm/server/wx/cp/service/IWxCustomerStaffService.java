package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.entity.WxCustomerStaff;
import com.scrm.api.wx.cp.vo.ContactWayCountParamsVO;
import com.scrm.api.wx.cp.vo.WxCustomerPullNewStatisticsInfoVO;
import com.scrm.api.wx.cp.vo.WxCustomerStaffVO;
import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.vo.WxCustomerStaffCountVO;

import java.util.Date;
import java.util.List;

/**
 * 企业微信客户-员工关联表 服务类
 *
 * @author xxh
 * @since 2021-12-22
 */
public interface IWxCustomerStaffService extends IService<WxCustomerStaff> {

    /**
     * 删除
     *
     * @param id 企业微信客户-员工关联表id
     * @author xxh
     * @date 2021-12-22
     */
    void delete(String id);

    /**
     * 批量删除
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2021-12-22
     */
    void batchDelete(BatchDTO<String> dto);


    /**
     * 校验是否存在
     *
     * @param extCorpId     企业id
     * @param extStaffId    企业员工id
     * @param extCustomerId 客户id
     * @return com.scrm.api.wx.cp.entity.WxCustomerStaff
     * @author xxh
     * @date 2021-12-22
     */
    WxCustomerStaff checkExists(String extCorpId, String extStaffId, String extCustomerId);


    List<WxCustomerStaffCountVO> countGroupByStaffExtId(String extCorpId);

    /**
     * 根据条件查询，会把删除的也查出来
     *
     * @return
     */
    List<WxCustomerStaff> listByCondition(ContactWayCountParamsVO paramsVO);

    /**
     * 统计那个员工那天加的好友数（包括以删的）
     *
     * @param extCorpId
     * @param extStaffId
     * @param date
     * @return
     */
    Integer countByDate(String extCorpId, String extStaffId, String state, Date date);


    WxCustomerStaffVO find(String exrCorpId, String customerId, String extStaffId);


    /**
     * 查询（会查询出被删除的数据）
     * @param extCorpId     企业id
     * @param extStaffId    企业员工id
     * @param extCustomerId 客户id
     * @return com.scrm.api.wx.cp.entity.WxCustomerStaff
     * @return 员工客户根据信息
     */
    WxCustomerStaff findHasDelete(String extCorpId, String extStaffId, String extCustomerId);
    /**
     * 查询（会查询出被删除的数据）
     * @param id
     * @return com.scrm.api.wx.cp.entity.WxCustomerStaff
     * @return 员工客户根据信息
     */
    WxCustomerStaff findHasDelete(String id);

    /**
     * 获取拉新统计
     * @param extCorpId 企业ID
     * @param topNum 排行数量
     * @param beginDate 开时时间
     * @param endDate 结束时间
     */
    List<WxCustomerPullNewStatisticsInfoVO> getPullNewStatisticsInfo(String extCorpId, Integer topNum,
                                                                     Date beginDate, Date endDate);

    long count(String extCorpId, Date begin, Date end, String staffExtId);

}
