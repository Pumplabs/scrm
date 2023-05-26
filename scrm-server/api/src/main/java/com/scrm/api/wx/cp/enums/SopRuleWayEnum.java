package com.scrm.api.wx.cp.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author ouyang
 * @description
 * @date 2022/4/15 15:06
 */
@Getter
@AllArgsConstructor
public enum SopRuleWayEnum {
    REMIND(1, "仅提醒"),
    MASS(2, "群发"),
    POST(3, "发朋友圈");


    private Integer code;

    private String value;

    public static String getNameByCode(Integer code){
        for (SopRuleWayEnum typeEnum : values()) {
            if (typeEnum.code.equals(code)) {
                return typeEnum.value;
            }
        }
        return null;
    }
}
