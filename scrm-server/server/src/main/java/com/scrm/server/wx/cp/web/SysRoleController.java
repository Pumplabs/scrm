package com.scrm.server.wx.cp.web;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.service.ISysRoleService;
import com.scrm.common.entity.SysRole;

import com.scrm.server.wx.cp.dto.SysRolePageDTO;
import com.scrm.server.wx.cp.dto.SysRoleSaveDTO;
import com.scrm.server.wx.cp.dto.SysRoleUpdateDTO;

import com.scrm.server.wx.cp.dto.SysRoleQueryDTO;
import com.scrm.server.wx.cp.vo.SysRoleVO;

import com.scrm.common.log.annotation.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.common.constant.R;
import org.apache.commons.lang3.StringUtils;
import org.springframework.util.Assert;
import java.util.List;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 角色信息表 控制器
 * @author xxh
 * @since 2022-06-16
 */
@RestController
@RequestMapping("/sysRole")
@Api(tags = {"角色信息表"})
public class SysRoleController {

    @Autowired
    private ISysRoleService sysRoleService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "角色信息表", operatorType = "分页查询")
    public R<IPage<SysRoleVO>> pageList(@RequestBody @Valid SysRolePageDTO dto){
        return R.data(sysRoleService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "角色信息表", operatorType = "查询列表")
    public R<List<SysRoleVO>> list(@RequestBody @Valid SysRoleQueryDTO dto){
        return R.data(sysRoleService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "角色信息表", operatorType = "根据主键查询")
    public R<SysRoleVO> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "角色信息表ID不能为空");
        return R.data(sysRoleService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "角色信息表", operatorType = "新增")
    public R<SysRole> save(@RequestBody @Valid SysRoleSaveDTO dto){
        return R.data(sysRoleService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "角色信息表", operatorType = "修改")
    public R<SysRole> update(@RequestBody @Valid SysRoleUpdateDTO dto){
        return R.data(sysRoleService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "角色信息表", operatorType = "删除")
    public R<Void> delete(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "角色信息表ID不能为空");
        sysRoleService.delete(id);
        return R.success("删除成功");
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "角色信息表", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto){
        sysRoleService.batchDelete(dto);
        return R.success("删除成功");
    }

}
