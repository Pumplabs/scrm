package com.scrm.common.util;

import lombok.extern.slf4j.Slf4j;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/6/27 15:36
 * @description：延时工具类
 **/
@Slf4j
public class DelayUtils {

    /**
     * 延迟多少秒
     * @param seconds
     */
    public static void delaySeconds(long seconds){
        try {
            Thread.sleep(seconds * 1000);
        } catch (InterruptedException e) {
            log.error("延迟失败...");
        }
    }

    /**
     * 延迟多少毫秒
     * @param milliseconds
     */
    public static void delayMillisecond(long milliseconds){
        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException e) {
            log.error("延迟失败...");
        }
    }
}
