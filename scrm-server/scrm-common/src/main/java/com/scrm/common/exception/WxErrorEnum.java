package com.scrm.common.exception;

import com.scrm.common.constant.IResultCode;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/1/4 23:19
 * @description：微信错误信息的枚举
 **/
public enum WxErrorEnum implements IResultCode {

    CODE_40098(40098, "成员尚未实名认证"),

    CODE_40003(40003, "不合法的UserID"),

    CODE_40123(40123, "上传的图片格式非法"),

    CODE_50001(50001, "redirect_url未登记可信域名"),

    CODE_40029(40029, "不合法的oauth_code"),

    CODE_41016(41016, "发送图文消息，标题是必填参数"),

    CODE_40129(40129, "当前客户正在转接中"),

    CODE_84084(84084, "非跟进客户"),

    CODE_44001(44001, "亲，请您不要传空文件喔"),

    CODE_60011(60011, "指定的成员/部门/标签参数无权限"),

    CODE_41010(41010, "缺少url参数"),

    CODE_41054(41054, "该用户尚未激活"),
    
    CODE_45033(45033, "接口并发调用超过限制"),

    CODE_41063(41063, "群发消息正在被派发中，请稍后再试"),
    
    CODE_610016(610016, "企业未认证"),
    
    CODE_610004(610004, "不是客户"),

    CODE_90207(90207, "错误的小程序appId"),
    
    CODE_701008(701008, "没有互通账号");

    private final int code;
    private final String msg;

    WxErrorEnum(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    /**
     * 通过错误代码查找其中文含义.
     */
    public static String findMsgByCode(int code) {
        for (WxErrorEnum value : WxErrorEnum.values()) {
            if (value.code == code) {
                return value.msg;
            }
        }

        return null;
    }

    @Override
    public String getMsg() {
        return this.msg;
    }

    @Override
    public int getCode() {
        return this.code;
    }
}
