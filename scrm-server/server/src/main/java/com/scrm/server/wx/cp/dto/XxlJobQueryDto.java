package com.scrm.server.wx.cp.dto;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author ouyang
 * @description
 * @date 2022/5/25 11:54
 */
@Data
@Accessors(chain = true)
public class XxlJobQueryDto {

    private List<Integer> ids;

    private String scheduleConf;

    private Integer triggerStatus;

    private String idstr;

    public static final Integer STATUS_DISABLE = 0;

    public static final Integer STATUS_ENABLE = 1;

}
