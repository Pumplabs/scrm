package com.scrm.common.log.client;

import com.scrm.common.constant.R;
import com.scrm.common.dto.SysOperLogSaveDTO;
import com.scrm.common.entity.SysOperLog;
import org.springframework.stereotype.Component;

@Component
public class ISysOperLogClientFallback implements ISysOperLogClient{

    @Override
    public R<SysOperLog> save(SysOperLogSaveDTO dto) {
        return R.fail("远程调用新增系统日志失败");
    }

}
