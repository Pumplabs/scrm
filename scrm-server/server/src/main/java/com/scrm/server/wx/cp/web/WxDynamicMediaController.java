package com.scrm.server.wx.cp.web;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.common.log.annotation.Log;
import com.scrm.common.annotation.PassToken;
import com.scrm.common.constant.R;
import com.scrm.api.wx.cp.dto.WxDynamicMediaSaveDTO;
import com.scrm.api.wx.cp.dto.WxDynamicMediaUpdateDTO;
import com.scrm.api.wx.cp.entity.WxDynamicMedia;
import com.scrm.server.wx.cp.dto.BrLookRemarkDTO;
import com.scrm.server.wx.cp.dto.WxDynamicMediaVO;
import com.scrm.server.wx.cp.service.IWxDynamicMediaService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

/**
 * 客户查看素材的动态 控制器
 * @author xxh
 * @since 2022-03-16
 */
@RestController
@RequestMapping("/wxDynamicMedia")
@Api(tags = {"客户查看素材的动态"})
public class WxDynamicMediaController {

    @Autowired
    private IWxDynamicMediaService wxDynamicMediaService;

    @PostMapping(value = "/save")
    @PassToken
    @ApiOperation(value = "新增客户动态")
    @Log(modelName = "客户查看素材的动态", operatorType = "新增客户动态")
    public R<WxDynamicMedia> save(@RequestBody @Valid WxDynamicMediaSaveDTO dto){
        return R.data(wxDynamicMediaService.save(dto));
    }


    @PostMapping(value = "/updateTime")
    @PassToken
    @ApiOperation(value = "修改浏览时长")
    @Log(modelName = "客户查看素材的动态", operatorType = "修改浏览时长")
    public R<WxDynamicMedia> updateTime(@RequestBody @Valid WxDynamicMediaUpdateDTO dto){
        return R.data(wxDynamicMediaService.updateTime(dto));
    }

    @PostMapping("/listLookRemark")
    @ApiOperation(value = "查询素材客户浏览记录")
    @Log(modelName = "素材管理", operatorType = "查询素材客户浏览记录")
    public R<IPage<WxDynamicMediaVO>> listLookRemark(@RequestBody @Valid BrLookRemarkDTO dto){
        return R.data(wxDynamicMediaService.listLookRemark(dto));
    }
}
