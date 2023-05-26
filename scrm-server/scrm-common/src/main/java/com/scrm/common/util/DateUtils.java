package com.scrm.common.util;

import com.scrm.common.exception.BaseException;
import lombok.extern.slf4j.Slf4j;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

/**
 * @author xuxh
 * @date 2022/2/10 19:20
 */
@Slf4j
public class DateUtils {


    /**
     * 获取前一天的时间
     *
     * @return java.util.Date
     * @author xuxh
     * @date 2022/2/10 19:21
     */
    public static Date getYesterday() throws ParseException {
        Date dNow = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(dNow);
        calendar.add(Calendar.DAY_OF_MONTH, -1);
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.parse(sdf.format(calendar.getTime()));
    }


    /**
     * 获取今天的日期
     *
     * @return java.util.Date
     * @author xuxh
     * @date 2022/2/17 14:56
     */
    public static Date getTodayDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return sdf.parse(sdf.format(new Date()));
        } catch (ParseException e) {
            log.error("获取当前日期异常:[{}]", e.getMessage());
            throw new BaseException("获取当前日期失败");
        }
    }

    /**
     * 获取今天的时分秒
     *
     * @return java.util.Date
     * @author xuxh
     * @date 2022/2/17 14:56
     */
    public static Date getTodayDateTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            return sdf.parse(sdf.format(new Date()));
        } catch (ParseException e) {
            log.error("获取当前时间异常:[{}]", e.getMessage());
            throw new BaseException("获取当前时间失败");
        }
    }

    /**
     * 获取今天的时分秒
     *
     * @return java.util.Date
     * @author xuxh
     * @date 2022/2/17 14:56
     */
    public static Date getDateTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            return sdf.parse(sdf.format(new Date()));
        } catch (ParseException e) {
            log.error("获取当前时间异常:[{}]", e.getMessage());
            throw new BaseException("获取当前时间失败");
        }
    }

    /**
     * 获取今天结束的时间
     *
     * @return java.util.Date
     * @author xuxh
     * @date 2022/2/17 14:56
     */
    public static Date getTodayEndDateTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return sdf.parse(sdf.format(new Date()));
        } catch (ParseException e) {
            log.error("获取当前时间异常:[{}]", e.getMessage());
            throw new BaseException("获取当前时间失败");
        }
    }

    /**
     * 获取明天的日期
     *
     * @return java.util.Date
     * @author xuxh
     * @date 2022/2/17 14:56
     */
    public static Date getTomorrowDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date date = new Date();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            //把日期往后增加一天.整数往后推,负数往前移动(1:表示明天、-1：表示昨天，0：表示今天)
            calendar.add(Calendar.DATE, 1);
            //这个时间就是日期往后推一天的结果
            date = calendar.getTime();
            return sdf.parse(sdf.format(date));
        } catch (ParseException e) {
            log.error("获取明天的日期异常:[{}]", e.getMessage());
            throw new BaseException("获取明天的日期失败");
        }

    }


    /**
     * 获取日期
     *
     * @param moveDay 移动天数(整数往后推,负数往前移动)
     * @return java.util.Date
     * @author xuxh
     * @date 2022/2/17 14:56
     */
    public static Date getDate(int moveDay) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Date date = new Date();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            //把日期往后增加一天.整数往后推,负数往前移动(1:表示明天、-1：表示昨天，0：表示今天)
            calendar.add(Calendar.DATE, moveDay);
            //这个时间就是日期往后推一天的结果
            date = calendar.getTime();
            String format = sdf.format(date);
            System.out.println("转换日期：" + format);
            return sdf.parse(format);
        } catch (ParseException e) {
            log.error("获取日期异常:[{}]", e.getMessage());
            throw new BaseException("获取日期失败");
        }

    }

    /**
     * 获取日期
     *
     * @param moveDay 移动天数或小时数(整数往后推,负数往前移动)
     * @return java.util.Date
     * @author xuxh
     * @date 2022/2/17 14:56
     */
    public static Date getDate(Date date, Integer moveDay, Integer moveHour) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            //把日期往后增加一天.整数往后推,负数往前移动(1:表示明天、-1：表示昨天，0：表示今天)
            if (moveDay != null) {
                calendar.add(Calendar.DATE, moveDay);
            }
            if (moveHour != null) {
                calendar.add(Calendar.HOUR_OF_DAY, moveHour);
            }
            //这个时间就是日期往后推一天的结果
            date = calendar.getTime();
            return sdf.parse(sdf.format(date));
        } catch (ParseException e) {
            log.error("获取日期异常:[{}]", e.getMessage());
            throw new BaseException("获取日期失败");
        }

    }

    /**
     * 获取日期
     *
     * @param moveDay 移动天数并拼接时刻(整数往后推,负数往前移动) time HH:mm
     * @return java.util.Date
     * @author xuxh
     * @date 2022/2/17 14:56
     */
    public static Date getDate(Date date, int moveDay, String time) {
        SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        try {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(date);
            //把日期往后增加一天.整数往后推,负数往前移动(1:表示明天、-1：表示昨天，0：表示今天)
            calendar.add(Calendar.DATE, moveDay - 1);
            //这个时间就是日期往后推一天的结果
            date = calendar.getTime();
            return sdf2.parse(sdf1.format(date) + " " + time + ":00");
        } catch (ParseException e) {
            log.error("获取日期异常:[{}]", e.getMessage());
            throw new BaseException("获取日期失败");
        }

    }

    /**
     * 判断当前时间是否在某个时间之前
     *
     * @param date 判断的标准
     * @return true是，false不是
     */
    public static boolean belongCalendarBefore(Date date) {
        Calendar contCalendar = Calendar.getInstance();
        Calendar tagCalendar = (Calendar) contCalendar.clone();
        tagCalendar.setTime(date);

        return contCalendar.before(tagCalendar);
    }

    /***
     * 日期转cron表达式
     * @param date  : 时间点
     * @return
     */
    public static String getCron(Date date) {
        String dateFormat = "ss mm HH dd MM ? yyyy";
        SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
        String formatTimeStr = null;
        if (date != null) {
            formatTimeStr = sdf.format(date);
        }
        return formatTimeStr;
    }


    /**
     * 日期转换成字符串
     *
     * @param date 要转换成字符串的日期
     * @return 按'yyyy-MM-dd'的格式返回字符串格式
     */
    public static String dateToStr(Date date) {
        SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String str = null;
        try {
            str = sf.format(date);
        } catch (Exception e) {
            log.error("日期转字符串失败");
        }
        return str;
    }

    /**
     * 日期转换成字符串(不带时分秒)
     *
     * @param date 要转换成字符串的日期
     * @return 按'yyyy-MM-dd'的格式返回字符串格式
     */
    public static String dateToSimpleStr(Date date) {
        SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd");
        String str = null;
        try {
            str = sf.format(date);
        } catch (Exception e) {
            log.error("日期转字符串失败");
        }
        return str;
    }

    /**
     * 日期转换成字符串(带时分秒)
     *
     * @param date 要转换成字符串的日期
     * @return 按'yyyy-MM-dd'的格式返回字符串格式
     */
    public static String dateToFullStr(Date date) {
        SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String str = null;
        try {
            str = sf.format(date);
        } catch (Exception e) {
            log.error("日期转字符串失败");
        }
        return str;
    }

    /**
     * 字符串转日期
     *
     * @param str 要转换为日期格式的字符串
     * @return 返回指定格式的日期类型
     * @throws ParseException
     */
    public static Date strToDate(String str) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        Date date = null;
        try {
            date = sdf.parse(str);
        } catch (ParseException e) {
            log.error("字符串转日期失败");
        }
        return date;
    }

    /**
     * 日期转换成时间戳
     */
    public static String dateToStamp(Date date) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String format = sdf.format(date);
        try {
            String valueOf = String.valueOf(sdf.parse(format).getTime() / 1000);
            return valueOf;
        } catch (ParseException e) {
            log.error("日期转时间戳失败");
        }
        return null;
    }

    /**
     * 拼接日期+时间
     */
    public static Date handle(Date oldDate, String newDate) {
        String newDateStr = newDate + " " + dateToStr(oldDate).split(" ")[1];
        return strToDate(newDateStr);
    }

    /**
     * 获取导出时间
     *
     * @return
     */
    public static String getExportDateStr() {
        SimpleDateFormat sdf = new SimpleDateFormat("MM-dd_HH_mm_ss");
        return sdf.format(new Date());
    }

  


    /**
     * 判断是否是今天
     *
     * @param joinTime
     * @return boolean
     * @author xuxh
     * @date 2022/6/9 14:59
     */
    public static boolean isToday(Long joinTime) {
        return getTodayDate().getTime() <= joinTime && getTomorrowDate().getTime() > joinTime;
    }


    public static Date operationDate(int field, int amount) {
        Calendar instance = Calendar.getInstance();
        instance.add(field, amount);
        return instance.getTime();
    }

    /**
     * @description 补全yyyy-MM-dd HH:mm成yyyy-MM-dd HH:mm:ss格式
     * @return
     */
    public static Date handleTime(Date date) {
        SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        String str = null;
        try {
            str = sf.format(date);
        } catch (Exception e) {
            log.error("日期转字符串失败");
        }

        return strToDate(str + ":00");
    }

    /**
     * @description 判断两个日期是否相同
     * @param
     * @return
     */
    public static Boolean isSameTime(Date date1, Date date2) {
        String str1 = dateToFullStr(date1);
        String str2 = dateToFullStr(date2);

        return str1.equals(str2);
    }
}
