package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;
import lombok.experimental.Accessors;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/6/22 16:19
 * @description：查询激活账号参数
 **/
@Data
@Accessors(chain = true)
public class ListActivedAccountParams {
    
    private String corpid;
    
    private Integer limit;
    
    private String cursor;
}
