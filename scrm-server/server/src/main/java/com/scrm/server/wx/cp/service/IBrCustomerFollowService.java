package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.dto.BrCustomerFollowPageDTO;
import com.scrm.server.wx.cp.dto.BrCustomerFollowQueryDTO;
import com.scrm.server.wx.cp.dto.BrCustomerFollowSaveDTO;
import com.scrm.server.wx.cp.dto.BrCustomerFollowUpdateDTO;
import com.scrm.server.wx.cp.entity.BrCustomerFollow;
import com.scrm.server.wx.cp.vo.BrCustomerFollowVO;
import com.scrm.server.wx.cp.vo.TopNStatisticsVo;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 客户跟进 服务类
 * @author xxh
 * @since 2022-05-19
 */
public interface IBrCustomerFollowService extends IService<BrCustomerFollow> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-05-19
     * @param dto 请求参数
     */
    IPage<BrCustomerFollowVO> pageList(BrCustomerFollowPageDTO dto);

    /**
     * 查询
     * @author xxh
     * @date 2022-05-19
     * @param dto 请求参数
     */
    List<BrCustomerFollowVO> list(BrCustomerFollowQueryDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-05-19
     * @param id 主键
     */
    BrCustomerFollowVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-05-19
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrCustomerFollow
     */
    void save(BrCustomerFollowSaveDTO dto);

    /**
     * 修改
     * @author xxh
     * @date 2022-05-19
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrCustomerFollow
     */
    BrCustomerFollow update(BrCustomerFollowUpdateDTO dto);


    /**
     * 删除
     * @author xxh
     * @date 2022-05-19
     * @param id 客户跟进id
     */
    void delete(String id);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-05-19
     * @param id 客户跟进id
     * @return com.scrm.server.wx.cp.entity.BrCustomerFollow
     */
    BrCustomerFollow checkExists(String id);


    Long getAddedCountByDate(Date date, String extCorpId);

    List<Map<String, Object>> countByDateAndCorp(Date date);


    List<TopNStatisticsVo> getStaffTotalFollowUpByDates(String extCorpId, Integer dates, Integer topN);

    Long countByDateAndStaff();

    Long countByToday();
}
