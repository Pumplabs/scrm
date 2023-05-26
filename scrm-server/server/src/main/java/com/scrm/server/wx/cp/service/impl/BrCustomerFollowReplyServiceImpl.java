package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.BrCustomerFollowReplyQueryDTO;
import com.scrm.server.wx.cp.dto.BrCustomerFollowReplySaveDTO;
import com.scrm.server.wx.cp.entity.BrCustomerFollow;
import com.scrm.server.wx.cp.entity.BrCustomerFollowMsg;
import com.scrm.server.wx.cp.entity.BrCustomerFollowReply;
import com.scrm.server.wx.cp.mapper.BrCustomerFollowReplyMapper;
import com.scrm.server.wx.cp.service.IBrCustomerFollowMsgService;
import com.scrm.server.wx.cp.service.IBrCustomerFollowReplyService;
import com.scrm.server.wx.cp.service.IBrCustomerFollowService;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.utils.WxMsgUtils;
import com.scrm.server.wx.cp.vo.BrCustomerFollowReplyVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 客户跟进回复表 服务实现类
 * @author xxh
 * @since 2022-05-19
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrCustomerFollowReplyServiceImpl extends ServiceImpl<BrCustomerFollowReplyMapper, BrCustomerFollowReply> implements IBrCustomerFollowReplyService {

    @Autowired
    private IBrCustomerFollowMsgService followMsgService;

    @Autowired
    private IBrCustomerFollowService followService;

    @Autowired
    private IStaffService staffService;

    @Override
    public List<BrCustomerFollowReplyVO> queryList(BrCustomerFollowReplyQueryDTO dto){
        LambdaQueryWrapper<BrCustomerFollowReply> wrapper = new QueryWrapper<BrCustomerFollowReply>()
        .lambda().eq(BrCustomerFollowReply::getExtCorpId, dto.getExtCorpId())
                .eq(BrCustomerFollowReply::getFollowId, dto.getFollowId())
                .orderByDesc(BrCustomerFollowReply::getCreatedAt);
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }

    @Override
    public BrCustomerFollowReplyVO findById(String id){
        return translation(checkExists(id));
    }


    @Override
    public BrCustomerFollowReply save(BrCustomerFollowReplySaveDTO dto){

        checkData(dto);

        //封装数据
        BrCustomerFollowReply brCustomerFollowReply = new BrCustomerFollowReply();
        BeanUtils.copyProperties(dto,brCustomerFollowReply);
        brCustomerFollowReply.setId(UUID.get32UUID())
                .setCreatorExtId(JwtUtil.getExtUserId())
                .setCreatedAt(new Date());

        //入库
        save(brCustomerFollowReply);

        //推送消息
        BrCustomerFollow brCustomerFollow = followService.checkExists(brCustomerFollowReply.getFollowId());
        List<String> shareExtStaffIds = Optional.ofNullable(brCustomerFollow.getShareExtStaffIds()).orElse(new ArrayList<>());
        //加上创建人，去掉回复的这个人
        shareExtStaffIds.add(brCustomerFollow.getCreatorExtId());
        ListUtils.remove(shareExtStaffIds, JwtUtil.getExtUserId());
        shareExtStaffIds.remove(JwtUtil.getExtUserId());
        if (ListUtils.isNotEmpty(shareExtStaffIds)) {

            shareExtStaffIds.forEach(extStaffId ->
                    saveMsg(extStaffId, brCustomerFollow, brCustomerFollowReply));
            WxMsgUtils.sendMessage(brCustomerFollow.getExtCorpId(),
                    String.format("您收到客户跟进的一条回复\n<a href=\"%s\">立即前往</a>", ScrmConfig.getFollowDetailUrl() + "/" + brCustomerFollowReply.getFollowId() + "?timestamp=" + System.currentTimeMillis()),
                    shareExtStaffIds);

        }

        return brCustomerFollowReply;
    }

    private void checkData(BrCustomerFollowReplySaveDTO dto) {
        if (!dto.getHasReplyFollow() && StringUtils.isBlank(dto.getReplyId())) {
            throw new BaseException("你回复回复但是不给我回复id，这不妥吧");
        }
    }

    private void saveMsg(String extStaffId, BrCustomerFollow brCustomerFollow, BrCustomerFollowReply brCustomerFollowReply){
        BrCustomerFollowMsg followMsg = new BrCustomerFollowMsg()
                .setId(UUID.get32UUID())
                .setHasReply(true)
                .setHasRead(false)
                .setExtStaffId(extStaffId)
                .setExtCorpId(brCustomerFollow.getExtCorpId())
                .setFollowId(brCustomerFollow.getId())
                .setReplyId(brCustomerFollowReply.getId())
                .setCreatedAt(new Date());

        followMsgService.save(followMsg);
    }

    @Override
    public void delete(String id){

        //校验参数
        BrCustomerFollowReply brCustomerFollowReply = checkExists(id);

        if (!brCustomerFollowReply.getCreatorExtId().equals(JwtUtil.getExtUserId())) {
            throw new BaseException("只能删除自己的回复！");
        }

        //递归删回复
        deleteReply(id);
//        //删除
//        removeById(id);

    }

    private void deleteReply(String id) {

        //删除回复和通知
        removeById(id);
        //删除通知
        followMsgService.remove(new QueryWrapper<BrCustomerFollowMsg>().lambda()
                .eq(BrCustomerFollowMsg::getReplyId, id));

        //看看有没有回复这条回复的回复
        List<BrCustomerFollowReply> list = list(new QueryWrapper<BrCustomerFollowReply>().lambda()
                .eq(BrCustomerFollowReply::getReplyId, id));
        if (ListUtils.isNotEmpty(list)) {
            list.forEach(e -> deleteReply(e.getId()));
        }

    }

    /**
     * 翻译
     * @param brCustomerFollowReply 实体
     * @return BrCustomerFollowReplyVO 结果集
     * @author xxh
     * @date 2022-05-19
     */
    private BrCustomerFollowReplyVO translation(BrCustomerFollowReply brCustomerFollowReply){
        BrCustomerFollowReplyVO vo = new BrCustomerFollowReplyVO();
        BeanUtils.copyProperties(brCustomerFollowReply, vo);

        if (!vo.getHasReplyFollow()) {
            vo.setBeReplyInfo(checkExists(vo.getReplyId()));
            vo.setBeReplyStaff(staffService.find(vo.getExtCorpId(), vo.getBeReplyInfo().getCreatorExtId()));
            vo.setStaff(staffService.find(vo.getExtCorpId(), vo.getCreatorExtId()));
        }
        return vo;
    }


    @Override
    public BrCustomerFollowReply checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrCustomerFollowReply byId = getById(id);
        if (byId == null) {
            throw new BaseException("客户跟进回复表不存在");
        }
        return byId;
    }
}
