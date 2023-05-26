package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.scrm.common.constant.R;
import com.scrm.server.wx.cp.schedule.FileTask;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/30 15:21
 * @description：定时任务接口
 **/
@RestController
@RequestMapping("/schedule")
@Api(tags = {"(测试用,不开放给前端)定时任务接口"})
public class TaskController {

    @Autowired
    private FileTask fileTask;

    @GetMapping("/handleExpireFile")
    @ApiOperation("执行处理过期文件的定时任务")
    @Log(modelName = "(测试用,不开放给前端)定时任务接口", operatorType = "执行处理过期文件的定时任务")
    public R handleExpireFile(){
        fileTask.handleExpireFile();
        return R.success();
    }

}
