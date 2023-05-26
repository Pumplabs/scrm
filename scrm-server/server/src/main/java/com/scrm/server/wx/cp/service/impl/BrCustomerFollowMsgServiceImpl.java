package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.server.wx.cp.dto.BrCustomerFollowMsgPageDTO;
import com.scrm.server.wx.cp.entity.BrCustomerFollowMsg;
import com.scrm.server.wx.cp.mapper.BrCustomerFollowMsgMapper;
import com.scrm.server.wx.cp.service.IBrCustomerFollowMsgService;
import com.scrm.server.wx.cp.service.IBrCustomerFollowReplyService;
import com.scrm.server.wx.cp.service.IBrCustomerFollowService;
import com.scrm.server.wx.cp.vo.BrCustomerFollowMsgVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 客户跟进的消息 服务实现类
 * @author xxh
 * @since 2022-05-19
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrCustomerFollowMsgServiceImpl extends ServiceImpl<BrCustomerFollowMsgMapper, BrCustomerFollowMsg> implements IBrCustomerFollowMsgService {

    @Autowired
    private IBrCustomerFollowService followService;

    @Autowired
    private IBrCustomerFollowReplyService replyService;

    @Override
    public IPage<BrCustomerFollowMsgVO> pageList(BrCustomerFollowMsgPageDTO dto){
        LambdaQueryWrapper<BrCustomerFollowMsg> wrapper = new QueryWrapper<BrCustomerFollowMsg>()
        .lambda().eq(BrCustomerFollowMsg::getExtCorpId, dto.getExtCorpId())
                .eq(BrCustomerFollowMsg::getExtStaffId, JwtUtil.getExtUserId())
                .eq(BrCustomerFollowMsg::getHasReply, dto.getHasReply())
                .orderByDesc(BrCustomerFollowMsg::getCreatedAt);
        IPage<BrCustomerFollowMsg> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()),wrapper);
        return page.convert(this::translation);
    }

    @Override
    public BrCustomerFollowMsgVO findById(String id){
        return translation(checkExists(id));
    }

    /**
     * 翻译
     * @param brCustomerFollowMsg 实体
     * @return BrCustomerFollowMsgVO 结果集
     * @author xxh
     * @date 2022-05-19
     */
    private BrCustomerFollowMsgVO translation(BrCustomerFollowMsg brCustomerFollowMsg){
        BrCustomerFollowMsgVO vo = new BrCustomerFollowMsgVO();
        BeanUtils.copyProperties(brCustomerFollowMsg, vo);

        vo.setBrCustomerFollow(followService.findById(vo.getFollowId()));
        if (vo.getHasReply()) {
            vo.setBrCustomerFollowReply(replyService.findById(vo.getReplyId()));
        }
        return vo;
    }


    @Override
    public BrCustomerFollowMsg checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrCustomerFollowMsg byId = getById(id);
        if (byId == null) {
            throw new BaseException("客户跟进的消息不存在");
        }
        return byId;
    }

    @Override
    public void readMsg(String extCorpId, String id) {
        BrCustomerFollowMsg followMsg = checkExists(id);
        if (followMsg.getExtStaffId().equals(JwtUtil.getExtUserId())) {
            throw new BaseException("你读别人的消息干嘛");
        }
        followMsg.setHasRead(true);
        updateById(followMsg);
    }

    @Override
    public void readMsgByFollow(String extCorpId, String followId) {

        update(new UpdateWrapper<BrCustomerFollowMsg>().lambda()
                .eq(BrCustomerFollowMsg::getExtCorpId, extCorpId)
                .eq(BrCustomerFollowMsg::getFollowId, followId)
                .eq(BrCustomerFollowMsg::getExtStaffId, JwtUtil.getExtUserId())
                .set(BrCustomerFollowMsg::getHasRead, true));

    }
}
