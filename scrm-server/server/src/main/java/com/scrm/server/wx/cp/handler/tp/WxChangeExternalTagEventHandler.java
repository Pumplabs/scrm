package com.scrm.server.wx.cp.handler.tp;

import com.alibaba.fastjson.JSON;
import com.scrm.api.wx.cp.dto.WxCpXmlOutMessageDTO;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.constant.Constants;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.builder.TextBuilder;
import com.scrm.server.wx.cp.handler.AbstractHandler;
import com.scrm.server.wx.cp.service.IWxTagGroupService;
import com.scrm.server.wx.cp.service.IWxTagService;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.common.session.WxSessionManager;
import me.chanjar.weixin.cp.api.WxCpService;
import me.chanjar.weixin.cp.bean.message.WxCpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlOutMessage;
import me.chanjar.weixin.cp.constant.WxCpConsts;
import me.chanjar.weixin.cp.message.WxCpMessageHandler;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * @author xuxh
 * @date 2022/5/10 14:20
 */
@Slf4j
@Service(WxCpConsts.EventType.CHANGE_EXTERNAL_TAG)
public class WxChangeExternalTagEventHandler extends AbstractHandler {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private IWxTagService tagService;

    @Autowired
    private IWxTagGroupService tagGroupService;

    @Override
    public WxCpXmlOutMessage handle(WxCpXmlMessage wxMessage, Map<String, Object> map, WxCpService wxCpTpService, WxSessionManager wxSessionManager) throws WxErrorException {
        WxCpXmlOutMessageDTO dto = new WxCpXmlOutMessageDTO();
        BeanUtils.copyProperties(wxMessage, dto);
        dto.setExtCorpId(ScrmConfig.getExtCorpID());
        log.debug("客户标签相关mq发送：[{}], [{}]", wxMessage.getChangeType(), JSON.toJSONString(dto));
        rabbitTemplate.convertAndSend(WxCpConsts.EventType.CHANGE_EXTERNAL_TAG + "_" + wxMessage.getChangeType(), dto);
        try {
            String content = "感谢反馈，您的信息已收到！";
            return new TextBuilder().build(content, wxMessage, null);
        } catch (Exception e) {
            log.error("客户标签变更消息接收异常", e);
            return null;
        }
    }

    /**
     * 客户标签： 新增
     *
     * @param dto 请求参数
     * @author xuxh
     * @date 2022/5/10 14:40
     */
    @RabbitListener(queues = Constants.WX_TAG_CREATE)
    public void createCustomerTagListener(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[create],事件描述:[新增客户标签/标签组],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        try {
            /*if (StringUtils.isNotBlank(dto.getId())) {
                tagGroupService.sync(dto.getExtCorpId(), dto.getId(), dto.getTagType());
            }*/
            synchronized (this){
                tagGroupService.sync(dto.getExtCorpId());
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[create],事件描述:[新增客户标签/标签组],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "系统异常", e);
        }
    }

    /**
     * 客户标签： 修改
     *
     * @param dto 请求参数
     * @author xuxh
     * @date 2022/5/10 14:40
     */
    @RabbitListener(queues = Constants.WX_TAG_UPDATE)
    public void updateCustomerTagListener(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[update],事件描述:[修改客户标签/标签组],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        try {
           /* if (StringUtils.isNotBlank(dto.getId())) {
                tagGroupService.sync(dto.getExtCorpId(), dto.getId(), dto.getTagType());
            }*/
            synchronized (this){
                tagGroupService.sync(dto.getExtCorpId());
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[update],事件描述:[修改客户标签/标签组],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "系统异常", e);
        }
    }

    /**
     * 客户标签： 删除
     *
     * @param dto 请求参数
     * @author xuxh
     * @date 2022/5/10 14:40
     */
    @RabbitListener(queues = Constants.WX_TAG_DELETE)
    public void deleteCustomerTagListener(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[delete],事件描述:[删除客户标签/标签组],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        try {
            /*if (WxCpConsts.TageType.TAG.equals(dto.getTagType())) {
                WxTag tag = tagService.getOne(new LambdaQueryWrapper<WxTag>().eq(WxTag::getExtCorpId, dto.getExtCorpId()).eq(WxTag::getExtId, dto.getId()));
                if (tag != null) {
                    tagService.delete(tag.getId(), false);
                }
            } else if (WxCpConsts.TageType.TAG_GROUP.equals(dto.getTagType())) {
                WxTagGroup tagGroup = tagGroupService.getOne(new LambdaQueryWrapper<WxTagGroup>().eq(WxTagGroup::getExtCorpId, dto.getExtCorpId()).eq(WxTagGroup::getExtId, dto.getId()));
                if (tagGroup != null) {
                    tagGroupService.delete(tagGroup.getId(), false);
                }
            }*/
            synchronized (this){
                tagGroupService.sync(dto.getExtCorpId());
            }

        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[delete],事件描述:[删除客户标签/标签组],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "系统异常", e);
        }
    }

    /**
     * 客户标签： 重排
     *
     * @param dto 请求参数
     * @author xuxh
     * @date 2022/5/10 14:40
     */
    @RabbitListener(queues = Constants.WX_TAG_SHUFFLE)
    public void shuffleCustomerTagListener(WxCpXmlOutMessageDTO dto) {
        String str = UUID.get32UUID();
        log.info("消费MQ:[shuffle],事件描述:[重排客户标签/标签组],编号:[{}],企业ID:[{}],message[{}]", str, dto.getExtCorpId(), dto);
        try {
            //标签组的id，表示只有此标签组内的标签发生了重排，如果为空，则表示全部标签组顺序都发生了变化
            /*if (StringUtils.isBlank(dto.getId())) {
                synchronized (this){
                tagGroupService.sync(dto.getExtCorpId());
            }
            } else {
                tagGroupService.sync(dto.getExtCorpId(), dto.getId(), WxCpConsts.TageType.TAG_GROUP);
            }*/
            synchronized (this){
                tagGroupService.sync(dto.getExtCorpId());
            }
        } catch (Exception e) {
            e.printStackTrace();
            log.error("消费MQ异常:[shuffle],事件描述:[重排客户标签/标签组],编号:[{}],企业ID:[{}],message[{}],异常原因:[{}],异常描述:[{}]", str, dto.getExtCorpId(), dto, "系统异常", e);
        }
    }

}
