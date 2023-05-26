package com.scrm.api.wx.cp.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

@Getter
@AllArgsConstructor
public enum WxCustomerAddWayEnum {

    UNKNOWN_SOURCE("0", "未知来源"),
    SCAN_QR_CODE("1", "扫描二维码"),
    NUMBER("2", "搜索手机号"),
    BUSINESS_CARD_SHARING("3", "名片分享"),
    GROUP_CHAT("4", "群聊"),
    DIAL_HISTORY("5", "手机通讯录"),
    WECHAT_CONTACT("6", "微信联系人"),
    WECHAT_ADD("7", "来自微信的添加好友申请"),
    CUSTOMER_SERVICE("8", "安装第三方应用时自动添加的客服人员"),
    EMAIL("9", "搜索邮箱"),
    SHARING("201", "内部成员共享"),
    DISTRIBUTION("202", "管理员/负责人分配");

    private String value;

    private String name;

    public static String getName(String value){
        if (StringUtils.isBlank(value)) {
            return null;
        }
        StringBuilder typeName = new StringBuilder();
        for (WxCustomerAddWayEnum typeEnum : WxCustomerAddWayEnum.values()) {
            if (typeEnum.value.equals(value)) {
                typeName.append(typeEnum.name);
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
