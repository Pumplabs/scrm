package com.scrm.server.wx.cp.web;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.api.wx.cp.dto.StaffExportDTO;
import com.scrm.api.wx.cp.dto.StaffPageDTO;
import com.scrm.api.wx.cp.dto.StaffSaveDTO;
import com.scrm.api.wx.cp.dto.StaffUpdateDTO;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.vo.StaffVO;
import com.scrm.common.constant.R;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.log.annotation.Log;
import com.scrm.server.wx.cp.service.IStaffService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import me.chanjar.weixin.common.error.WxErrorException;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 控制器
 *
 * @author xxh
 * @since 2021-12-16
 */
@RestController
@RequestMapping("/staff")
@Api(tags = {"企业员工管理"})
public class WxStaffController {

    @Autowired
    private IStaffService staffService;


    @GetMapping("/sync")
    @ApiOperation(value = "同步企业微信数据")
    @Log(modelName = "企业员工管理", operatorType = "同步企业微信数据")
    @ApiImplicitParam(value = "外部企业ID", name = "extCorpId", required = true)
    public R<Boolean> pageList(String extCorpId) {
        Assert.isTrue(StringUtils.isNotBlank(extCorpId), "外部企业ID不能为空");
        return R.data(staffService.sync(extCorpId));
    }

    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "企业员工管理", operatorType = "分页查询")
    public R<IPage<StaffVO>> pageList(@RequestBody @Valid StaffPageDTO dto) {
        return R.data(staffService.pageList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "企业员工管理", operatorType = "根据主键查询")
    public R<Staff> findById(@PathVariable(value = "id") String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "id不能为空");
        return R.data(staffService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "企业员工管理", operatorType = "新增")
    public R<Staff> save(@RequestBody @Valid StaffSaveDTO dto) throws WxErrorException {
        return R.data(staffService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "企业员工管理", operatorType = "修改")
    public R<Staff> update(@RequestBody @Valid StaffUpdateDTO dto) throws WxErrorException {
        return R.data(staffService.update(dto));
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "企业员工管理", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto) throws WxErrorException {
        staffService.batchDelete(dto);
        return R.success("删除成功");
    }

    @GetMapping("/export")
    @ApiOperation(value = "导出")
    @Log(modelName = "企业员工管理", operatorType = "导出")
    public void exportList(@Valid StaffExportDTO dto) {
        staffService.exportList(dto);
    }

}
