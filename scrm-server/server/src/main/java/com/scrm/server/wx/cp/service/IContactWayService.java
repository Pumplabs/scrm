package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.ContactWayPageDTO;
import com.scrm.api.wx.cp.dto.ContactWaySaveDTO;
import com.scrm.api.wx.cp.dto.ContactWayUpdateDTO;
import com.scrm.api.wx.cp.entity.ContactWay;
import com.scrm.api.wx.cp.vo.*;
import com.scrm.common.dto.BatchDTO;
import me.chanjar.weixin.cp.bean.external.WxCpContactWayResult;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * 渠道活码 服务类
 * @author xxh
 * @since 2021-12-26
 */
public interface IContactWayService extends IService<ContactWay> {


    /**
     * 分页查询
     * @author xxh
     * @date 2021-12-26
     * @param dto 请求参数
     */
    IPage<ContactWayVO> pageList(ContactWayPageDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2021-12-26
     * @param id 主键
     */
    ContactWayVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2021-12-26
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.ContactWay
     */
    ContactWay save(ContactWaySaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2021-12-26
      * @param dto 请求参数
      * @return com.scrm.api.wx.cp.entity.ContactWay
      */
    ContactWay update(ContactWayUpdateDTO dto);


    /**
     * 删除
     * @author xxh
     * @date 2021-12-26
     * @param id 渠道活码id
     */
    void delete(String id);

    /**
     * 批量删除
     * @author xxh
     * @date 2021-12-26
     * @param dto 请求参数
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2021-12-26
     * @param id 渠道活码id
     * @return com.scrm.api.wx.cp.entity.ContactWay
     */
    ContactWay checkExists(String id);

    /**
     * 获取通用的渠道活码，都是默认参数
     * @param configId 更新传这个，新增传null
     * @param state
     * @param extStaffIds
     * @param skipVerify
     * @return
     */
    WxCpContactWayResult getCommonContact(String extCorpId, String configId, String state,
                                          List<String> extStaffIds, Boolean skipVerify);

    /**
     * 根据configIdList删除渠道活码
     * @param configIdList
     */
    void deleteByConfigIds(String extCorpId, List<String> configIdList);

    /**
     * 统计总的情况
     * @param paramsVO
     * @return
     */
    ContactWayCountTotalResVO countTotal(ContactWayCountParamsVO paramsVO);

    /**
     * 根据时间统计
     * @param paramsVO
     * @return
     */
    List<ContactWayCountResVO> countByDate(ContactWayCountParamsVO paramsVO);

    /**
     * 根据员工统计
     * @param paramsVO
     * @return
     */
    List<ContactWayCountResVO> countByStaff(ContactWayCountParamsVO paramsVO);

    /**
     * 根据客户统计
     * @param paramsVO
     * @return
     */
    List<ContactWayCountDetailVO> countByCustomer(ContactWayCountParamsVO paramsVO);

    /**
     * 导出渠道活码统计(根据时间)
     * @param paramsVO
     * @return
     */
    void exportUrlByDate(ContactWayCountParamsVO paramsVO, HttpServletRequest request, HttpServletResponse response);

    /**
     * 获取渠道活码统计，企微转译员工id
     * @param paramsVO
     * @return
     */
    void getExportUrlByStaff(ContactWayCountParamsVO paramsVO);

    /**
     * 同上
     * @param paramsVO
     * @return
     */
    void getExportUrlByCustomer(ContactWayCountParamsVO paramsVO);

    /**
     * 更新渠道活码实际的员工
     * @param id
     */
    void updateRealityStaff(String id);
}
