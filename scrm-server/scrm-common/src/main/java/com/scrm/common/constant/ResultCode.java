package com.scrm.common.constant;

/**
 * @Author: xxh
 * @Date: 2021/12/11 23:36
 */
public enum ResultCode implements IResultCode {
    SUCCESS(0, "操作成功"),
    FAILURE(500, "系统异常"),
    FILE_SIZE_EXCEEDS_STANDARD(90000, "存储容量超标");

    final int code;
    final String msg;

    public int getCode() {
        return this.code;
    }

    public String getMsg() {
        return this.msg;
    }

    private ResultCode(final int code, final String message) {
        this.code = code;
        this.msg = message;
    }
}