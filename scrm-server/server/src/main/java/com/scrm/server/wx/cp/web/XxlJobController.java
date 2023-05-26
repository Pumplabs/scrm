package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.scrm.server.wx.cp.dto.XxlJobInfoDTO;
import com.scrm.server.wx.cp.service.IXxlJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author ouyang
 * @description 测试用 后续删除
 * @date 2022/4/8 15:28
 */
@RestController
@RequestMapping("/job")
public class XxlJobController {

    @Autowired
    private IXxlJobService xxlJobService;

    @PostMapping("/add")
    public void add(@RequestBody XxlJobInfoDTO dto) {
        xxlJobService.addOrUpdate(dto);
    }

    @PostMapping("/start")
    public void start(Integer jobId) {
        xxlJobService.start(jobId);
    }

    @PostMapping("/stop")
    public void stop(Integer jobId) {
        xxlJobService.stop(jobId);
    }

    @PostMapping("/delete")
    public void delete(Integer jobId) {
        xxlJobService.delete(jobId);
    }
}
