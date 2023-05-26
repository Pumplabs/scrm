package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.common.constant.R;
import com.scrm.common.dto.BatchDTO;
import com.scrm.api.wx.cp.dto.MediaInfoPageDTO;
import com.scrm.api.wx.cp.dto.MediaInfoSaveDTO;
import com.scrm.api.wx.cp.dto.MediaInfoUpdateDTO;
import com.scrm.api.wx.cp.entity.MediaInfo;
import com.scrm.server.wx.cp.service.IMediaInfoService;
import com.scrm.api.wx.cp.vo.MediaInfoVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * 素材管理 控制器
 * @author xxh
 * @since 2022-03-14
 */
@RestController
@RequestMapping("/mediaInfo")
@Api(tags = {"素材管理"})
public class MediaInfoController {

    @Autowired
    private IMediaInfoService mediaInfoService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "素材管理", operatorType = "分页查询")
    public R<IPage<MediaInfoVO>> pageList(@RequestBody @Valid MediaInfoPageDTO dto){
        return R.data(mediaInfoService.pageList(dto));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "素材管理", operatorType = "根据主键查询")
    public R<MediaInfo> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "素材管理ID不能为空");
        return R.data(mediaInfoService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "素材管理", operatorType = "新增")
    public R<MediaInfo> save(@RequestBody @Valid MediaInfoSaveDTO dto){
        return R.data(mediaInfoService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "素材管理", operatorType = "修改")
    public R<MediaInfo> update(@RequestBody @Valid MediaInfoUpdateDTO dto){
        return R.data(mediaInfoService.update(dto));
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "素材管理", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto){
        mediaInfoService.batchDelete(dto);
        return R.success("删除成功");
    }

}
