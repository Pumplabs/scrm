package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.entity.BrCommonConf;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.dto.BrCommonConfPageDTO;
import com.scrm.server.wx.cp.dto.BrCommonConfSaveDTO;
import com.scrm.server.wx.cp.dto.BrCommonConfUpdateDTO;

import com.scrm.server.wx.cp.dto.BrCommonConfQueryDTO;
import com.scrm.server.wx.cp.vo.BrCommonConfVO;

import com.scrm.api.wx.cp.dto.*;

import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;

/**
 * 通用配置 服务类
 * @author ouyang
 * @since 2022-06-07
 */
public interface IBrCommonConfService extends IService<BrCommonConf> {


    /**
     * 分页查询
     * @author ouyang
     * @date 2022-06-07
     * @param dto 请求参数
     */
    IPage<BrCommonConfVO> pageList(BrCommonConfPageDTO dto);

    /**
     * 查询列表
     * @author ouyang
     * @date 2022-06-07
     * @param dto 请求参数
     */
    List<BrCommonConfVO> queryList(BrCommonConfQueryDTO dto);

    /**
     * 根据id查询
     * @author ouyang
     * @date 2022-06-07
     * @param id 主键
     */
    BrCommonConfVO findById(String id);


    /**
     * 新增
     * @author ouyang
     * @date 2022-06-07
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrCommonConf
     */
    BrCommonConf save(BrCommonConfSaveDTO dto);

     /**
      * 修改
      * @author ouyang
      * @date 2022-06-07
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.BrCommonConf
      */
    BrCommonConf update(BrCommonConfUpdateDTO dto);


    /**
     * 删除
     * @author ouyang
     * @date 2022-06-07
     * @param id 通用配置id
     */
    void delete(String id);

    /**
     * 批量删除
     * @author ouyang
     * @date 2022-06-07
     * @param dto 请求参数
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author ouyang
     * @date 2022-06-07
     * @param id 通用配置id
     * @return com.scrm.server.wx.cp.entity.BrCommonConf
     */
    BrCommonConf checkExists(String id);

}
