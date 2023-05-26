package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.scrm.api.wx.cp.dto.SysSwitchUpdateDTO;
import com.scrm.api.wx.cp.entity.SysSwitch;
import com.scrm.server.wx.cp.service.ISysSwitchService;
import com.scrm.api.wx.cp.dto.SysSwitchQueryDTO;
import com.scrm.common.constant.R;

import java.util.List;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 系统开关控制器
 *
 * @author xxh
 * @since 2022-03-26
 */
@RestController
@RequestMapping("/sysSwitch" )
@Api(tags = {"系统开关"})
public class SysSwitchController {

    @Autowired
    private ISysSwitchService sysSwitchService;

    @PostMapping("/list" )
    @ApiOperation(value = "查询列表" )
    @Log(modelName = "系统开关", operatorType = "查询列表")
    public R<List<SysSwitch>> list(@RequestBody @Valid SysSwitchQueryDTO dto) {
        return R.data(sysSwitchService.queryList(dto));
    }

    @PostMapping("/update" )
    @ApiOperation(value = "修改" )
    @Log(modelName = "系统开关", operatorType = "修改")
    public R<SysSwitch> update(@RequestBody @Valid SysSwitchUpdateDTO dto) {
        return R.data(sysSwitchService.update(dto));
    }


}
