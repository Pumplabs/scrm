package com.scrm.api.wx.cp.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

/**
 * @author ：ouyang
 * @date ：Created in 2022/4/15
 * @description：sop类型
 **/
@Getter
@AllArgsConstructor
public enum SopTypeEnum {

    CUSTOMER_SOP(1, "客户sop"),
    GROUP_SOP(2, "群sop");

    private Integer code;

    private String value;

    public static String getNameByCode(Integer code){
        for (SopTypeEnum typeEnum : values()) {
            if (typeEnum.code.equals(code)) {
                return typeEnum.value;
            }
        }
        return null;
    }

}
