package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.scrm.common.constant.R;
import com.scrm.api.wx.cp.dto.MediaTagSaveDTO;
import com.scrm.api.wx.cp.entity.MediaTag;
import com.scrm.server.wx.cp.service.IMediaTagService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

/**
 * （素材库）企业微信标签管理 控制器
 * @author xxh
 * @since 2022-03-13
 */
@RestController
@RequestMapping("/mediaTag")
@Api(tags = {"（素材库）企业微信标签管理"})
public class MediaTagController {

    @Autowired
    private IMediaTagService mediaTagService;


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "（素材库）企业微信标签管理", operatorType = "新增")
    public R<MediaTag> save(@RequestBody @Valid MediaTagSaveDTO dto){
        return R.data(mediaTagService.save(dto));
    }



}
