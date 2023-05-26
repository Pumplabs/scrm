package com.scrm.common.exception;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/1 15:56
 * @description：系统的特殊异常code，不能用500
 **/
public class CommonExceptionCode {

    public static final Integer STAFF_NO_REGISTER = 111401;

    //订阅版本已过期
    public static final Integer VERSION_OVER_DUE = 111402;

    //用户没有配置席位
    public static final Integer STAFF_NO_SEAT = 111403;

    //用户没有可见范围
    public static final Integer STAFF_NO_SEE = 111405;

    //用户不是管理员
    public static final Integer STAFF_NO_ADMIN = 111406;

}
