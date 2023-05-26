package com.scrm.server.wx.cp.utils;

import com.alibaba.fastjson.JSON;
import com.scrm.api.wx.cp.dto.WxMsgAttachmentDTO;
import com.scrm.api.wx.cp.dto.WxMsgTextDTO;
import com.scrm.api.wx.cp.entity.WxTempFile;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.SpringUtils;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.api.wx.cp.dto.WxMsgDTO;
import com.scrm.server.wx.cp.service.IBrCorpAccreditService;
import com.scrm.server.wx.cp.service.IWxTempFileService;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.api.WxConsts;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpMessageService;
import me.chanjar.weixin.cp.api.impl.WxCpMessageServiceImpl;
import me.chanjar.weixin.cp.bean.external.msg.*;
import me.chanjar.weixin.cp.bean.message.WxCpMessage;
import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/16 19:39
 * @description：微信应用消息工具类
 **/
@Slf4j
public class WxMsgUtils {

    /**
     * 发送应用消息
     *
     * @param content
     * @param extStaffIds
     */
    public static synchronized void sendMessage(String extCorpId, String content, Collection<String> extStaffIds) {

        if (ListUtils.isEmpty(extStaffIds)) {
            return;
        }

        IBrCorpAccreditService accreditService = SpringUtils.getBeanNew(IBrCorpAccreditService.class);

        WxCpConfiguration wxCpConfiguration = SpringUtils.getBeanNew(WxCpConfiguration.class);

        WxCpMessageService wxCpMessageService = new WxCpMessageServiceImpl(WxCpConfiguration.getWxCpService());

        //封装数据
        WxCpMessage message = new WxCpMessage();
        message.setAgentId(ScrmConfig.getMainAgentID());
        message.setMsgType(WxConsts.KefuMsgType.TEXT);
        message.setContent(content);
        message.setToUser(StringUtils.join(extStaffIds, "|"));

        try {
            wxCpMessageService.send(message);
        } catch (WxErrorException e) {
            log.error("发送应用消息，参数=[{}], ", JSON.toJSONString(message), e);
            throw new BaseException("发送应用消息失败！");
        }
    }

    /**
     * 转成text
     *
     * @param name 用来代替变量的客户名
     * @return
     */
    public static synchronized Text changeToText(WxMsgDTO dto, String name) {
        StringBuilder content = new StringBuilder();
        dto.getText().forEach(e -> {
            if (e.getType().equals(WxMsgTextDTO.NAME)) {
                content.append(name);
            } else {
                content.append(e.getContent());
            }
        });

        Text text = new Text();
        text.setContent(content.toString());
        return text;
    }

    public static List<Attachment> changeToAttachment(WxMsgDTO dto) {
        return changeToAttachment(dto, null);
    }

    public static void packMsgDto(WxMsgDTO wxMsgDTO){

        if (ListUtils.isNotEmpty(wxMsgDTO.getMedia())) {
            
            IWxTempFileService tempFileService = SpringUtils.getBeanNew(IWxTempFileService.class);
            wxMsgDTO.getMedia().forEach(e -> {
                if (e.getFile() != null && StringUtils.isNotBlank(e.getFile().getId())) {
                    WxTempFile wxTempFile = tempFileService.checkExists(e.getFile().getId());
                    e.setFile(wxTempFile);
                }
                
            });
            
        }
        
    }

    /**
     * 转换附件
     *
     * @param dto
     * @param extStaffId   传null就可以
     * @return
     */
    public static synchronized List<Attachment> changeToAttachment(WxMsgDTO dto, String extStaffId) {

        if (ListUtils.isEmpty(dto.getMedia())) {
            return null;
        }

        IWxTempFileService fileService = SpringUtils.getBeanNew(IWxTempFileService.class);

        List<Attachment> attachments = new ArrayList<>(dto.getMedia().size());
        Attachment attachment;
        for (WxMsgAttachmentDTO media : dto.getMedia()) {
            attachment = new Attachment();
            //设置消息类型
            attachment.setMsgType(media.getType());
            //如果有附件的，把文件的mediaId先查出来
            String mediaId = null;
            if (media.getFile() != null && StringUtils.isNotBlank(media.getFile().getId())) {
                mediaId = fileService.getMediaId(media.getFile().getId());
            }
            if (media.getType().equals(WxMsgAttachmentDTO.PIC)) {

                Image image = new Image();
                image.setMediaId(mediaId);
                attachment.setImage(image);

            } else if (media.getType().equals(WxMsgAttachmentDTO.LINK)) {

                Link link = new Link();
                link.setTitle(media.getName());
                link.setDesc(media.getInfo());
                link.setUrl(media.getHref());
                link.setPicUrl(ScrmConfig.getDownloadUrl() + "?fileId=" + media.getFile().getId());
                attachment.setLink(link);

            } else if (media.getType().equals(WxMsgAttachmentDTO.MY_LINK)) {

                media.setType(WxMsgAttachmentDTO.LINK);
                Link link = new Link();
                link.setTitle(media.getName());
                link.setDesc(media.getInfo());
                link.setUrl(media.getHref() + "&&staffId=" + extStaffId);
                link.setPicUrl(ScrmConfig.getDownloadUrl() + "?fileId=" + media.getFile().getId());
                attachment.setLink(link);

            } else if (media.getType().equals(WxMsgAttachmentDTO.MINI)) {

                MiniProgram miniProgram = new MiniProgram();
                miniProgram.setTitle(media.getName());
                miniProgram.setPicMediaId(mediaId);
                miniProgram.setAppid(media.getAppId());
                miniProgram.setPage(media.getPathName());
                attachment.setMiniProgram(miniProgram);

            } else if(media.getType().equals(WxMsgAttachmentDTO.VIDEO)){

                Video video = new Video();
                video.setMediaId(mediaId);
                attachment.setVideo(video);

            } else {
                continue;
            }
            attachments.add(attachment);
        }

        return attachments;

    }

}
