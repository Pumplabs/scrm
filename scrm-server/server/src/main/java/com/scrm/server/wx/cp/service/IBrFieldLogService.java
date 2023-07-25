package com.scrm.server.wx.cp.service;

import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.BrFieldLog;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.vo.BrFieldLogVO;
import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.Date;
import java.util.List;

/**
 * 字段变化记录 服务类
 * @author ouyang
 * @since 2022-06-17
 */
public interface IBrFieldLogService extends IService<BrFieldLog> {


    /**
     * 分页查询
     * @author ouyang
     * @date 2022-06-17
     * @param dto 请求参数
     */
    IPage<BrFieldLogVO> pageList(BrFieldLogPageDTO dto);

    /**
     * 查询列表
     * @author ouyang
     * @date 2022-06-17
     * @param dto 请求参数
     */
    List<BrFieldLogVO> queryList(BrFieldLogQueryDTO dto);

    /**
     * 根据id查询
     * @author ouyang
     * @date 2022-06-17
     * @param id 主键
     */
    BrFieldLogVO findById(String id);


    /**
     * 新增(字段变更)
     * @author ouyang
     * @date 2022-06-17
     * @return com.scrm.server.wx.cp.entity.BrFieldLog
     */
    void save(Object oldObj, Object newObj, String tableName, String dataId, String extCorpId);

    /**
     * 新增
     * @author ouyang
     * @date 2022-06-17
     * @return com.scrm.server.wx.cp.entity.BrFieldLog
     */
    void save(String tableName, String dataId, Integer method, BrFieldLogInfoDTO info, Date operDate, String operId);


    /**
     * 校验是否存在
     * @author ouyang
     * @date 2022-06-17
     * @param id 字段变化记录id
     * @return com.scrm.server.wx.cp.entity.BrFieldLog
     */
    BrFieldLog checkExists(String id);

    /**
     * 删除
     * @author ouyang
     * @date 2023-05-16
     */
    void deleteByDataIds(String tableName, List<String> dataIds);

}
