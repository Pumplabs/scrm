package com.scrm.common.util;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/6 0:25
 * @description：手动分页参数
 **/
public class PageUtils {

    public static<T> IPage<T> page(Integer pageNo, Integer pageSize, List<T> list){
        if (ListUtils.isEmpty(list)){
            return new Page<>();
        }
        Page<T> pageInfo = new Page<>();
        //分页
        Integer totalNum = list.size();
        //默认从零分页，这里要考虑这种情况，下面要计算。
        Integer totalPage = 0;
        if (totalNum > 0) {
            totalPage = totalNum % pageSize == 0 ? totalNum / pageSize : totalNum / pageSize + 1;
        }
        if (pageNo > totalPage) {
            pageNo = totalPage;
        }
        int startPoint = (pageNo - 1) * pageSize;
        int endPoint = startPoint + pageSize;
        if (totalNum <= endPoint) {
            endPoint = totalNum;
        }
        list = list.subList(startPoint, endPoint);
        pageInfo.setTotal(totalNum);
        pageInfo.setRecords(list);
        pageInfo.setCurrent(pageNo);
        pageInfo.setSize(pageSize);

        return pageInfo;
    }
}
