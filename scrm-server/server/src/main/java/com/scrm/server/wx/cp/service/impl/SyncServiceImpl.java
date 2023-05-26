package com.scrm.server.wx.cp.service.impl;

import com.scrm.common.exception.BaseException;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.thread.ExecutorList;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/6/16 15:29
 * @description：同步信息
 **/
@Service
@Slf4j
public class SyncServiceImpl implements ISyncService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IWxCustomerService customerService;

    @Autowired
    private IWxGroupChatService groupChatService;

    @Autowired
    private IBrCorpAccreditService corpAccreditService;

    @Override
    public void syncAll(String extCorpId) {

        //同步员工信息
        staffService.sync(extCorpId);
        //同步客户信息和标签信息,没客户时企微会报错，701008，所以捕捉一下
        try {
            customerService.sync(extCorpId);
        }catch (BaseException e){
            log.info("授权时同步客户出错，已忽略");
        }
        //更新redis
        corpAccreditService.getSeeStaffFromRedis(extCorpId, true);
        //同步客户群信息，这个太久了，异步同步
        ExecutorList.commonExecutorService.submit(() -> {
            try {
                groupChatService.sync(extCorpId, null);
            } catch (WxErrorException e) {
                log.info("授权时异步加载客户群数据出错，已忽略，[{}]", e.getError());
            }
        });
    }
}
