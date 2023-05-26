package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.vo.WxCustomerVO;
import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.BrJourneyStageCustomer;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.vo.BrJourneyStageCustomerVO;

import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.List;

/**
 * 旅程阶段-客户关联 服务类
 *
 * @author xxh
 * @since 2022-04-06
 */
public interface IBrJourneyStageCustomerService extends IService<BrJourneyStageCustomer> {


    /**
     * 分页查询
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-04-06
     */
    IPage<BrJourneyStageCustomerVO> pageList(BrJourneyStageCustomerPageDTO dto);

    /**
     * 查询列表
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-04-06
     */
    List<BrJourneyStageCustomerVO> queryList(BrJourneyStageCustomerQueryDTO dto);

    /**
     * 根据id查询
     *
     * @param id 主键
     * @author xxh
     * @date 2022-04-06
     */
    BrJourneyStageCustomerVO findById(String id);


    /**
     * 新增
     *
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrJourneyStageCustomer
     * @author xxh
     * @date 2022-04-06
     */
    BrJourneyStageCustomer save(BrJourneyStageCustomerSaveDTO dto);

    /**
     * 修改
     *
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrJourneyStageCustomer
     * @author xxh
     * @date 2022-04-06
     */
    BrJourneyStageCustomer update(BrJourneyStageCustomerUpdateDTO dto);


    /**
     * 删除
     *
     * @param id 旅程阶段-客户关联id
     * @author xxh
     * @date 2022-04-06
     */
    void delete(String id);

    /**
     * 批量删除
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-04-06
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     *
     * @param id 旅程阶段-客户关联id
     * @return com.scrm.server.wx.cp.entity.BrJourneyStageCustomer
     * @author xxh
     * @date 2022-04-06
     */
    BrJourneyStageCustomer checkExists(String id);

    /**
     * 获取客户列表(去除已存在该旅程的客户)
     *
     * @param dto
     * @return com.baomidou.mybatisplus.core.metadata.IPage<com.scrm.api.wx.cp.vo.WxCustomerVO>
     * @author xuxh
     * @date 2022/4/8 17:28
     */
    IPage<WxCustomerVO> pageCustomerList(BrJourneyCustomerPageDTO dto);

    /**
     * 批量新增
     * @param dto 请求参数
     * @return 列表
     */
    List<BrJourneyStageCustomer> batchSave(BrJourneyStageCustomerBatchSaveDTO dto);

    /**
     * 根据客户extId和阶段id删除
     * @param customerExtId 客户extId
     * @param stageId 阶段ID
     */
    void deleteByCustomerExtIdAndStageId(String customerExtId, String stageId);
}
