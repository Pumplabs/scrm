package com.scrm.server.wx.cp.web;

import com.scrm.common.constant.R;
import com.scrm.common.log.annotation.Log;
import com.scrm.server.wx.cp.dto.BrMediaCountQueryDTO;
import com.scrm.server.wx.cp.dto.BrMediaCountSaveDTO;
import com.scrm.server.wx.cp.service.IBrMediaCountService;
import com.scrm.server.wx.cp.vo.BrMediaCountVO;
import com.scrm.server.wx.cp.vo.BrMediaTodayCountVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 素材统计表 控制器
 * @author xxh
 * @since 2022-05-15
 */
@RestController
@RequestMapping("/brMediaCount")
@Api(tags = {"素材统计表"})
public class BrMediaCountController {

    @Autowired
    private IBrMediaCountService brMediaCountService;

    @PostMapping("/sortCount")
    @ApiOperation(value = "查询发送/浏览Top")
    @Log(modelName = "素材统计表", operatorType = "查询发送/浏览Top")
    public R<List<BrMediaCountVO>> sortCount(@RequestBody @Valid BrMediaCountQueryDTO dto){
        return R.data(brMediaCountService.sortCount(dto));
    }

    @PostMapping(value = "/addSendCount")
    @ApiOperation(value = "增加发送次数")
    @Log(modelName = "素材统计表", operatorType = "增加发送次数")
    public R addSendCount(@RequestBody @Valid BrMediaCountSaveDTO dto){
        brMediaCountService.addSendCount(dto);
        return R.success();
    }

    @GetMapping(value = "/getTodayCount")
    @ApiOperation(value = "获取今天的统计")
    @Log(modelName = "素材统计表", operatorType = "获取今天的统计")
    public R<BrMediaTodayCountVO> getTodayCount(){
        return R.data(brMediaCountService.getTodayCount());
    }

}
