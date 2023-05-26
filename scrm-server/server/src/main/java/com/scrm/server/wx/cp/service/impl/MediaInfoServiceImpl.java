package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.MediaInfoPageDTO;
import com.scrm.api.wx.cp.dto.MediaInfoSaveDTO;
import com.scrm.api.wx.cp.dto.MediaInfoUpdateDTO;
import com.scrm.api.wx.cp.entity.MediaInfo;
import com.scrm.api.wx.cp.entity.WxDynamicMedia;
import com.scrm.api.wx.cp.entity.WxTempFile;
import com.scrm.api.wx.cp.enums.MediaTypeEnum;
import com.scrm.api.wx.cp.vo.MediaInfoVO;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.constant.Constants;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.entity.BrMediaCount;
import com.scrm.server.wx.cp.mapper.MediaInfoMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.utils.COSUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 素材管理 服务实现类
 * @author xxh
 * @since 2022-03-14
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class MediaInfoServiceImpl extends ServiceImpl<MediaInfoMapper, MediaInfo> implements IMediaInfoService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IWxTempFileService fileService;

    @Autowired
    private IWxTagService wxTagService;

    @Autowired
    private IMediaTagService mediaTagService;

    @Autowired
    private IBrMediaCountService mediaCountService;

    @Autowired
    private IWxDynamicMediaService dynamicMediaService;
    
    @Autowired
    private COSUtils cosUtils;

    @Override
    public IPage<MediaInfoVO> pageList(MediaInfoPageDTO dto){

        //查询条件
        LambdaQueryWrapper<MediaInfo> wrapper = new QueryWrapper<MediaInfo>().lambda()
                .eq(MediaInfo::getExtCorpId, dto.getExtCorpId())
                .eq(dto.getType() != null, MediaInfo::getType, dto.getType())
                .like(StringUtils.isNotBlank(dto.getTitle()), MediaInfo::getTitle, dto.getTitle())
                .eq(MediaInfo::getHasUpdate, false)
                .in(ListUtils.isNotEmpty(dto.getTypeList()), MediaInfo::getType, dto.getTypeList())
                .and(ListUtils.isNotEmpty(dto.getTagList()), wq -> {
                    for (int i = 0; i < dto.getTagList().size(); i++) {

                        wq.apply(String.format(
                                " JSON_CONTAINS(media_tag_list, '\"%s\"') ", dto.getTagList().get(i))
                        );
                        if (i != dto.getTagList().size() - 1) {
                            wq.or();
                        }
                    }
                })
                .orderByDesc(MediaInfo::getCreatedAt);

        //分页查询
        IPage<MediaInfo> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()),wrapper);
        return page.convert(this::translation);
    }

    @Override
    public MediaInfoVO findById(String id){
        return translation(checkExists(id));
    }


    @Override
    public MediaInfo save(MediaInfoSaveDTO dto){

        //封装数据
        MediaInfo mediaInfo = new MediaInfo();
        BeanUtils.copyProperties(dto,mediaInfo);
        mediaInfo.setId(UUID.get32UUID())
                .setCreatorExtId(JwtUtil.getExtUserId())
                .setCreatedAt(new Date())
                .setUpdatedAt(new Date());

        checkData(mediaInfo);

        //视频抽帧
        if (MediaTypeEnum.VIDEO.getCode().equals(mediaInfo.getType())) {
            WxTempFile wxTempFile = fileService.checkExists(dto.getFileId());
            //截图文件路径
            String snapshotPath = "snapshot/" + wxTempFile.getFilePath() + ".jpg";
            //拿文件名
            String[] snapshotPathSplit = snapshotPath.split("/");
            String snapshotFileName = snapshotPathSplit[snapshotPathSplit.length - 1];
            cosUtils.snapshot(wxTempFile.getFilePath(), snapshotPath, 0);
            
            WxTempFile snapshotFile = new WxTempFile()
                    .setId(UUID.get32UUID())
                    .setFileName(snapshotFileName)
                    .setFilePath(snapshotPath)
                    .setCreatedAt(new Date())
                    .setExtCorpId(wxTempFile.getExtCorpId())
                    .setCreatorExtId(wxTempFile.getCreatorExtId())
                    .setHasUploadToWx(true)
                    .setType(Constants.TEMP_FILE_IMG);
            
            fileService.save(snapshotFile);
            //传到企微
            fileService.handleExpireFile(snapshotFile);

            mediaInfo.setVideoSnapshotFileId(snapshotFile.getId());
        }
        
        //入库
        save(mediaInfo);

        return mediaInfo;
    }

    /**
     * 数据检查
     * 1.看标题是否重名
     * 2.看类型对不对
     * @param mediaInfo
     */
    private void checkData(MediaInfo mediaInfo) {

//        1.看标题是否重名
        if (StringUtils.isNotBlank(mediaInfo.getTitle())) {

            if (count(new QueryWrapper<MediaInfo>().lambda()
                    .eq(MediaInfo::getExtCorpId, mediaInfo.getExtCorpId())
                    .ne(MediaInfo::getId, mediaInfo.getId())
                    .eq(MediaInfo::getType, mediaInfo.getType())
                    .eq(MediaInfo::getTitle, mediaInfo.getTitle())) > 0) {

                throw new BaseException("该标题已存在!");

            }

        }
        //看类型对不对
        if (MediaTypeEnum.getNameByCode(mediaInfo.getType()) == null) {
            throw new BaseException("该素材类型不存在!");
        }


    }


    @Override
    public MediaInfo update(MediaInfoUpdateDTO dto){

        //校验参数
        MediaInfo old = checkExists(dto.getId());

        //封装数据
        BeanUtils.copyProperties(dto, old);

        old.setHasUpdate(true);
        //入库,改成入一个新的
        updateById(old);

        old.setId(UUID.get32UUID()).setUpdatedAt(new Date()).setHasUpdate(false);
        save(old);
        return old;
    }



    @Override
    public void batchDelete(BatchDTO<String> dto){

        //校验参数
        List<String> fileIds = new ArrayList<>();
        dto.getIds().forEach(id -> {

            String fileId = checkExists(id).getFileId();

            if (StringUtils.isNotBlank(fileId)) {
                fileIds.add(fileId);
            }

        });

        update(new UpdateWrapper<MediaInfo>().lambda()
                .in(MediaInfo::getId, dto.getIds())
                .set(MediaInfo::getHasUpdate, true));
//        //删除
//        removeByIds(dto.getIds());
//
//        //删素材文件
//        fileService.deleteByIds(fileIds);
    }


    /**
     * 翻译
     * @param mediaInfo 实体
     * @return MediaInfoVO 结果集
     * @author xxh
     * @date 2022-03-14
     */
    private MediaInfoVO translation(MediaInfo mediaInfo){
        MediaInfoVO vo = new MediaInfoVO();
        BeanUtils.copyProperties(mediaInfo, vo);

        vo.setCreatorInfo(staffService.find(mediaInfo.getExtCorpId(), mediaInfo.getCreatorExtId()));

        //文件信息加个后缀
        if (StringUtils.isNotBlank(mediaInfo.getFileId())) {
//            WxCpConfiguration.getExtCorpIdThread().set(vo.getExtCorpId());
            vo.setMediaId(fileService.getMediaId(mediaInfo.getFileId()));
            WxTempFile tempFile = fileService.getOne(new QueryWrapper<WxTempFile>().lambda().eq(WxTempFile::getMediaId, vo.getMediaId()));
            String[] spitName = tempFile.getFileName().split("\\.");
            vo.setMediaSuf(spitName[spitName.length - 1]);
        }

        //翻译
        if (ListUtils.isNotEmpty(mediaInfo.getWxTagList())) {
            vo.setWxTagDetailList(wxTagService.listByIds(mediaInfo.getWxTagList()));
        }

        if (ListUtils.isNotEmpty(mediaInfo.getMediaTagList())) {
            vo.setMediaTagDetailList(mediaTagService.listByIds(mediaInfo.getMediaTagList()));
        }

        //访问url
        vo.setRequestUrl(ScrmConfig.getMediaInfoUrl() + "?extcorpId=" + vo.getExtCorpId() + "&materialId=" + vo.getId() + "&timestamp=" + System.currentTimeMillis());

        if (StringUtils.isNotBlank(vo.getFileId())) {
            vo.setFileSize(fileService.checkExists(vo.getFileId()).getSize());
        }

        //加上发送次数
        vo.setSendNum(mediaCountService.countSendCount(BrMediaCount.MEDIA_INFO, vo.getId()));

        //加上浏览次数
        long lookCount = dynamicMediaService.count(new QueryWrapper<WxDynamicMedia>().lambda()
                .eq(WxDynamicMedia::getExtCorpId, JwtUtil.getExtCorpId())
                .eq(WxDynamicMedia::getMediaInfoId, vo.getId()));

        vo.setLookNum((int) lookCount);
        return vo;
    }


    @Override
    public MediaInfo checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        MediaInfo byId = getById(id);
        if (byId == null) {
            throw new BaseException("素材管理不存在");
        }
        return byId;
    }
}
