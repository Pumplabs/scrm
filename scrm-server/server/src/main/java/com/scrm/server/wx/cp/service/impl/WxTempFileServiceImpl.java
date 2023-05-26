package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
//import com.scrm.api.cms.client.ISysSubscribeClient;
import com.scrm.api.wx.cp.dto.CosDownloadInfoDTO;
import com.scrm.api.wx.cp.dto.CosFileTempSecretDTO;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxTempFile;
import com.scrm.api.wx.cp.vo.WxFileDownloadVO;
import com.scrm.api.wx.cp.vo.WxFilePreviewVO;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.constant.Constants;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.UUID;
import com.scrm.common.util.*;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.mapper.WxTempFileMapper;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.service.IWxTempFileService;
import com.scrm.server.wx.cp.utils.COSUtils;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.bean.result.WxMediaUploadResult;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpMediaService;
import me.chanjar.weixin.cp.api.impl.WxCpMediaServiceImpl;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.net.ssl.HttpsURLConnection;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 微信临时素材表 服务实现类
 *
 * @author xxh
 * @since 2022-01-07
 */
@Slf4j
@Service
public class WxTempFileServiceImpl extends ServiceImpl<WxTempFileMapper, WxTempFile> implements IWxTempFileService {

    @Autowired
    private COSUtils cosUtils;

    @Autowired
    private IStaffService staffService;

    @Autowired
    private WxCpConfiguration wxCpConfiguration;

//    @Autowired
//    private ISysSubscribeClient sysSubscribeClient;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public WxTempFile uploadImgToLocal(MultipartFile file, String extCorpId, String userId) {

        //获取用户信息
        Staff staff = staffService.find(extCorpId, userId);

        isImgSuf(file);

        //文件夹没有就创文件夹
        File folder = new File(ScrmConfig.getUploadPath());
        if (!folder.exists()) {
            folder.mkdirs();
        }

        //传到本地
        String newFileName = file.getOriginalFilename().replaceAll("[^.]+\\.([a-zA-Z]+)", UUID.get32UUID() + ".$1");
        File newFile = new File(ScrmConfig.getUploadPath() + newFileName);
        try {
            file.transferTo(newFile);
        } catch (IOException e) {
            log.error("文件转换失败，", e);
            throw new BaseException("文件解析失败");
        }
        //传到微信
        WxCpMediaService wxCpMediaService = new WxCpMediaServiceImpl(WxCpConfiguration.getWxCpService());
        WxMediaUploadResult uploadRes;
        try {
            uploadRes = wxCpMediaService.upload(Constants.TEMP_FILE_IMG, newFile);
        } catch (WxErrorException e) {
            log.error("文件上传到微信失败，", e);
            throw new BaseException("文件上传失败！");
        }

        //数据入库
        WxTempFile wxTempFile = new WxTempFile();
        wxTempFile.setId(UUID.get32UUID())
                .setExtCorpId(staff.getExtCorpId())
                .setFileName(file.getOriginalFilename())
                .setFilePath(newFile.getPath())
                .setType(uploadRes.getType())
                .setMediaId(uploadRes.getMediaId())
                .setWxCreatedAt(new Date(uploadRes.getCreatedAt() * 1000))
                .setCreatorExtId(userId)
                .setCreatedAt(new Date());
        save(wxTempFile);
        wxTempFile.setFilePath(wxTempFile.getFilePath().replace(ScrmConfig.getUploadPath(), Constants.UPLOAD_PREFIX));
        return wxTempFile;
    }

    @Override
    public WxTempFile uploadImgToCosAndWx(MultipartFile file, String extCorpId, String userId) {

        //获取用户信息
        Staff staff = staffService.find(extCorpId, userId);

        String fileId = UUID.get32UUID();

        //传到微信
        WxCpMediaService wxCpMediaService = new WxCpMediaServiceImpl(WxCpConfiguration.getWxCpService());
        WxMediaUploadResult uploadRes;

//        sysSubscribeClient.checkCapacity(staff.getExtCorpId(), file.getSize() + "", true);

        //cos
        String key = String.format("%s/%s/%s", userId, fileId, file.getOriginalFilename());
        //新建文件
        File localFile = new File(ScrmConfig.getUploadPath() + File.separator + file.getOriginalFilename());

        Integer fileSize = null;
        try {

            if (!localFile.exists()) {
                localFile.createNewFile();
            }
            file.transferTo(localFile);

            uploadRes = wxCpMediaService.upload(getFileTypeBySuf(file.getOriginalFilename()), localFile);

            cosUtils.upload(localFile, key);

            fileSize = Math.toIntExact(org.apache.commons.io.FileUtils.sizeOf(localFile));
        } catch (WxErrorException e) {
            log.error("文件上传到企业微信失败，", e);
            throw BaseException.buildBaseException(e.getError(), "文件上传到企业微信失败");
        } catch (RuntimeException | IOException e) {
            log.error("文件上传异常，", e);
            throw new BaseException("文件上传异常");
        } finally {
            localFile.deleteOnExit();
        }

        //数据入库
        WxTempFile wxTempFile = new WxTempFile();
        wxTempFile.setId(fileId)
                .setExtCorpId(staff.getExtCorpId())
                .setFileName(file.getOriginalFilename())
                .setFilePath(key)
                .setHasUploadToWx(true)
                .setType(uploadRes.getType())
                .setMediaId(uploadRes.getMediaId())
                .setSize(fileSize)
                .setWxCreatedAt(new Date(uploadRes.getCreatedAt() * 1000))
                .setCreatorExtId(userId)
                .setCreatedAt(new Date());
        save(wxTempFile);
        wxTempFile.setFilePath(wxTempFile.getFilePath().replace(ScrmConfig.getUploadPath(), Constants.UPLOAD_PREFIX));
        return wxTempFile;
    }

    /**
     * 根据文件名判断文件类型
     *
     * @param fileName
     */
    private String getFileTypeBySuf(String fileName) {

        List<String> imgSuf = Arrays.asList("bmp", "dib", "gif", "jfif", "jpe", "jpeg", "jpg", "png", "tif", "tiff", "ico", "JPG");
        List<String> fileSuf = Arrays.asList("doc", "docx", "ppt", "pptx", "xls", "xlsx", "pdf", "txt");
        List<String> videoSuf = Arrays.asList("wmv", "asf", "asx", "rm", "rmvb", "mp4", "3gp", "mov", "m4v", "avi", "dat", "mkv", "flv");
        List<String> voiceSuf = Arrays.asList("amr");
        String[] split = fileName.split("\\.");
        String suf = split[split.length - 1];
        if (imgSuf.contains(suf)) {
            return Constants.TEMP_FILE_IMG;
        } else if (fileSuf.contains(suf)) {
            return Constants.TEMP_FILE_FILE;
        } else if (videoSuf.contains(suf)) {
            return Constants.TEMP_FILE_VIDEO;
        } else if (voiceSuf.contains(suf)) {
            return Constants.TEMP_FILE_VOICE;
        }else {
            throw new BaseException("不支持的文件类型！");
        }
    }

    @Override
    public List<WxTempFile> getExpireFileForTask() {
        //3天前的过期，这个拿的时候也要判断下，毕竟更新有一小时的理论误差
        Calendar yesterday = Calendar.getInstance();
        yesterday.add(Calendar.DATE, -1);

        List<WxTempFile> list = list(new QueryWrapper<WxTempFile>().lambda()
                .eq(WxTempFile::getType, Constants.TEMP_FILE_IMG)
                .le(WxTempFile::getWxCreatedAt, yesterday.getTime())
                .eq(WxTempFile::getHasUploadToWx, true));
        
        //为了不让所有文件都在第一个小时重试， 分散重试压力
        Calendar theDayBeforeYesterday = Calendar.getInstance();
        theDayBeforeYesterday.add(Calendar.DATE, -2);
        int nowHour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY);
        return list.stream().filter(e -> {

            //大于两天了，也直接返回true，要重试
            if (e.getWxCreatedAt().before(theDayBeforeYesterday.getTime())) {
                return true;
            }
            
            Calendar wxCreateTime = Calendar.getInstance();
            wxCreateTime.setTime(e.getWxCreatedAt());
            int wxHour = wxCreateTime.get(Calendar.HOUR_OF_DAY);
            return wxHour % 4 == nowHour;

        }).collect(Collectors.toList());
    }
    
    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleExpireFile(WxTempFile wxTempFile) {

        File targetFile = FileUtils.createFile(ScrmConfig.getUploadPath() + File.separator + UUID.get32UUID());

        WxMediaUploadResult uploadRes;
        try {

            cosUtils.download(targetFile, wxTempFile.getFilePath());

            WxCpMediaService wxCpMediaService = new WxCpMediaServiceImpl(WxCpConfiguration.getWxCpService());

            uploadRes = wxCpMediaService.upload(getFileTypeBySuf(wxTempFile.getFileName()), targetFile);
        } catch (Exception e) {
            log.error("[{}]文件上传到微信失败,{},", JSONObject.toJSONString(wxTempFile), wxTempFile.getId(), e);
            return;
        } finally {
            targetFile.deleteOnExit();
        }

        wxTempFile.setMediaId(uploadRes.getMediaId())
                .setWxCreatedAt(new Date(uploadRes.getCreatedAt() * 1000));

        updateById(wxTempFile);
    }

    @Override
    public String getMediaId(String id) {
        return checkExists(id).getMediaId();
    }

    @Override
    public void deleteByIds(List<String> ids) {

        List<String> keys = listByIds(ids).stream()
                .map(WxTempFile::getFilePath).collect(Collectors.toList());

        removeByIds(ids);

        cosUtils.deleteFile(keys);

        //企微的让它自己过期
    }

    @Override
    public CosDownloadInfoDTO getDownloadInfo(WxFileDownloadVO vo) {

        if (ListUtils.isEmpty(vo.getIds())
                && ListUtils.isEmpty(vo.getMediaIds())) {
            throw new BaseException("请选择下载的文件");
        }

        List<WxTempFile> fileList = list(new QueryWrapper<WxTempFile>().lambda()
                .eq(WxTempFile::getExtCorpId, vo.getExtCorpId())
                .in(ListUtils.isNotEmpty(vo.getIds()), WxTempFile::getId, vo.getIds())
                .in(ListUtils.isNotEmpty(vo.getMediaIds()), WxTempFile::getMediaId, vo.getMediaIds()));

        if (ListUtils.isEmpty(fileList)) {
            throw new BaseException("下载的文件不存在");
        }

        CosFileTempSecretDTO secretDTO = cosUtils.getTempSecret(fileList.stream().map(WxTempFile::getFilePath).collect(Collectors.toList()));

        CosDownloadInfoDTO res = new CosDownloadInfoDTO();
        BeanUtils.copyProperties(secretDTO, res);
        
        fileList.forEach(e -> {
            res.getIdKeyMap().put(e.getId(), e.getFilePath());
            if (e.getMediaId() != null) {
                res.getMediaIdKeyMap().put(e.getMediaId(), e.getFilePath());
            }
        });
        return res;

    }

    @Override
    public void downloadFile(String url, HttpServletResponse response) {
        try (
                ServletOutputStream out = response.getOutputStream()
        ) {

            downloadFile(url, out);

        } catch (RuntimeException | IOException e) {
            log.error("文件下载失败,", e);
            throw new BaseException("文件下载失败");
        }
    }

    @Override
    public void downloadFile(String url, OutputStream out) throws IOException {
        HttpsUtils.getTrust();
        URL url1 = new URL(url);
        InputStream in = null;
        try {
            if (url.startsWith("https")) {
                HttpsURLConnection uc = (HttpsURLConnection) url1.openConnection();
                in = uc.getInputStream();
            } else {
                URLConnection uc = url1.openConnection();
                in = uc.getInputStream();
            }

            IOUtils.copy(in, out);

        } catch (RuntimeException e) {
            log.error("文件下载失败,", e);
            throw new BaseException("文件下载失败");
        } finally {
            if (in != null) {
                in.close();
            }
        }
    }

    @Override
    public void downloadFile(String url, File file) {
        try (
                OutputStream out = new FileOutputStream(file);
        ) {

            downloadFile(url, out);

        } catch (RuntimeException | IOException e) {
            log.error("文件下载失败,", e);
            throw new BaseException("文件下载失败");
        }
    }

    @Override
    public WxTempFile uploadWithoutWx(MultipartFile file, String extCorpId, String userId) {

        //获取用户信息
        Staff staff = staffService.find(extCorpId, userId);

        //新建文件
        File localFile = new File(ScrmConfig.getUploadPath() + File.separator + file.getOriginalFilename());

        try {

            if (!localFile.exists()) {
                localFile.createNewFile();
            }
            file.transferTo(localFile);

            return uploadToCos(localFile, userId, staff.getExtCorpId());

        } catch (RuntimeException | IOException e) {
            log.error("文件上传异常，", e);
            throw new BaseException("文件上传异常");
        } finally {
            localFile.deleteOnExit();
        }

    }

    @Override
    public WxTempFile uploadToCos(File file, String userId, String extCorpId) {

        String fileId = UUID.get32UUID();
        //cos
        String key = String.format("%s/%s/%s", userId, fileId, file.getName());

//        sysSubscribeClient.checkCapacity(extCorpId, file.length() + "", !"企微应用宝用户海报".equals(userId));

        Integer fileSize = null;

        try {

            cosUtils.upload(file, key);

            fileSize = Math.toIntExact(org.apache.commons.io.FileUtils.sizeOf(file));
        } catch (RuntimeException e) {
            log.error("文件上传异常，", e);
            throw new BaseException("文件上传异常");
        }

        //数据入库
        WxTempFile wxTempFile = new WxTempFile();
        wxTempFile.setId(fileId)
                .setExtCorpId(extCorpId)
                .setFileName(file.getName())
                .setFilePath(key)
                .setHasUploadToWx(false)
                .setSize(fileSize)
                .setCreatorExtId(userId)
                .setCreatedAt(new Date());
        save(wxTempFile);
        wxTempFile.setFilePath(wxTempFile.getFilePath().replace(ScrmConfig.getUploadPath(), Constants.UPLOAD_PREFIX));
        return wxTempFile;
    }

    @Override
    public WxTempFile checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            throw new BaseException("文件id为空");
        }
        WxTempFile wxTempFile = getById(id);

        if (wxTempFile == null) {
            throw new BaseException("文件不存在");
        }
        //让它刷新一下mediaId
        Calendar expireTime = Calendar.getInstance();
        expireTime.add(Calendar.DATE, -3);

        //过期的就重新处理下
        if (wxTempFile.getHasUploadToWx()
                && wxTempFile.getWxCreatedAt().before(expireTime.getTime())) {
            handleExpireFile(wxTempFile);
        }
        return wxTempFile;
    }

    @Override
    public void downloadByFileId(String id, HttpServletResponse response) {
        WxTempFile wxTempFile = checkExists(id);
        File file = FileUtils.createFile(ScrmConfig.getUploadPath() + File.separator + UUID.get32UUID());
        cosUtils.download(file, wxTempFile.getFilePath());
        try (
                InputStream in = new FileInputStream(file);
                OutputStream out = response.getOutputStream()
        ) {

            IOUtils.copy(in, out);

        } catch (RuntimeException | IOException e) {
            log.error("[{}]下载失败", id, e);
        } finally {
            file.deleteOnExit();
        }
    }

    @Override
    public WxFilePreviewVO getPreviewInfo(String id) {
        WxTempFile wxTempFile = checkExists(id);
        if (!Constants.TEMP_FILE_FILE.equals(wxTempFile.getType())) {
            throw new BaseException("该文件类型不支持预览");
        }

        if (ListUtils.isEmpty(wxTempFile.getPreviewPathList())) {
            List<String> previewPathList = cosUtils.getPreviewPathList(wxTempFile.getFilePath());
            wxTempFile.setPreviewPathList(previewPathList);
            updateById(wxTempFile);
        }
        CosFileTempSecretDTO secret = cosUtils.getTempSecret(Collections.singletonList("preview/" + wxTempFile.getFilePath() + "/*"));
        
        WxFilePreviewVO result = new WxFilePreviewVO();
        BeanUtils.copyProperties(secret, result);
        result.setPreviewPathList(wxTempFile.getPreviewPathList());
        return result;
    }

    @Override
    public WxTempFile recordUploadToWx(String mediaId) {
        
        String fileId = UUID.get32UUID();
        
        checkMediaExist(mediaId);
        WxCpMediaService wxCpMediaService = new WxCpMediaServiceImpl(WxCpConfiguration.getWxCpService());
        File localFile = null;
        try {
            localFile = wxCpMediaService.download(mediaId);
        } catch (WxErrorException e) {
            log.error("[{}]文件操作异常, 下载文件失败，", mediaId, e);
            throw new BaseException("文件操作异常！");
        }

        Integer fileSize = Math.toIntExact(org.apache.commons.io.FileUtils.sizeOf(localFile));
        
//        sysSubscribeClient.checkCapacity(JwtUtil.getExtCorpId(), fileSize + "", true);
        
        //cos
        String key = String.format("%s/%s/%s", JwtUtil.getExtUserId(), fileId, localFile.getName());

        WxMediaUploadResult uploadRes;
        
        try {

            if (!localFile.exists()) {
                localFile.createNewFile();
            }

            uploadRes = wxCpMediaService.upload(getFileTypeBySuf(localFile.getName()), localFile);

            cosUtils.upload(localFile, key);

        } catch (WxErrorException e) {
            log.error("文件上传到企业微信失败，", e);
            throw BaseException.buildBaseException(e.getError(), "文件上传到企业微信失败");
        } catch (RuntimeException | IOException e) {
            log.error("文件上传异常，", e);
            throw new BaseException("文件上传异常");
        } finally {
            localFile.deleteOnExit();
        }

        checkMediaExist(mediaId);
        //数据入库
        WxTempFile wxTempFile = new WxTempFile();
        wxTempFile.setId(fileId)
                .setExtCorpId(JwtUtil.getExtCorpId())
                .setFileName(localFile.getName())
                .setFilePath(key)
                .setHasUploadToWx(true)
                .setType(uploadRes.getType())
                .setMediaId(uploadRes.getMediaId())
                .setSize(fileSize)
                .setWxCreatedAt(new Date(uploadRes.getCreatedAt() * 1000))
                .setCreatorExtId(JwtUtil.getExtUserId())
                .setCreatedAt(new Date());
        save(wxTempFile);
        wxTempFile.setFilePath(wxTempFile.getFilePath().replace(ScrmConfig.getUploadPath(), Constants.UPLOAD_PREFIX));
        return wxTempFile;
    }

    /**
     * 检查mediaId是否已存在
     */
    private void checkMediaExist(String mediaId){
        if (count(new QueryWrapper<WxTempFile>().lambda()
                .eq(WxTempFile::getExtCorpId, JwtUtil.getExtCorpId())
                .eq(WxTempFile::getMediaId, mediaId)) > 0) {
            throw new BaseException("该素材id已存在！");
        }
    }

    /**
     * 判断文件是否是图片(暂时只校验后缀吧，ImageIO只适用bmp/gif/jpg/png)
     *
     * @param file
     * @return
     */
    private void isImgSuf(MultipartFile file) {

        List<String> sufList = Arrays.asList("bmp", "dib", "gif", "jfif", "jpe", "jpeg", "jpg", "png", "tif", "tiff", "ico", ".JPG");
        String filename = file.getOriginalFilename();
        String[] nameArray = filename.split("\\.");
        if (!sufList.contains(nameArray[nameArray.length - 1])) {
            throw new BaseException("不支持的文件格式：" + nameArray[nameArray.length - 1]);
        }
    }

}
