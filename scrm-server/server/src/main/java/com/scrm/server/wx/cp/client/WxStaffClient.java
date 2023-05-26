package com.scrm.server.wx.cp.client;

import com.scrm.api.wx.cp.client.IWxStaffClient;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.common.constant.R;
import com.scrm.server.wx.cp.service.IStaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author xuxh
 * @date 2022/5/5 17:00
 */
@ApiIgnore
@RestController
public class WxStaffClient implements IWxStaffClient {

    @Autowired
    private IStaffService staffService;

    @Override
    @GetMapping("/client/staff/findById")
    public R<Staff> find(String id) {
        return R.data(staffService.find(id));
    }

}
