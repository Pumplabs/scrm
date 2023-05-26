package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.BrSopRule;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.vo.BrSopRuleVO;

import java.util.List;

/**
 * sop规则 服务类
 * @author ouyang
 * @since 2022-04-17
 */
public interface IBrSopRuleService extends IService<BrSopRule> {

    /**
     * 查询列表
     * @author ouyang
     * @date 2022-04-17
     * @param dto 请求参数
     */
    List<BrSopRuleVO> queryList(BrSopRuleQueryDTO dto);

    /**
     * 根据id查询
     * @author ouyang
     * @date 2022-04-17
     * @param id 主键
     */
    BrSopRuleVO findById(String id);


    /**
     * 新增
     * @author ouyang
     * @date 2022-04-17
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrSopRule
     */
    BrSopRule save(BrSopRuleSaveOrUpdateDTO dto);

     /**
      * 修改
      * @author ouyang
      * @date 2022-04-17
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.BrSopRule
      */
    BrSopRule update(BrSopRuleSaveOrUpdateDTO dto);


    /**
     * 删除
     * @author ouyang
     * @date 2022-04-17
     * @param sopId sopid
     */
    void deleteBySopId(String sopId);

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
     * @param id sop规则id
     * @return com.scrm.server.wx.cp.entity.BrSopRule
     */
    BrSopRule checkExists(String id);

}
