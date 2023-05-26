package com.scrm.server.wx.cp.thread;

import lombok.Getter;

import java.util.concurrent.Callable;
import java.util.concurrent.FutureTask;

/**
 * 队列带排序的线程池
 * @param <V>
 */
@Getter
public class SortFutureTask<V> extends FutureTask<V> implements Comparable<SortFutureTask> {

    private Comparable comparable;

    public SortFutureTask(Callable<V> callable) {
        super(callable);
        comparable = (Comparable) callable;
    }

    public SortFutureTask(Runnable runnable, V result) {
        super(runnable, result);
        comparable = (Comparable) runnable;
    }


    @Override
    public int compareTo(SortFutureTask o) {
        return comparable.compareTo(o.getComparable());
    }
}
