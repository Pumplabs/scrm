package com.scrm.common.util;


import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;

/**
 * 实体工具类
 */
public class BeanUnit {

    /**
     * 将map转成对象
     *
     * @param map      map
     * @param supplier 对象获取方法
     * @return 对象
     */
    public static <T> T mapToBean(Map<String, Object> map, Supplier<T> supplier) {
        if (supplier == null) {
            return null;
        }
        return beanSetMapValue(supplier.get(), map);
    }

    /**
     * 将map转成对象
     *
     * @param map   map
     * @param clazz 转换后的对象类型
     * @return 对象
     */
    public static <T> T mapToBean(Map<String, Object> map, Class<T> clazz) {
        if (clazz == null) {
            return null;
        }
        return beanSetMapValue(newInstance(clazz), map);
    }

    /**
     * 将对象转换成map
     *
     * @param data 数据
     * @return 转换好的map
     */
    public static Map<String, Object> beanToMap(Object data) {
        Map<String, Object> resultMap = new HashMap<>();
        if (data == null) {
            return resultMap;
        }
        Field[] fields = data.getClass().getDeclaredFields();
        for (Field field : fields) {
            Object value = get(field, data);
            resultMap.put(field.getName(), value);
        }
        return resultMap;
    }

    /**
     * 将map中的数据塞入对象中
     *
     * @param bean 对象
     * @param map  map
     * @return 存放后的对象 / map
     */
    public static <T> T beanSetMapValue(T bean, Map<String, Object> map) {
        if (bean == null) {
            return null;
        }
        if (map == null || map.size() == 0) {
            return bean;
        }
        Field[] fields = bean.getClass().getDeclaredFields();
        for (Field field : fields) {
            String fieldName = field.getName();
            Object value = map.get(fieldName);
            if (value != null) {
                set(field, bean, value);
            }
        }
        return bean;
    }

    /**
     * 对象复制
     *
     * @param source 数据源对象
     * @param target 目标对象
     * @return 目标对象 / null
     */
    public static <T> T copy(Object source, T target) {
        if (source == null || target == null) {
            return target;
        }
        Map<String, Object> sourceMap = beanToMap(source);
        return beanSetMapValue(target, sourceMap);
    }

    public static <T> T newInstance(Class<T> clazz) {
        if (clazz == null) {
            return null;
        }
        try {
            return clazz.newInstance();
        } catch (IllegalAccessException | InstantiationException e) {
            return null;
        }
    }

    /**
     * 赋值数据
     *
     * @param field 数据提供者-字段
     * @param data  数据提供者-对象
     * @param value 数据
     */
    public static void set(Field field, Object data, Object value) {
        try {
            field.setAccessible(true);
            field.set(data, replaceType(value, field.getType()));
        } catch (IllegalAccessException ignored) {
        }
    }

    /**
     * 获取字段数据
     *
     * @param field 数据提供者-字段
     * @param data  数据提供者-对象
     * @return 数据
     */
    public static Object get(Field field, Object data) {
        try {
            field.setAccessible(true);
            return field.get(data);
        } catch (IllegalAccessException e) {
            return null;
        }
    }

    /**
     * 类型转换
     *
     * @param data  原始数据
     * @param clazz 转换后的类型
     * @return 转换后的数据
     */
    public static Object replaceType(Object data, Class<?> clazz) throws ClassCastException {
        if (clazz == null) {
            return data;
        }
        if (clazz == String.class) {
            return data == null ? null : String.valueOf(data);
        }
        if (clazz == int.class) {
            return data == null ? 0 : Integer.parseInt(data.toString());
        }
        if (clazz == Integer.class) {
            return data == null ? null : Integer.valueOf(data.toString());
        }
        if (clazz == long.class) {
            return data == null ? 0L : Long.parseLong(data.toString());
        }
        if (clazz == Long.class) {
            return data == null ? null : Long.valueOf(data.toString());
        }
        if (clazz == double.class) {
            return data == null ? 0.0d : Double.parseDouble(data.toString());
        }
        if (clazz == Double.class) {
            return data == null ? null : Double.valueOf(data.toString());
        }
        if (clazz == float.class) {
            return data == null ? 0f : Float.parseFloat(data.toString());
        }
        if (clazz == Float.class) {
            return data == null ? null : Float.valueOf(data.toString());
        }
        if (clazz == byte.class) {
            return data == null ? 0 : Byte.parseByte(data.toString());
        }
        if (clazz == Byte.class) {
            return data == null ? null : Byte.valueOf(data.toString());
        }
        if (clazz == short.class) {
            return data == null ? 0 : Short.parseShort(data.toString());
        }
        if (clazz == Short.class) {
            return data == null ? null : Short.valueOf(data.toString());
        }
        if (clazz == boolean.class) {
            return data != null && Boolean.parseBoolean(data.toString());
        }
        if (clazz == Boolean.class) {
            return data == null ? null : Boolean.valueOf(data.toString());
        }
        if (clazz == char.class) {
            return data == null ? '\u0000' : data.toString().charAt(0);
        }
        if (clazz == Character.class) {
            return data == null ? null : data.toString().charAt(0);
        }
        return clazz.cast(data);
    }

}

