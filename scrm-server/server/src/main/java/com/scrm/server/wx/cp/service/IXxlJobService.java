package com.scrm.server.wx.cp.service;

import com.scrm.server.wx.cp.dto.XxlJobInfoDTO;
import com.scrm.server.wx.cp.dto.XxlJobQueryDto;
import com.scrm.server.wx.cp.entity.XxlJobInfo;

import java.util.List;

/**
 * @author ouyang
 * @description xxl-job定时任务操作类
 * @date 2022/4/10
 **/
public interface IXxlJobService {

    /**
     * 增加定时任务
     * @return jobId
     */
    Integer addOrUpdate(XxlJobInfoDTO dto);

    /**
     * 启动定时任务
     * @param jobId jobId
     * @return 启动定时任务
     */
    void start(Integer jobId);

    /**
     * 停止定时任务
     * @param jobId jobId
     * @return 停止定时任务
     */
    void stop(Integer jobId);

    /**
     * 删除定时任务
     * @param jobId jobId
     * @return 删除定时任务
     */
    void delete(int jobId);

    /**
     * 查询定时任务
     * @param dto dto
     * @return 删除定时任务
     */
    List<XxlJobInfo> getList(XxlJobQueryDto dto);

    /**
     * 更新定时任务
     * @return xxlJobInfo
     */
    Integer update( XxlJobInfo xxlJobInfo);

}
