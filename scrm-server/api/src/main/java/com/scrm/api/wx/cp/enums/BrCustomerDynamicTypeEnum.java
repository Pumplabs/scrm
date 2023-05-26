package com.scrm.api.wx.cp.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum BrCustomerDynamicTypeEnum {

    CUSTOMER_ADD_STAFF(1, "客户添加好友"),
    STAFF_ADD_CUSTOMER(2, "员工添加客户"),
    CUSTOMER_DELETE(3, "客户删除"),
    DELETE_CUSTOMER(4, "删除客户"),
    JOIN_GROUP_CHAT(5, "加入群聊"),
    EXIT_GROUP_CHAT(6, "退出群聊"),
    STAGE_ADD(7, "阶段添加"),
    STAGE_UPDATE(8, "阶段变化"),
    STAGE_DELETE(9, "阶段移除"),
    MARK_TAG(10, "打标签"),
    CHECK(11, "查看轨迹素材"),
    FISSION_FRIENDS(12, "参加好友裂变"),
    
    ADD_FOLLOW(13, "新增客户跟进")
    ;


    private Integer code;

    private String value;

    public static String getNameByCode(Integer code) {
        for (BrCustomerDynamicTypeEnum typeEnum : values()) {
            if (typeEnum.code.equals(code)) {
                return typeEnum.value;
            }
        }
        return null;
    }
}
