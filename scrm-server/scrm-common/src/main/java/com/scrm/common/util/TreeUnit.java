package com.scrm.common.util;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.function.BiConsumer;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;

/**
 * 树形工具
 */
public class TreeUnit<T> {

    /**
     * 原始数据
     */
    private List<T> original;

    /**
     * 当前层级字段
     */
    private Function<T, ?> thisColumn;

    /**
     * 上级字段
     */
    private Function<T, ?> superColumn;

    /**
     * 下级数据保存字段
     */
    private BiConsumer<T, List<T>> childrenColumn;

    /**
     * 解除关联（实体对象新建方法）
     */
    private Supplier<T> newMethod;

    private TreeUnit() {
    }

    /**
     * 获取树形工具
     *
     * @param original       原始数据集合
     * @param thisColumn     本级关联字段
     * @param superColumn    上级关联字段
     * @param childrenColumn 下级数据保存字段
     * @return 树形工具
     */
    public static <T> TreeUnit<T> getInstance(List<T> original,
                                              Function<T, ?> thisColumn,
                                              Function<T, ?> superColumn,
                                              BiConsumer<T, List<T>> childrenColumn) {
        TreeUnit<T> treeUnit = new TreeUnit<>();
        treeUnit.original = original;
        treeUnit.thisColumn = thisColumn;
        treeUnit.superColumn = superColumn;
        treeUnit.childrenColumn = childrenColumn;
        return treeUnit;
    }

    /**
     * 获取树形工具
     *
     * @param original       原始数据集合
     * @param thisColumn     本级关联字段
     * @param superColumn    上级关联字段
     * @param childrenColumn 下级数据保存字段
     * @return 树形工具
     */
    public static <T> TreeUnit<T> getInstance(List<T> original,
                                              Function<T, ?> thisColumn,
                                              Function<T, ?> superColumn,
                                              BiConsumer<T, List<T>> childrenColumn,
                                              Supplier<T> newMethod) {
        TreeUnit<T> treeUnit = getInstance(original, thisColumn, superColumn, childrenColumn);
        treeUnit.newMethod = newMethod;
        return treeUnit;
    }

    public List<T> down(Object data) {
        // 定义返回数据
        List<T> resultList = new ArrayList<>();
        // 获取下级数据
        List<T> sunList = original.stream().filter(o -> Objects.deepEquals(data, superColumn.apply(o))).collect(Collectors.toList());
        // 遍历下级数据
        for (T t : sunList) {
            // 是否解除关联
            T copyT = newMethod == null ? t : BeanUnit.copy(t, newMethod.get());
            // 递归下级的子集
            List<T> ts = down(thisColumn.apply(copyT));
            if (!ts.isEmpty()) {
                childrenColumn.accept(copyT, ts);
            }
            // 添加下级数据
            resultList.add(copyT);
        }
        return resultList;
    }

    public T up(Object data) {
        T bean = original.stream().filter(o -> Objects.deepEquals(data, thisColumn.apply(o))).findFirst().orElse(null);
        return getSuperBean(bean);
    }

    public T all(Object data) {
        // 获取下级数据
        List<T> ts = down(data);
        // 获取本级数据
        T bean = original.stream().filter(o -> Objects.deepEquals(data, thisColumn.apply(o))).findFirst().orElse(null);
        if (ts != null && !ts.isEmpty()) {
            // 将下级数据填充到本级数据
            childrenColumn.accept(bean, ts);
        }
        return getSuperBean(bean);
    }


    private T getSuperBean(T bean) {
        while (bean != null) {
            // 查询匹配对象的上级数据
            Object superId = superColumn.apply(bean);
            T superBean = original.stream().filter(o -> Objects.deepEquals(superId, thisColumn.apply(o))).findFirst().orElse(null);
            // 如果没有上级，直接返回
            if (superBean == null) {
                return bean;
            }
            // 如果有下级
            else {
                // 将返回数据存入上级中
                List<T> children = new ArrayList<>();
                children.add(bean);
                childrenColumn.accept(superBean, children);
                // 继续查询上级的上级
                bean = superBean;
            }
        }
        return null;
    }

}

