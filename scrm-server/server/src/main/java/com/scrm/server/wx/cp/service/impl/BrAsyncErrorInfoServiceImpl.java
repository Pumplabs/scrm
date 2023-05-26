package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.server.wx.cp.entity.BrAsyncErrorInfo;
import com.scrm.server.wx.cp.mapper.BrAsyncErrorInfoMapper;
import com.scrm.server.wx.cp.service.IBrAsyncErrorInfoService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 异步任务的错误信息记录 服务实现类
 * @author xxh
 * @since 2022-05-28
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrAsyncErrorInfoServiceImpl extends ServiceImpl<BrAsyncErrorInfoMapper, BrAsyncErrorInfo> implements IBrAsyncErrorInfoService {

}
