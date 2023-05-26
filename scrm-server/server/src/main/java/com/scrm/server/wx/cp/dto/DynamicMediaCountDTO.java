package com.scrm.server.wx.cp.dto;

import lombok.Data;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/15 18:09
 * @description：客户动态统计VO
 **/
@Data
public class DynamicMediaCountDTO {

    /**
     * 轨迹素材id
     */
    private String mediaInfoId;

    /**
     * 总共看了多少次
     */
    private Integer countSum;
}
