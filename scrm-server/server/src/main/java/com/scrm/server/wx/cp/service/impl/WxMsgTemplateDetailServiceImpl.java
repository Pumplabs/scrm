package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.WxMsgTemplateDetail;
import com.scrm.server.wx.cp.mapper.WxMsgTemplateDetailMapper;
import com.scrm.server.wx.cp.service.IWxMsgTemplateDetailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 客户群发，员工与客户关联表 服务实现类
 * @author xxh
 * @since 2022-02-12
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxMsgTemplateDetailServiceImpl extends ServiceImpl<WxMsgTemplateDetailMapper, WxMsgTemplateDetail> implements IWxMsgTemplateDetailService {

}
