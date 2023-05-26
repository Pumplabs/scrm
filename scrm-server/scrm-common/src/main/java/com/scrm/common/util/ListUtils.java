package com.scrm.common.util;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * @Author: xxh
 * @Date: 2021/12/17 21:39
 */
public class ListUtils {

    public static <T> boolean isEmpty(Collection<T> list) {
        return list == null || list.isEmpty();
    }

    public static <T> boolean isNotEmpty(Collection<T> list) {
        return list != null && !list.isEmpty();
    }

    /**
     * 判断两个集合的元素是否一样（解决不了1，1，2和1，2，2判断为true的问题）
     * @param list1
     * @param list2
     * @param <T>
     * @return
     */
    public static <T> boolean isSame(Collection<T> list1, Collection<T> list2){

        if (isEmpty(list1) && isEmpty(list2)) {
            return true;
        }

        if (
                (isEmpty(list1) && isNotEmpty(list2))
                        || (isEmpty(list2) && isNotEmpty(list1))
                        || list1.size() != list2.size()) {
            return false;
        }

        Map<T, T> map1 = list1.stream().collect(Collectors.toMap(Function.identity(), Function.identity()));

        Map<T, T> map2 = list2.stream().collect(Collectors.toMap(Function.identity(), Function.identity()));
        return list2.stream().allMatch(map1::containsKey)
                && list1.stream().allMatch(map2::containsKey);
    }

    public static <T> List<List<T>> subCollection(List<T> collections, int maxNum) {
        int limit = countStep(collections.size(), maxNum);
        List<List<T>> mglist = new ArrayList<>();
        Stream.iterate(0, n -> n + 1).limit(limit).forEach(i ->
                mglist.add(collections.stream().skip(i * maxNum).limit(maxNum).collect(Collectors.toList()))
        );
        return mglist;
    }

    /**
     * 计算切分次数
     *
     * @param size   需要分割的集合长度
     * @param maxNum 集合最大的数量
     * @return 切分次数
     */
    private static Integer countStep(Integer size, Integer maxNum) {
        return (size + maxNum - 1) / maxNum;
    }


    /**
     *  分批执行函数
     * @param function 函数
     * @param ids 入参
     * @param size 切片长度
     * @param <T> 返回类型
     * @param <S> 函数入参类型
     * @return 返回执行结果
     */
    public static <T, S> List<T> execute2List(Function<List<S>, List<T>> function, List<S> ids, int size) {
        List<T> list = new ArrayList<>();
        Optional.of(partition(ids, size)).orElse(new ArrayList<>()).forEach(item -> {
            List<T> apply = function.apply(item);
            if (ListUtils.isNotEmpty(apply)) {
                list.addAll(apply);
            }
        });
        return list;
    }

    public static <T> List<List<T>> partition(List<T> originalList, int len) {
        List<List<T>> answer = new ArrayList<>();
        if (ListUtils.isEmpty(originalList)) {
            return answer;
        }
        int size = originalList.size();
        int count = (size + len - 1) / len;

        for (int i = 0; i < count; ++i) {
            answer.add(originalList.subList(i * len, Math.min((i + 1) * len, size)));
        }
        return answer;
    }

    public static  <T, S>  void execute(Function<List<S>, T> function, List<S> ids, int size) {
        Optional.of(partition(ids, size)).orElse(new ArrayList<>()).forEach(function::apply);
    }

    public static <T> Predicate<T> distinctByKey(Function<? super T, Object> keyExtractor) {
        Map<Object, Boolean> seen = new ConcurrentHashMap<>();
        return t -> seen.putIfAbsent(keyExtractor.apply(t), Boolean.TRUE) == null;
    }


    public static <T> void remove(List<T> list, T item) {
        if (list.contains(item)) {
            list.remove(item);
            remove(list, item);
        }
    }
}
