package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.entity.BrOrder;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.dto.BrOrderPageDTO;
import com.scrm.server.wx.cp.dto.BrOrderSaveDTO;
import com.scrm.server.wx.cp.dto.BrOrderUpdateDTO;

import com.scrm.server.wx.cp.dto.BrOrderQueryDTO;
import com.scrm.server.wx.cp.vo.BrOrderVO;

import com.scrm.api.wx.cp.dto.*;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.server.wx.cp.vo.DailyTotalVO;
import com.scrm.server.wx.cp.vo.TopNStatisticsVo;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 订单 服务类
 * @author xxh
 * @since 2022-07-17
 */
public interface IBrOrderService extends IService<BrOrder> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-07-17
     * @param dto 请求参数
     */
    IPage<BrOrderVO> pageList(BrOrderPageDTO dto);

    /**
     * 查询列表
     * @author xxh
     * @date 2022-07-17
     * @param dto 请求参数
     */
    List<BrOrderVO> queryList(BrOrderQueryDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-07-17
     * @param id 主键
     */
    BrOrderVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-07-17
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrOrder
     */
    BrOrderVO save(BrOrderSaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2022-07-17
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.BrOrder
      */
    BrOrder update(BrOrderUpdateDTO dto);


    /**
     * 删除
     * @author xxh
     * @date 2022-07-17
     * @param id 订单id
     */
    void delete(String id);

    /**
     * 批量删除
     * @author xxh
     * @date 2022-07-17
     * @param dto 请求参数
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-07-17
     * @param id 订单id
     * @return com.scrm.server.wx.cp.entity.BrOrder
     */
    BrOrder checkExists(String id);


    Long getAddedCountByDate(Date date, String extCorpId);

    List<Map<String, Object>> countByDateAndCorp(Date date);


    List<TopNStatisticsVo> getStaffTotalAmountByDates(String extCorpId, Integer dates, Integer topN);

    Long countByDateAndStaff();
    Long countByToday();

    /**
     * 获取订单个数趋势
     * @param days
     * @return
     */
    List<DailyTotalVO> getLastNDaysCountDaily(Integer days);
}
