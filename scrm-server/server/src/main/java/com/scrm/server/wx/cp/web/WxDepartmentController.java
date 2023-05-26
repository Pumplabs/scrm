package com.scrm.server.wx.cp.web;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.common.log.annotation.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;

import com.scrm.common.constant.R;
import com.scrm.api.wx.cp.dto.DepartmentPageDTO;
import com.scrm.api.wx.cp.dto.DepartmentSaveDTO;
import com.scrm.api.wx.cp.dto.DepartmentUpdateDTO;
import com.scrm.server.wx.cp.service.IDepartmentService;
import com.scrm.api.wx.cp.entity.Department;

import com.scrm.api.wx.cp.vo.DepartmentTreeVO;
import com.scrm.api.wx.cp.vo.DepartmentVO;
import com.scrm.server.wx.cp.service.IStaffDepartmentService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import me.chanjar.weixin.common.error.WxErrorException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * 部门控制器
 *
 * @author xxh
 * @since 2021-12-16
 */
@RestController
@RequestMapping("/department")
@Api(tags = {"部门管理"})
public class WxDepartmentController {

    @Autowired
    private IDepartmentService departmentService;

    @Autowired
    private IStaffDepartmentService staffDepartmentService;

    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "部门管理", operatorType = "分页查询")
    public R<IPage<DepartmentVO>> pageList(@RequestBody @Valid DepartmentPageDTO dto) {
        return R.data(departmentService.pageList(dto));
    }

    @GetMapping("/getTree")
    @ApiOperation(value = "获取部门树")
    @Log(modelName = "部门管理", operatorType = "获取部门树")
    @ApiImplicitParam(value = "外部企业ID", name = "extCorpId", required = true)
    public R<List<DepartmentTreeVO>> getTree(String extCorpId) {
        Assert.isTrue(StringUtils.isNotBlank(extCorpId), "外部企业ID不能为空");
        List<DepartmentTreeVO> treeVOS = Optional.ofNullable(departmentService.getTree(extCorpId)).orElse(new ArrayList<>());
        Department rootDepartment = departmentService.getRootDepartment(extCorpId);
        setStaffNum(treeVOS, rootDepartment);
        return R.data(treeVOS);
    }

    public void setStaffNum(List<DepartmentTreeVO> treeVOS, Department rootDepartment) {
        Optional.ofNullable(treeVOS).orElse(new ArrayList<>()).forEach(treeVO -> {
            if (rootDepartment.getId().equals(treeVO.getId())) {
                treeVO.setStaffNum(rootDepartment.getStaffNum());
            } else {
                treeVO.setStaffNum(staffDepartmentService.queryDepartmentStaffNum(treeVO.getExtCorpId(), treeVO.getExtId()));
            }
            setStaffNum(treeVO.getChildren(), rootDepartment);
        });
    }

    @GetMapping("/getTreeWithStaffMap")
    @ApiOperation(value = "获取部门树及员工")
    @Log(modelName = "部门管理", operatorType = "获取部门树及员工")
    @ApiImplicitParams({
            @ApiImplicitParam(value = "外部企业ID", name = "extCorpId", required = true),
            @ApiImplicitParam(value = "员工名称", name = "staffName"),
            @ApiImplicitParam(value = "排除角色key", name = "excludeRoleKey")
    })
    public R<List<DepartmentTreeVO>> getTreeWithStaffMap(String extCorpId, String staffName, String excludeRoleKey) {
        Assert.isTrue(StringUtils.isNotBlank(extCorpId), "外部企业ID不能为空");
        return R.data(departmentService.getTreeWithStaffMap(extCorpId, staffName, excludeRoleKey));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "部门管理", operatorType = "根据主键查询")
    public R<Department> findById(@PathVariable(value = "id") String id) {
        Assert.isTrue(id != null, "id不能为空");
        return R.data(departmentService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "部门管理", operatorType = "新增")
    public R<Department> save(@RequestBody @Valid DepartmentSaveDTO dto) throws WxErrorException {
        return R.data(departmentService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "部门管理", operatorType = "修改")
    public R<Department> update(@RequestBody @Valid DepartmentUpdateDTO dto) throws WxErrorException {
        return R.data(departmentService.update(dto));
    }


    @GetMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "String", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "部门管理", operatorType = "删除")
    public R<Void> delete(String id) throws WxErrorException {
        Assert.isTrue(id != null, "id不能为空");
        departmentService.delete(id);
        return R.success("删除成功");
    }


    @GetMapping("/sync")
    @ApiOperation(value = "同步企业微信数据")
    @Log(modelName = "部门管理", operatorType = "同步企业微信数据")
    @ApiImplicitParam(value = "外部企业ID", name = "extCorpId", required = true)
    public R<Void> sync(String extCorpId) {
        Assert.isTrue(StringUtils.isNotBlank(extCorpId), "外部企业ID不能为空");
        departmentService.sync(extCorpId);
        return R.success();
    }

}
