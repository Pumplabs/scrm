package com.scrm.server.wx.cp.utils;

import com.scrm.common.util.DateUtils;
import lombok.extern.slf4j.Slf4j;

import java.util.Calendar;
import java.util.Date;

/**
 * 生成Cron表达式工具类：目前支持三种常用的cron表达式
 * 1.每天的某个时间点执行      例:12 12 12 * * ?表示每天12时12分12秒执行
 * 2.每周的哪几天执行         例:12 12 12 ? * 1,2,3表示每周的周1周2周3 ,12时12分12秒执行
 * 3.每月的哪几天执行         例:12 12 12 1,21,13 * ?表示每月的1号21号13号 12时12分12秒执行
 *
 */
@Slf4j
public class CronUtil {

    //重复周期,1:每日 2:每周 3:每两周 4:每月 5:永不 6:自定义
    public static final Integer PERIOD_DAY = 1;
    public static final Integer PERIOD_WEEK = 2;
    public static final Integer PERIOD_TWO_WEEK = 3;
    public static final Integer PERIOD_MONTH = 4;
    public static final Integer PERIOD_NEVER = 5;
    public static final Integer PERIOD_CUSTOM = 6;


    /**
     * 方法摘要：构建Cron表达式
     * @return String
     */
    public static String createCronExpression(Date date,Integer period,Integer customDay) {
        //不重复
        if (PERIOD_NEVER.equals(period)){
            return DateUtils.getCron(date);
        }

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);

        StringBuffer cronExp = new StringBuffer("");
        // 秒
        cronExp.append(0).append(" ");
        // 分
        cronExp.append(calendar.get(Calendar.MINUTE)).append(" ");
        // 小时
        cronExp.append(calendar.get(Calendar.HOUR_OF_DAY)).append(" ");

        // 每天
        if (PERIOD_DAY.equals(period)) {
            // 日
            cronExp.append("* ")
                    // 月
                    .append("* ")
                    // 周
                    .append("?");
        }
        // 按每周
        else if (PERIOD_WEEK.equals(period)) {
            // 一个月中第几天
            cronExp.append("? ")
            // 月份
            .append("* ");
            // 周
            cronExp.append(calendar.get(Calendar.DAY_OF_WEEK));

        }
        // 按每月
        else if (PERIOD_MONTH.equals(period)) {

            cronExp.append(calendar.get(Calendar.DAY_OF_MONTH));
            // 月份
            cronExp.append(" * ")
            // 周
            .append("?");
        }

        // 按每两周
        else if (PERIOD_TWO_WEEK.equals(period)) {
            // 日
            cronExp.append("1/14 ")
                    // 月
                    .append("* ")
                    // 周
                    .append("?");
        }
        // 自定义
        else if (PERIOD_CUSTOM.equals(period)) {
            // 日
            cronExp.append("1/")
                    .append(customDay+" ")
                    // 月
                    .append("* ")
                    // 周
                    .append("?");
        }

        return cronExp.toString();
    }

   
}