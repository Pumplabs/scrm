package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.entity.BrFollowTask;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.dto.BrFollowTaskPageDTO;
import com.scrm.server.wx.cp.dto.BrFollowTaskSaveDTO;
import com.scrm.server.wx.cp.dto.BrFollowTaskUpdateDTO;

import com.scrm.server.wx.cp.dto.BrFollowTaskQueryDTO;
import com.scrm.server.wx.cp.vo.BrFollowTaskVO;

import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;

/**
 * 跟进任务 服务类
 * @author ouyang
 * @since 2022-06-16
 */
public interface IBrFollowTaskService extends IService<BrFollowTask> {


    /**
     * 分页查询
     * @author ouyang
     * @date 2022-06-16
     * @param dto 请求参数
     */
    IPage<BrFollowTaskVO> pageList(BrFollowTaskPageDTO dto);

    /**
     * 查询列表
     * @author ouyang
     * @date 2022-06-16
     * @param dto 请求参数
     */
    List<BrFollowTaskVO> queryList(BrFollowTaskQueryDTO dto);

    /**
     * 根据id查询
     * @author ouyang
     * @date 2022-06-16
     * @param id 主键
     */
    BrFollowTaskVO findById(String id);


    /**
     * 新增
     * @author ouyang
     * @date 2022-06-16
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrFollowTask
     */
    BrFollowTask save(BrFollowTaskSaveDTO dto, Boolean isTodo);

     /**
      * 修改
      * @author ouyang
      * @date 2022-06-16
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.BrFollowTask
      */
    BrFollowTask update(BrFollowTaskUpdateDTO dto, Boolean isTodo);


    /**
     * 删除
     * @author ouyang
     * @date 2022-06-16
     * @param id 跟进任务id
     */
    void delete(String id);

    /**
     * 批量删除
     * @author ouyang
     * @date 2022-06-16
     * @param dto 请求参数
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author ouyang
     * @date 2022-06-16
     * @param id 跟进任务id
     * @return com.scrm.server.wx.cp.entity.BrFollowTask
     */
    BrFollowTask checkExists(String id);

    /**
     * 完成任务
     * @param extCorpId
     * @param taskId
     */
    void finishTask(String extCorpId, String taskId);
}
