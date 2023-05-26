package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.vo.StaffTransferCustomerVO;
import com.scrm.api.wx.cp.vo.WxCustomerVO;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.WxResignedStaffCustomer;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.vo.WxResignedStaffCustomerInfoVO;
import com.scrm.server.wx.cp.vo.WxResignedStaffCustomerVO;

import com.scrm.api.wx.cp.dto.*;

import com.baomidou.mybatisplus.core.metadata.IPage;
import me.chanjar.weixin.common.error.WxErrorException;

import java.util.List;

/**
 * 离职员工-客户关联 服务类
 * @author xxh
 * @since 2022-06-26
 */
public interface IWxResignedStaffCustomerService extends IService<WxResignedStaffCustomer> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-06-26
     * @param dto 请求参数
     */
    IPage<WxResignedStaffCustomerVO> pageList(WxResignedStaffCustomerPageDTO dto);

    /**
     * 查询列表
     * @author xxh
     * @date 2022-06-26
     * @param dto 请求参数
     */
    List<WxResignedStaffCustomerVO> queryList(WxResignedStaffCustomerQueryDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-06-26
     * @param id 主键
     */
    WxResignedStaffCustomerVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-06-26
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.WxResignedStaffCustomer
     */
    WxResignedStaffCustomer save(WxResignedStaffCustomerSaveDTO dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-06-26
     * @param id 离职员工-客户关联id
     * @return com.scrm.server.wx.cp.entity.WxResignedStaffCustomer
     */
    WxResignedStaffCustomer checkExists(String id);

    IPage<WxCustomerVO> waitTransferPage(WxWaitResignedTransferCustomerPageDTO dto);

    IPage<WxResignedStaffCustomerInfoVO> pageCustomerResignedInheritance(WxResignedStaffCustomerInfoDTO dto);


    /**
     * 同步离职继承数据
     * @author xuxh
     * @date 2022/6/21 14:26
     * @param extCorpId
     * @return void
     */
    void syncCustomer(String extCorpId) throws WxErrorException;


    /**
     * 分配客户
     * @author xuxh
     * @date 2022/3/9 11:13
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.vo.WxStaffResignedTransferCustomerVO
     */
    StaffTransferCustomerVO transferCustomer(WxStaffResignedTransferCustomerDTO dto) throws WxErrorException;
}
