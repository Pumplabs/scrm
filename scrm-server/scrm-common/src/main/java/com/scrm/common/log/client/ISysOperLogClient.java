package com.scrm.common.log.client;

import com.scrm.common.constant.R;
import com.scrm.common.dto.SysOperLogSaveDTO;
import com.scrm.common.entity.SysOperLog;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import javax.validation.Valid;

//@FeignClient(
//        value = "scrm-cms",
//        fallback = ISysOperLogClientFallback.class
//)
public interface ISysOperLogClient {

    @PostMapping(value = "/api/sysOperLog/save")
    R<SysOperLog> save(@RequestBody @Valid SysOperLogSaveDTO dto);
}
