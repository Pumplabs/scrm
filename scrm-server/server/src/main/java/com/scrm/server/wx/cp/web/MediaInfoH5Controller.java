package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.scrm.api.wx.cp.entity.MediaInfo;
import com.scrm.common.annotation.PassToken;
import com.scrm.common.constant.R;
import com.scrm.common.exception.BaseException;
import com.scrm.server.wx.cp.service.IMediaInfoService;
import com.scrm.server.wx.cp.service.IWxTempFileService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/4 10:37
 * @description：轨迹素材的H5接口
 **/
@RestController
@RequestMapping("/mediaH5")
@Api(tags = {"轨迹素材的H5接口"})
public class MediaInfoH5Controller {

    @Autowired
    private IMediaInfoService mediaInfoService;

    @Autowired
    private IWxTempFileService fileService;

    @GetMapping("/{id}")
    @PassToken
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "轨迹素材的H5接口", operatorType = "根据主键查询")
    public R<MediaInfo> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "素材管理ID不能为空");
        return R.data(mediaInfoService.findById(id));
    }

    @GetMapping("/downloadByFileId")
    @PassToken
    @ApiOperation(value = "根据文件id下载文件")
    @Log(modelName = "轨迹素材的H5接口", operatorType = "根据文件id下载文件")
    public void downloadByFileId(@RequestParam String fileId, HttpServletResponse response) {
        if (fileId == null) {
            throw new BaseException("素材文件不能为空");
        }
        fileService.downloadByFileId(fileId, response);
    }
}
