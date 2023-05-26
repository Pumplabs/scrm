package com.scrm.api.wx.cp.client;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.common.constant.AppConstant;
import com.scrm.common.constant.R;
import com.scrm.common.log.client.ISysOperLogClientFallback;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


/**
 * @author xuxh
 * @date 2022/5/5 16:46
 */
//@FeignClient(
//        value = AppConstant.APPLICATION_WX_CP,
//        fallback = ISysOperLogClientFallback.class
//)
public interface IWxStaffClient {
    @GetMapping(value = "/api/client/staff/findById")
    R<Staff> find(@RequestParam("id") String id);
}
