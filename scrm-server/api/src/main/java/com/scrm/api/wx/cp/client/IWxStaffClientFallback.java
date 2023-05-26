package com.scrm.api.wx.cp.client;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.common.constant.R;
import org.springframework.stereotype.Component;


@Component
public class IWxStaffClientFallback implements IWxStaffClient {

    @Override
    public R<Staff> find(String id) {
        return R.fail("远程调用获取用户信息失败");
    }
}
