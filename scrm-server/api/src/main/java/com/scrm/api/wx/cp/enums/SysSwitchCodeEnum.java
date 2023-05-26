package com.scrm.api.wx.cp.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

@Getter
@AllArgsConstructor
public enum SysSwitchCodeEnum {

    NOTIFY_EMPLOYEES("0", "当客户删除员工时，通知被删除员工"),
    NOTIFY_ADMIN("1", "当员工删除客户时，通知管理员");

    private String value;

    private String name;

    public static String getName(String value){
        if (StringUtils.isBlank(value)) {
            return null;
        }
        StringBuilder typeName = new StringBuilder();
        for (SysSwitchCodeEnum codeEnum : SysSwitchCodeEnum.values()) {
            if (codeEnum.value.equals(value)) {
                typeName.append(codeEnum.name);
                break;
            }
        }
        return typeName.toString();
    }

    @Override
    public String toString() {
        return String.valueOf(value);
    }
}
