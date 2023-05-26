package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.common.constant.R;
import com.scrm.api.wx.cp.dto.MediaTagGroupPageDTO;
import com.scrm.api.wx.cp.dto.MediaTagGroupSaveDTO;
import com.scrm.api.wx.cp.dto.MediaTagGroupUpdateDTO;
import com.scrm.api.wx.cp.entity.MediaTagGroup;
import com.scrm.server.wx.cp.service.IMediaTagGroupService;
import com.scrm.api.wx.cp.vo.MediaTagGroupVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * （素材库）企业微信标签组管理 控制器
 * @author xxh
 * @since 2022-03-13
 */
@RestController
@RequestMapping("/mediaTagGroup")
@Api(tags = {"（素材库）企业微信标签组管理"})
public class MediaTagGroupController {

    @Autowired
    private IMediaTagGroupService mediaTagGroupService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "（素材库）企业微信标签组管理", operatorType = "分页查询")
    public R<IPage<MediaTagGroupVO>> pageList(@RequestBody MediaTagGroupPageDTO dto){
        return R.data(mediaTagGroupService.pageList(dto));
    }

    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "（素材库）企业微信标签组管理", operatorType = "根据主键查询")
    public R<MediaTagGroup> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "（素材库）企业微信标签组管理ID不能为空");
        return R.data(mediaTagGroupService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "（素材库）企业微信标签组管理", operatorType = "新增")
    public R<MediaTagGroup> save(@RequestBody @Valid MediaTagGroupSaveDTO dto){
        return R.data(mediaTagGroupService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "（素材库）企业微信标签组管理", operatorType = "修改")
    public R<MediaTagGroup> update(@RequestBody @Valid MediaTagGroupUpdateDTO dto){
        return R.data(mediaTagGroupService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "（素材库）企业微信标签组管理", operatorType = "删除")
    public R<Void> delete(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "（素材库）企业微信标签组管理ID不能为空");
        mediaTagGroupService.delete(id);
        return R.success("删除成功");
    }

}
