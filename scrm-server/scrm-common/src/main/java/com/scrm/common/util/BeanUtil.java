package com.scrm.common.util;

import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/1/3 1:21
 * @description：对象工具类
 **/
@Slf4j
public class BeanUtil {

    /**
     * 返回前端前做处理，不返回空字符串和空数据
     * @param obj
     */
    public static void initNUll(Object obj){
        if (obj == null) {
            return;
        }
        if (obj instanceof List) {
            ((List) obj).forEach(BeanUtil::initNUll);
        }else{

            initStrAndNull(obj, obj.getClass());

        }
    }

    private static void initStrAndNull(Object obj, Class clazz){

        for (Field field: clazz.getDeclaredFields()) {
            field.setAccessible(true);
            try {
                if (field.getGenericType().toString().equals("class java.lang.String") && field.get(obj) == null) {
                    field.set(obj, "");
                }else if (field.getGenericType().toString().contains("java.util.List")) {
                    List list = (List) field.get(obj);
                    if (ListUtils.isEmpty(list)) {
                        field.set(obj, new ArrayList<>());
                    }else{
                        list.forEach(BeanUtil::initNUll);
                    }
                }
            } catch (IllegalAccessException e) {
                log.info("属性赋值出错，", e);
                throw new RuntimeException("属性赋值出错");
            }
        }

        if (clazz.getSuperclass() != null) {
            initStrAndNull(obj, clazz.getSuperclass());
        }
    }


}
