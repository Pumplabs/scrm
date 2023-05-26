package com.scrm.server.wx.cp.thread;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.PriorityBlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/28 19:37
 * @description：
 **/
public class ExecutorList {

    public static final ExecutorService tagExecutorService = new SortThreadPoolExecutor
            (1, 1,
                    0L, TimeUnit.MILLISECONDS,
                    new PriorityBlockingQueue<>());

    /**
     * 通用的
     */
    public static final ExecutorService commonExecutorService = Executors.newFixedThreadPool(2*Runtime.getRuntime().availableProcessors()+1);
}
