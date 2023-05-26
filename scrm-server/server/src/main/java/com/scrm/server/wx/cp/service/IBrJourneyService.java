package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.api.wx.cp.entity.BrJourney;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.dto.BrJourneyPageDTO;
import com.scrm.server.wx.cp.dto.BrJourneySaveDTO;
import com.scrm.server.wx.cp.dto.BrJourneyUpdateDTO;

import com.scrm.server.wx.cp.dto.BrJourneyQueryDTO;
import com.scrm.server.wx.cp.vo.BrJourneyStatisticsInfoVO;
import com.scrm.server.wx.cp.vo.BrJourneyVO;

import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;

/**
 * 旅程信息 服务类
 * @author xxh
 * @since 2022-04-06
 */
public interface IBrJourneyService extends IService<BrJourney> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-04-06
     * @param dto 请求参数
     */
    IPage<BrJourneyVO> pageList(BrJourneyPageDTO dto);

    /**
     * 查询列表
     * @author xxh
     * @date 2022-04-06
     * @param dto 请求参数
     */
    List<BrJourneyVO> queryList(BrJourneyQueryDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-04-06
     * @param id 主键
     */
    BrJourneyVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-04-06
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.BrJourney
     */
    BrJourney save(BrJourneySaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2022-04-06
      * @param dto 请求参数
      * @return com.scrm.api.wx.cp.entity.BrJourney
      */
    BrJourney update(BrJourneyUpdateDTO dto);


    /**
     * 删除
     * @author xxh
     * @date 2022-04-06
     * @param id 旅程信息id
     */
    void delete(String id);

    /**
     * 批量删除
     * @author xxh
     * @date 2022-04-06
     * @param dto 请求参数
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-04-06
     * @param id 旅程信息id
     * @return com.scrm.api.wx.cp.entity.BrJourney
     */
    BrJourney checkExists(String id);

    /**
     * 获取统计信息
     * @param extCorpId 外部企业ID
     * @return
     */
    List<BrJourneyStatisticsInfoVO> getStatistics(String extCorpId);
}
