package com.scrm.api.wx.cp.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
@AllArgsConstructor
public enum WxMsgSendStatusEnum {

    STATUS_EXCEPTION(-1, "发送异常"),
    STATUS_NO_SEND(0, "未发送"),
    STATUS_SEND(1, "已发送"),
    STATUS_NO_FRIEND(2, "已不是好友"),
    STATUS_OTHER_SEND(3, "已收到其他群发消息");

    private Integer code;

    private String name;

    public static String getName(Integer code){
        if (code == null) {
            return null;
        }
        for (WxMsgSendStatusEnum statusEnum : WxMsgSendStatusEnum.values()) {

            if (statusEnum.getCode().equals(code)) {
                return statusEnum.getName();
            }

        }
        return null;
    }

    public static WxMsgSendStatusEnum getByCode(Integer code){
        if (code == null) {
            return null;
        }
        for (WxMsgSendStatusEnum statusEnum : WxMsgSendStatusEnum.values()) {

            if (statusEnum.getCode().equals(code)) {
                return statusEnum;
            }

        }
        return null;
    }

    public static final Integer STATUS_FAIL = -1;

    public static List<Integer> getFailStatusList(){

        List<Integer> failStatusList = new ArrayList<>(2);
        failStatusList.add(STATUS_NO_FRIEND.getCode());
        failStatusList.add(STATUS_OTHER_SEND.getCode());
        return failStatusList;

    }

    public static Boolean isInFailStatus(Integer status){

        return getFailStatusList().contains(status);

    }
}
