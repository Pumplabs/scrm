package com.scrm.api.wx.cp.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * @author ：ouyang
 * @date ：Created in 2022/4/15
 * @description：sop触发条件
 **/
@Getter
@AllArgsConstructor
public enum SopTermEnum {

    TIME(1, "时间"),
    ADD_FRIEND(2, "添加好友"),
    CREATE_GROUP(3, "创建群聊");


    private Integer code;

    private String value;

    public static String getNameByCode(Integer code){
        for (SopTermEnum typeEnum : values()) {
            if (typeEnum.code.equals(code)) {
                return typeEnum.value;
            }
        }
        return null;
    }

}
