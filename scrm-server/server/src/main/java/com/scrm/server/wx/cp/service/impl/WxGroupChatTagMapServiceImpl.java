package com.scrm.server.wx.cp.service.impl;

import lombok.extern.slf4j.Slf4j;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.WxGroupChatTagMap;
import com.scrm.server.wx.cp.mapper.WxGroupChatTagMapMapper;
import com.scrm.server.wx.cp.service.IWxGroupChatTagMapService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 客户群聊-标签关联 服务实现类
 * @author xxh
 * @since 2022-02-22
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxGroupChatTagMapServiceImpl extends ServiceImpl<WxGroupChatTagMapMapper, WxGroupChatTagMap> implements IWxGroupChatTagMapService {


}
