package com.scrm.server.wx.cp.web;

import com.scrm.common.constant.R;
import com.scrm.common.log.annotation.Log;
import com.scrm.server.wx.cp.dto.BrMediaSayGroupQueryDTO;
import com.scrm.server.wx.cp.dto.BrMediaSayGroupSaveDTO;
import com.scrm.server.wx.cp.dto.BrMediaSayGroupUpdateDTO;
import com.scrm.server.wx.cp.entity.BrMediaSayGroup;
import com.scrm.server.wx.cp.service.IBrMediaSayGroupService;
import com.scrm.server.wx.cp.vo.BrMediaSayGroupVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

/**
 * （素材库）企业微信话术组管理 控制器
 * @author xxh
 * @since 2022-05-10
 */
@RestController
@RequestMapping("/brMediaSayGroup")
@Api(tags = {"（素材库）企业微信话术组管理"})
public class BrMediaSayGroupController {

    @Autowired
    private IBrMediaSayGroupService brMediaSayGroupService;

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "（素材库）企业微信话术组管理", operatorType = "查询列表")
    public R<List<BrMediaSayGroupVO>> list(@RequestBody @Valid BrMediaSayGroupQueryDTO dto){
        return R.data(brMediaSayGroupService.queryList(dto));
    }

    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "（素材库）企业微信话术组管理", operatorType = "新增")
    public R<BrMediaSayGroup> save(@RequestBody @Valid BrMediaSayGroupSaveDTO dto){
        return R.data(brMediaSayGroupService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "（素材库）企业微信话术组管理", operatorType = "修改")
    public R<BrMediaSayGroup> update(@RequestBody @Valid BrMediaSayGroupUpdateDTO dto){
        return R.data(brMediaSayGroupService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "（素材库）企业微信话术组管理", operatorType = "删除")
    public R<Void> delete(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "（素材库）企业微信话术组管理ID不能为空");
        brMediaSayGroupService.delete(id);
        return R.success("删除成功");
    }


}
