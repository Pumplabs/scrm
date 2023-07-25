package com.scrm.server.wx.cp.mapper;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.scrm.api.wx.cp.dto.WxCustomerDropDownPageDTO;
import com.scrm.api.wx.cp.dto.WxCustomerExportDTO;
import com.scrm.api.wx.cp.dto.WxCustomerPageDTO;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.scrm.api.wx.cp.vo.WxCustomerVO;
import com.scrm.server.wx.cp.dto.BrJourneyCustomerPageDTO;

import com.scrm.server.wx.cp.dto.WxCustomerAssistPageDTO;
import com.scrm.server.wx.cp.vo.DailyTotalVO;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 企业微信客户 Mapper接口
 *
 * @author xxh
 * @since 2021-12-22
 */
public interface WxCustomerMapper extends BaseMapper<WxCustomer> {

    /**
     * 获取一条数据（会查出被删除的数据）
     *
     * @param id 客户id
     * @return 客户
     */
    WxCustomer findOne(String id);

    Page<WxCustomer> list(@Param("page") Page<WxCustomer> page, @Param("dto") WxCustomerPageDTO dto);

    List<WxCustomer> queryList(@Param("dto") WxCustomerExportDTO dto);


    /**
     * 查询（会查出被删除的数据）
     *
     * @param extCorpId
     * @param extId
     * @return
     */
    WxCustomer findByExtCorpIdAndExtId(@Param("extCorpId") String extCorpId, @Param("extId") String extId);

    /**
     * 查询（会查出被删除的数据）
     *
     * @param name
     * @param hasDelete
     * @return
     */
    List<String> findByCondition(@Param("name") String name, @Param("hasDelete") Boolean hasDelete);

    /**
     * 根据id查询集合
     *
     * @param extCorpId
     * @param extIds
     * @return
     */
    List<WxCustomerVO> findByExtIds(@Param("extCorpId") String extCorpId, @Param("extIds") List<String> extIds);

    /**
     * 根据名字模糊查询
     *
     * @param extCorpId
     * @param name
     * @return
     */
    List<String> findByName(@Param("extCorpId") String extCorpId, @Param("name") String name);

    Page<WxCustomer> pageCustomerList(Page<WxCustomer> page, @Param("dto") BrJourneyCustomerPageDTO dto);

    IPage<WxCustomer> dropDownPageList(Page<WxCustomer> page, @Param("dto") WxCustomerDropDownPageDTO dto);

    Page<WxCustomer>  pageAssistList(@Param("page") Page<WxCustomer> page, @Param("dto") WxCustomerAssistPageDTO dto);

    /**
     * 计算客户总数
     * @author xuxh
     * @date 2022/8/18 9:39
     * @param extCorpId 所属企业
     * @return int
     */
    int count(String extCorpId);


    Long addedByDate(Date date, String extCorpId);

    List<Map<String, Object>> countByDateAndCorp(@Param("date") Date date);

    List<DailyTotalVO> getLastNDaysCountDaily(@Param("startTime") Date startTime,
                                              @Param("endTime") Date endTime,
                                              @Param("extCorpId") String extCorpId);

}
