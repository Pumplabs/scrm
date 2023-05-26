package com.scrm.api.wx.cp.enums;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BrCustomerDynamicModelEnum {

    CUSTOMER_MANAGEMENT(1, "客户管理"),
    CUSTOMER_BASE(2, "客户群"),
    CUSTOMER_STAGE(3, "客户阶段"),
    CUSTOMER_TAG(4, "客户标签"),
    TRACK_MATERIAL(5, "轨迹素材"),
    TASK_TREASURE(6, "任务宝");


    private Integer code;

    private String value;

    public static String getNameByCode(Integer code) {
        for (BrCustomerDynamicModelEnum typeEnum : values()) {
            if (typeEnum.code.equals(code)) {
                return typeEnum.value;
            }
        }
        return null;
    }
}
