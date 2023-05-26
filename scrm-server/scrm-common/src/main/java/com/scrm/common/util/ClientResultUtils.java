package com.scrm.common.util;


import com.scrm.common.constant.R;
import com.scrm.common.exception.BaseException;

/**
 * 远程调用结果工具类
 *
 * @author xuxh
 * @date 2021/7/13 20:37
 */
public class ClientResultUtils {

    /**
     * 获取Data
     *
     * @param result 结果
     * @return org.apache.poi.ss.formula.functions.T
     * @author xuxh
     * @date 2021/7/13 20:38
     */
    public static <T> T getData(R<T> result) {
        if (result.getSuccess()) {
            return result.getData();
        } else {
            throw new BaseException(result.getMsg());
        }
    }
}
