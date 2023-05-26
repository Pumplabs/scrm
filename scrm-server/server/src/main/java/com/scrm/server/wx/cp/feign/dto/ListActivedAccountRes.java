package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;

import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/6/22 16:19
 * @description：查询激活账号结果
 **/
@Data
public class ListActivedAccountRes extends MpErrorCode{
    
    private String next_cursor;
    
    private Integer has_more;
    
    private List<ListActivedAccountDetailRes> account_list; 
}
