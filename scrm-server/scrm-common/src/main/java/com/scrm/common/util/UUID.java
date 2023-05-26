package com.scrm.common.util;

/**
 * @Author: xxh
 * @Date: 2021/12/16 22:11
 */
public class UUID {

    public static synchronized String get32UUID() {
        String uuid = java.util.UUID.randomUUID().toString();
        return uuid.replace("-", "");
    }

    public static synchronized String get16UUID() {
        int hashCodeV = get32UUID().hashCode();
        if(hashCodeV < 0) {//有可能是负数
            hashCodeV = - hashCodeV;
        }
        // 0 代表前面补充0
        // 4 代表长度为4
        // d 代表参数为正数型
        return CharacterUtils.getRandomString(6) + String.format("%010d", hashCodeV);
    }

}
