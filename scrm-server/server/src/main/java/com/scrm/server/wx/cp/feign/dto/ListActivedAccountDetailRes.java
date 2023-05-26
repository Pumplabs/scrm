package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/6/22 16:23
 * @description：查询激活账号结果详情
 **/
@Data
public class ListActivedAccountDetailRes {
    
    private String userid;
    
    private Integer type;
    
    private Long expire_time;
    
    private Long active_time;
    
}
