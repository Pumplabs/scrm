package com.scrm.server.wx.cp.web;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.common.annotation.PassToken;
import com.scrm.common.constant.R;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.log.annotation.Log;
import com.scrm.server.wx.cp.dto.BrProductInfoPageDTO;
import com.scrm.server.wx.cp.dto.BrProductInfoQueryDTO;
import com.scrm.server.wx.cp.dto.BrProductInfoSaveDTO;
import com.scrm.server.wx.cp.dto.BrProductInfoUpdateDTO;
import com.scrm.server.wx.cp.entity.BrProductInfo;
import com.scrm.server.wx.cp.service.IBrProductInfoService;
import com.scrm.server.wx.cp.vo.BrProductInfoVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 产品分类 控制器
 *
 * @author xxh
 * @since 2022-07-17
 */
@RestController
@RequestMapping("/brProductInfo")
@Api(tags = {"产品信息"})
public class BrProductInfoController {

    @Autowired
    private IBrProductInfoService brProductInfoService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "产品分类", operatorType = "分页查询")
    public R<IPage<BrProductInfoVO>> pageList(@RequestBody @Valid BrProductInfoPageDTO dto) {
        return R.data(brProductInfoService.pageList(dto));
    }

    @PostMapping("/list")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "产品分类", operatorType = "查询列表")
    public R<List<BrProductInfoVO>> list(@RequestBody @Valid BrProductInfoQueryDTO dto) {
        return R.data(brProductInfoService.queryList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "产品分类", operatorType = "根据主键查询")
    @PassToken
    public R<BrProductInfoVO> findById(@PathVariable(value = "id") String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "产品ID不能为空");
        return R.data(brProductInfoService.findById(id));
    }

    @GetMapping("/addViews")
    @ApiOperation(value = "累计浏览次数")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @Log(modelName = "产品分类", operatorType = "累计浏览次数")
    @PassToken
    public R<Void> addViews(String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "产品ID不能为空");
        brProductInfoService.addViews(id);
        return R.success();
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "产品分类", operatorType = "新增")
    public R<BrProductInfo> save(@RequestBody @Valid BrProductInfoSaveDTO dto) {
        return R.data(brProductInfoService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "产品分类", operatorType = "修改")
    public R<BrProductInfo> update(@RequestBody @Valid BrProductInfoUpdateDTO dto) {
        return R.data(brProductInfoService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "产品分类", operatorType = "删除")
    public R<Void> delete(String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "产品分类ID不能为空");
        brProductInfoService.delete(id);
        return R.success("删除成功");
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "产品分类", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto) {
        brProductInfoService.batchDelete(dto);
        return R.success("删除成功");
    }

}
