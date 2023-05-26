package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.WxMsgGroupTemplateDetail;
import com.scrm.server.wx.cp.mapper.WxMsgGroupTemplateDetailMapper;
import com.scrm.server.wx.cp.service.IWxMsgGroupTemplateDetailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 客户群聊-群发消息-详情 服务实现类
 * @author xxh
 * @since 2022-03-02
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxMsgGroupTemplateDetailServiceImpl extends ServiceImpl<WxMsgGroupTemplateDetailMapper, WxMsgGroupTemplateDetail> implements IWxMsgGroupTemplateDetailService {


}
