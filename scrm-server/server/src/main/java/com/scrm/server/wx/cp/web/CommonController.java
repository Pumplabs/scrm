package com.scrm.server.wx.cp.web;

import com.scrm.api.wx.cp.dto.CosDownloadInfoDTO;
import com.scrm.api.wx.cp.dto.JsSignatureDTO;
import com.scrm.api.wx.cp.entity.WxTempFile;
import com.scrm.api.wx.cp.vo.WxFileDownloadVO;
import com.scrm.api.wx.cp.vo.WxFilePreviewVO;
import com.scrm.common.annotation.PassToken;
import com.scrm.common.constant.R;
import com.scrm.common.exception.BaseException;
import com.scrm.common.log.annotation.Log;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.SpringUtils;
import com.scrm.server.wx.cp.service.IJsSignatureService;
import com.scrm.server.wx.cp.service.IWxTempFileService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.io.IOException;


/**
 * @Author: xxh
 * @Date: 2021/12/19 18:08
 */
@RestController
@RequestMapping("/common")
@Api(tags = {"通用接口"})
@Valid
@Slf4j
public class CommonController {

    @Autowired
    private IWxTempFileService fileService;

    @Autowired
    private IJsSignatureService jsSignatureService;



    @PostMapping("/upload")
    @ApiOperation(value = "上传素材")
    @Log(modelName = "通用接口", operatorType = "上传素材")
    public R<WxTempFile> upload(@ApiParam(required = true, value = "上传的文件") MultipartFile file) {
        if (file == null) {
            throw new BaseException("素材文件不能为空");
        }
        return R.data(fileService.uploadImgToCosAndWx(file, JwtUtil.getExtCorpId(), JwtUtil.getExtUserId()));
    }

    @PostMapping("/uploadWithoutWx")
    @ApiOperation(value = "上传素材(不传到企微后台)")
    @Log(modelName = "通用接口", operatorType = "上传素材")
    public R<WxTempFile> uploadWithoutWx(@ApiParam(required = true, value = "上传的文件") MultipartFile file) {
        if (file == null) {
            throw new BaseException("素材文件不能为空");
        }
        return R.data(fileService.uploadWithoutWx(file, JwtUtil.getExtCorpId(), JwtUtil.getExtUserId()));
    }

    @PostMapping("/getDownloadInfo")
    @ApiOperation(value = "获取下载信息")
    @Log(modelName = "通用接口", operatorType = "获取下载信息")
    public R<CosDownloadInfoDTO> getDownloadInfo(@Valid @RequestBody WxFileDownloadVO vo) {

        return R.data(fileService.getDownloadInfo(vo));
    }

    @ApiOperation("/根据url去下载，解决前端跨域问题")
    @Log(modelName = "通用接口", operatorType = "/根据url去下载，解决前端跨域问题")
    @GetMapping("/downloadFile")
    public void downloadFile(@NotNull(message = "下载url必填") String url, HttpServletResponse response) throws IOException {
        fileService.downloadFile(url, response);
    }

    @GetMapping("/getFileNameById")
    @ApiOperation(value = "根据文件id查文件名")
    @Log(modelName = "通用接口", operatorType = "根据文件id查文件名")
    public R<String> getFileNameById(@RequestParam String fileId) {
        if (fileId == null) {
            throw new BaseException("素材文件不能为空");
        }
        WxTempFile wxTempFile = fileService.checkExists(fileId);
        return R.data(wxTempFile.getFileName());
    }

    @GetMapping("/downloadByFileId")
    @PassToken
    @ApiOperation(value = "根据文件id下载文件")
    @Log(modelName = "通用接口", operatorType = "根据文件id下载文件")
    public void downloadByFileId(@RequestParam String fileId, HttpServletResponse response) {
        if (fileId == null) {
            throw new BaseException("素材文件不能为空");
        }
        fileService.downloadByFileId(fileId, response);
    }

    @GetMapping("/recordUploadToWx")
    @ApiOperation(value = "前端把文件上传到企微后台后，记录文件信息")
    @Log(modelName = "通用接口", operatorType = "前端把文件上传到企微后台后，记录文件信息")
    public R<WxTempFile> recordUploadToWx(@RequestParam String mediaId){
        Assert.isTrue(StringUtils.isNotBlank(mediaId), "mediaId不能为空");
        return R.data(fileService.recordUploadToWx(mediaId));
    }
    
    @ApiOperation("（新）js签名")
    @Log(modelName = "通用接口", operatorType = "（新）js签名")
    @GetMapping("/newJsSignature")
    public R<JsSignatureDTO> newJsSignature(@RequestParam String url){
        Assert.isTrue(StringUtils.isNotBlank(url), "url不能为空");
        return R.data(jsSignatureService.newJsSignature(url));
    }

    @ApiOperation("（新）应用签名")
    @Log(modelName = "通用接口", operatorType = "（新）应用签名")
    @GetMapping("/newAgentSignature")
    public R<JsSignatureDTO> newAgentSignature(@RequestParam String url){
        Assert.isTrue(StringUtils.isNotBlank(url), "url不能为空");
        return R.data(jsSignatureService.newAgentSignature(url));
    }

    @ApiOperation("js签名")
    @GetMapping("/signature")
    private R<JsSignatureDTO> signature(@RequestParam String url,
                                        @RequestParam Boolean isCorp,
                                        Integer agentId,
                                        String secret){
        Assert.isTrue(StringUtils.isNotBlank(url), "url不能为空");
        Assert.isTrue(isCorp != null, "类型不能为空");
        return R.data(SpringUtils.getBeanNew(IJsSignatureService.class).jsSignature(url, isCorp, agentId, secret));
    }
    

    @GetMapping("/getPreviewInfo")
    @ApiOperation(value = "获取预览信息")
    @Log(modelName = "通用接口", operatorType = "获取预览信息")
    @PassToken
    public R<WxFilePreviewVO> getPreviewInfo(@RequestParam String id) {
        Assert.isTrue(StringUtils.isNotBlank(id), "id不能为空");
        return R.data(fileService.getPreviewInfo(id));
    }
}
