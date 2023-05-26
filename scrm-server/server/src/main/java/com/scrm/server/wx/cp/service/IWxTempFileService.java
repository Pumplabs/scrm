package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.CosDownloadInfoDTO;
import com.scrm.api.wx.cp.entity.WxTempFile;
import com.scrm.api.wx.cp.vo.WxFileDownloadVO;
import com.scrm.api.wx.cp.vo.WxFilePreviewVO;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

/**
 * 微信临时素材表 服务类
 * @author xxh
 * @since 2022-01-07
 */
public interface IWxTempFileService extends IService<WxTempFile> {


    /**
     * 上传图片到本地
     * @param file
     * @param userId
     * @return
     */
    WxTempFile uploadImgToLocal(MultipartFile file, String extCorpId, String userId);

    /**
     * 上传图片到cos
     * @param file
     * @param userId
     * @return
     */
    WxTempFile uploadImgToCosAndWx(MultipartFile file, String extCorpId, String userId);

    /**
     * 获取过期的文件(定时任务的，有特殊处理的)，给过期时间做了对4取模操作的
     * @return
     */
    List<WxTempFile> getExpireFileForTask();

    /**
     * 处理过期的图片
     */
    void handleExpireFile(WxTempFile wxTempFile);

    /**
     * 根据文件id拿mediaId（包含过期处理策略）
     * @param id
     * @return
     */
    String getMediaId(String id);

    /**
     * 根据id删除
     * @param ids
     */
    void deleteByIds(List<String> ids);

    /**
     * 获取前端下载的信息
     * @param vo
     * @return
     */
    CosDownloadInfoDTO getDownloadInfo(WxFileDownloadVO vo);

    /**
     * 根据url下载文件
     * @param url
     */
    void downloadFile(String url, HttpServletResponse response);

    /**
     * 根据url下载文件
     * @param url
     */
    void downloadFile(String url, OutputStream out) throws IOException;

    /**
     * 根据url下载文件
     * @param url
     */
    void downloadFile(String url, File file);

    /**
     * 上传素材(不传到企微后台)
     * @param file
     * @param userId
     * @return
     */
    WxTempFile uploadWithoutWx(MultipartFile file, String extCorpId, String userId);

    /**
     * 上传文件到cos
     * @param poster
     * @return
     */
    WxTempFile uploadToCos(File poster, String userId, String extCorpId);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2021-12-29
     * @param id 企业微信标签管理id
     * @return com.scrm.api.wx.cp.entity.WxTag
     */
    WxTempFile checkExists(String id);

    /**
     * 根据文件id下载文件
     * @param id
     * @param response
     */
    void downloadByFileId(String id, HttpServletResponse response);

    /**
     * 获取文件预览信息
     * @param id
     * @return
     */
    WxFilePreviewVO getPreviewInfo(String id);

    /**
     * 前端把文件上传到企微后台后，记录文件信息
     * @param mediaId
     * @return
     */
    WxTempFile recordUploadToWx(String mediaId);
}
