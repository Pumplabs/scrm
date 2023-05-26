package com.scrm.server.wx.cp.web;

import com.scrm.server.wx.cp.service.IBrOpportunityGroupService;
import com.scrm.server.wx.cp.entity.BrOpportunityGroup;

import com.scrm.server.wx.cp.dto.BrOpportunityGroupPageDTO;
import com.scrm.server.wx.cp.dto.BrOpportunityGroupSaveDTO;
import com.scrm.server.wx.cp.dto.BrOpportunityGroupUpdateDTO;

import com.scrm.server.wx.cp.dto.BrOpportunityGroupQueryDTO;
import com.scrm.server.wx.cp.vo.BrOpportunityGroupVO;

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
 * 商机分组 控制器
 * @author ouyang
 * @since 2022-06-07
 */
@RestController
@RequestMapping("/brOpportunityGroup")
@Api(tags = {"商机分组"})
public class BrOpportunityGroupController {

    @Autowired
    private IBrOpportunityGroupService brOpportunityGroupService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "商机分组", operatorType = "分页查询")
    public R<IPage<BrOpportunityGroupVO>> pageList(@RequestBody @Valid BrOpportunityGroupPageDTO dto){
        return R.data(brOpportunityGroupService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "商机分组", operatorType = "查询列表")
    public R<List<BrOpportunityGroupVO>> list(@RequestBody @Valid BrOpportunityGroupQueryDTO dto){
        return R.data(brOpportunityGroupService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "商机分组", operatorType = "根据主键查询")
    public R<BrOpportunityGroupVO> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "商机分组ID不能为空");
        return R.data(brOpportunityGroupService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "商机分组", operatorType = "新增")
    public R<BrOpportunityGroup> save(@RequestBody @Valid BrOpportunityGroupSaveDTO dto){
        return R.data(brOpportunityGroupService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "商机分组", operatorType = "修改")
    public R<BrOpportunityGroup> update(@RequestBody @Valid BrOpportunityGroupUpdateDTO dto){
        return R.data(brOpportunityGroupService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "商机分组", operatorType = "删除")
    public R<Void> delete(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "商机分组ID不能为空");
        brOpportunityGroupService.delete(id);
        return R.success("删除成功");
    }

}
