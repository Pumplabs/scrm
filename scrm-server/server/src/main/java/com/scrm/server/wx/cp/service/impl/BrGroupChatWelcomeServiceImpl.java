package com.scrm.server.wx.cp.service.impl;

import com.scrm.api.wx.cp.entity.WxGroupChat;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.dto.BrGroupChatWelcomeSaveOrUpdateDTO;
import com.scrm.server.wx.cp.entity.BrGroupChatWelcome;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.service.IWxGroupChatService;
import com.scrm.server.wx.cp.utils.WxMsgUtils;
import lombok.extern.slf4j.Slf4j;
import com.scrm.server.wx.cp.mapper.BrGroupChatWelcomeMapper;
import com.scrm.server.wx.cp.service.IBrGroupChatWelcomeService;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpExternalContactService;
import me.chanjar.weixin.cp.api.impl.WxCpExternalContactServiceImpl;
import me.chanjar.weixin.cp.bean.external.WxCpGroupWelcomeTemplateResult;
import me.chanjar.weixin.cp.bean.external.msg.Attachment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.server.wx.cp.dto.BrGroupChatWelcomePageDTO;
import com.scrm.server.wx.cp.dto.BrGroupChatWelcomeQueryDTO;
import com.scrm.server.wx.cp.vo.BrGroupChatWelcomeVO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.*;

import com.scrm.common.util.UUID;
import com.scrm.common.exception.BaseException;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import java.util.stream.Collectors;

/**
 * 入群欢迎语 服务实现类
 *
 * @author xxh
 * @since 2022-04-24
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrGroupChatWelcomeServiceImpl extends ServiceImpl<BrGroupChatWelcomeMapper, BrGroupChatWelcome> implements IBrGroupChatWelcomeService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IWxGroupChatService groupChatService;

    static String contentFormat = "入群欢迎语设置提醒\n" +
            "%tF %tT\n" +
            "%s\n" +
            "<a href=\"%s\">立即前往</a>";


    @Override
    public IPage<BrGroupChatWelcomeVO> pageList(BrGroupChatWelcomePageDTO dto) {
        LambdaQueryWrapper<BrGroupChatWelcome> wrapper = new LambdaQueryWrapper<BrGroupChatWelcome>()
                .eq(BrGroupChatWelcome::getExtCorpId, dto.getExtCorpId())
                .apply(StringUtils.isNotBlank(dto.getContent()), String.format(" `msg` -> '$.text[*].content' like '%%%s%%'", dto.getContent()))
                .orderByDesc(BrGroupChatWelcome::getUpdatedAt);
        IPage<BrGroupChatWelcome> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<BrGroupChatWelcomeVO> queryList(BrGroupChatWelcomeQueryDTO dto) {
        LambdaQueryWrapper<BrGroupChatWelcome> wrapper = new QueryWrapper<BrGroupChatWelcome>()
                .lambda().eq(BrGroupChatWelcome::getExtCorpId, dto.getExtCorpId());
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public BrGroupChatWelcomeVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public BrGroupChatWelcome saveOrUpdate(BrGroupChatWelcomeSaveOrUpdateDTO dto) {

        List<WxGroupChat> groupChats = new ArrayList<>();
        if (ListUtils.isNotEmpty(dto.getGroupChatExtIds())) {
            groupChats = groupChatService.list(new LambdaQueryWrapper<WxGroupChat>()
                    .eq(WxGroupChat::getExtCorpId, dto.getExtCorpId())
                    .in(WxGroupChat::getExtChatId, dto.getGroupChatExtIds()));
            if (ListUtils.isEmpty(dto.getGroupChatExtIds()) || dto.getGroupChatExtIds().size() != groupChats.size()) {
                throw new BaseException("所选群聊不存在");
            }
        }

        //封装数据
        BrGroupChatWelcome brGroupChatWelcome = new BrGroupChatWelcome();
        BeanUtils.copyProperties(dto, brGroupChatWelcome);
        brGroupChatWelcome.setUpdatedAt(new Date());

        //校验参数
        BrGroupChatWelcome old = checkExists(dto.getId());
        brGroupChatWelcome.setTemplateId(old.getTemplateId());

        //处理素材
        handlerMsg(brGroupChatWelcome);

        if (StringUtils.isBlank(dto.getId())) {
            brGroupChatWelcome.setId(UUID.get32UUID())
                    .setCreatedAt(new Date())
                    .setCreator(JwtUtil.getUserId());
            //新增
            save(brGroupChatWelcome);
        } else {
            brGroupChatWelcome.setId(old.getId())
                    .setCreator(old.getCreator())
                    .setCreatedAt(old.getCreatedAt())
                    .setUpdatedAt(new Date())
                    .setEditor(JwtUtil.getUserId());
            //修改
            updateById(brGroupChatWelcome);
        }

        //发送应用消息
        WxMsgDTO msg = brGroupChatWelcome.getMsg();
        List<WxMsgTextDTO> wxMsgTextDTOS = Optional.of(msg.getText().stream().filter(text -> Objects.equals(text.getType(), 2)).collect(Collectors.toList())).orElse(new ArrayList<>());
        if (Optional.ofNullable(dto.getIsNoticeOwner()).orElse(false)) {
            groupChats.forEach(groupChat -> {
                if (StringUtils.isNotBlank(groupChat.getOwner())) {
                    String url = ScrmConfig.getGroupChatWelcomeUrl() + brGroupChatWelcome.getId() + "&groupChatId=" + groupChat.getId();
                    String content = String.format(contentFormat, new Date(), new Date(), wxMsgTextDTOS.get(0).getContent(), url);
                    WxMsgUtils.sendMessage(dto.getExtCorpId(), content, Collections.singleton(groupChat.getOwner()));
                }
            });

        }

        return brGroupChatWelcome;
    }



    /**
     * 处理素材
     *
     * @param groupChatWelcome
     * @author xuxh
     * @date 2022/4/25 18:21
     */
    private void handlerMsg(BrGroupChatWelcome groupChatWelcome) {
        WxMsgDTO msg = groupChatWelcome.getMsg();
        WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
        WxCpGroupWelcomeTemplateResult templateResult = new WxCpGroupWelcomeTemplateResult();
        List<Attachment> attachments = WxMsgUtils.changeToAttachment(msg);
        if (ListUtils.isNotEmpty(attachments)) {
            BeanUtils.copyProperties(attachments.get(0), templateResult);
        }
        templateResult.setText(WxMsgUtils.changeToText(msg, "%NICKNAME%"));
        try {
            //修改素材
            if (StringUtils.isNotBlank(groupChatWelcome.getTemplateId())) {
//                templateResult.setTemplateId(groupChatWelcome.getTemplateId());
                externalContactService.editGroupWelcomeTemplate(templateResult);

            } else {
                //新增素材
                String template = externalContactService.addGroupWelcomeTemplate(templateResult);
                groupChatWelcome.setTemplateId(template);
            }
        } catch (WxErrorException e) {
            e.printStackTrace();
            log.error("调用企业微信接口新增入群欢迎语素材失败,请求参数：【{}】,异常信息：【{}】", templateResult, e);
            throw new BaseException(e.getError().getErrorCode(), e.getError().getErrorMsg());
        }

    }


    @Override
    public void delete(String id) {

        //校验参数
        BrGroupChatWelcome brGroupChatWelcome = checkExists(id);

        //删除
        removeById(id);

        //删除素材
        try {
            if (StringUtils.isNotBlank(brGroupChatWelcome.getTemplateId())) {
                WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
                externalContactService.delGroupWelcomeTemplate(brGroupChatWelcome.getTemplateId(), null);
            }
        } catch (WxErrorException e) {
            e.printStackTrace();
            throw new BaseException(e.getError().getErrorCode(), e.getError().getErrorMsg());
        }


    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {
        Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).forEach(this::delete);
    }


    /**
     * 翻译
     *
     * @param brGroupChatWelcome 实体
     * @return BrGroupChatWelcomeVO 结果集
     * @author xxh
     * @date 2022-04-23
     */
    private BrGroupChatWelcomeVO translation(BrGroupChatWelcome brGroupChatWelcome) {
        BrGroupChatWelcomeVO vo = new BrGroupChatWelcomeVO();
        BeanUtils.copyProperties(brGroupChatWelcome, vo);

        //翻译群聊
        List<String> groupChatExtIds = brGroupChatWelcome.getGroupChatExtIds();
        if (ListUtils.isNotEmpty(groupChatExtIds)) {
            vo.setGroupChatList(ListUtils.execute2List(extIds -> groupChatService.list(new LambdaQueryWrapper<WxGroupChat>()
                    .eq(WxGroupChat::getExtCorpId, brGroupChatWelcome.getExtCorpId())
                    .in(WxGroupChat::getExtChatId, extIds)
                    .orderByAsc(WxGroupChat::getName)), groupChatExtIds, 999));
        }

        vo.setCreatorStaff(staffService.find(brGroupChatWelcome.getCreator()));

        return vo;
    }


    @Override
    public BrGroupChatWelcome checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return new BrGroupChatWelcome();
        }
        BrGroupChatWelcome byId = getById(id);
        if (byId == null) {
            throw new BaseException("好友欢迎语不存在");
        }
        return byId;
    }

    @Override
    public WxMsgDTO getMxgByGroupChatExtId(String extCorpId, String groupChatExtId) {

        if (StringUtils.isBlank(groupChatExtId)) {
            return null;
        }

        List<BrGroupChatWelcome> friendWelcomes = Optional.ofNullable(list(new LambdaQueryWrapper<BrGroupChatWelcome>()
                        .eq(BrGroupChatWelcome::getExtCorpId, extCorpId)
                        .last(String.format("json_contains(group_chat_ext_ids, '\"%s\"')", groupChatExtId))))
                .orElse(new ArrayList<>())
                .stream()
                .filter(ListUtils.distinctByKey(BrGroupChatWelcome::getId))
                .sorted(Comparator.comparing(BrGroupChatWelcome::getUpdatedAt).reversed())
                .collect(Collectors.toList());

        if (ListUtils.isNotEmpty(friendWelcomes)) {
            return friendWelcomes.get(0).getMsg();
        }

        return null;
    }
}
