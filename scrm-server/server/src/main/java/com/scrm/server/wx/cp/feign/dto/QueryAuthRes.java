package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/30 21:35
 * @description：
 **/
@Data
@Accessors(chain = true)
public class QueryAuthRes extends MpErrorCode{

    private QueryAuthDetailRes authorization_info;

}
