package com.scrm.server.wx.cp.web;

import com.scrm.server.wx.cp.dto.*;
import com.scrm.common.entity.SysRole;
import com.scrm.server.wx.cp.service.ISysRoleService;
import com.scrm.server.wx.cp.service.ISysRoleStaffService;
import com.scrm.common.entity.SysRoleStaff;

import com.scrm.server.wx.cp.vo.SysRoleStaffVO;

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
 * 角色-员工关联 控制器
 *
 * @author xxh
 * @since 2022-06-16
 */
@RestController
@RequestMapping("/sysRoleStaff")
@Api(tags = {"角色-员工关联"})
public class SysRoleStaffController {

    @Autowired
    private ISysRoleStaffService sysRoleStaffService;

    @Autowired
    private ISysRoleService sysRoleService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "角色-员工关联", operatorType = "分页查询")
    public R<IPage<SysRoleStaffVO>> pageList(@RequestBody @Valid SysRoleStaffPageDTO dto) {
        return R.data(sysRoleStaffService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "角色-员工关联", operatorType = "查询列表")
    public R<List<SysRoleStaffVO>> list(@RequestBody @Valid SysRoleStaffQueryDTO dto) {
        return R.data(sysRoleStaffService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "角色-员工关联", operatorType = "根据主键查询")
    public R<SysRoleStaffVO> findById(@PathVariable(value = "id") String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "角色-员工关联ID不能为空");
        return R.data(sysRoleStaffService.findById(id));
    }


    @PostMapping(value = "/saveAdmin")
    @ApiOperation(value = "新增")
    @Log(modelName = "角色-员工关联", operatorType = "新增")
    public R<List<SysRoleStaff>> saveAdmin(@RequestBody @Valid SysRoleStaffSaveAdminDTO dto) {
        SysRole enterpriseAdminRole = sysRoleService.getEnterpriseAdminRole();
        return R.data(sysRoleStaffService.save(new SysRoleStaffSaveDTO().setRoleId(enterpriseAdminRole.getId())
                .setExtStaffIds(dto.getExtStaffIds())
                .setExtCorpId(dto.getExtCorpId())));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "角色-员工关联", operatorType = "删除")
    public R<Void> delete(String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "角色-员工关联ID不能为空");
        sysRoleStaffService.delete(id);
        return R.success("删除成功");
    }

}
