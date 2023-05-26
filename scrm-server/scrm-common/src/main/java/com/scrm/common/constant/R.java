package com.scrm.common.constant;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.apache.commons.lang3.StringUtils;
import org.springframework.lang.Nullable;
import org.springframework.util.ObjectUtils;

import java.io.Serializable;
import java.util.Optional;


/**
 * @author: xxh
 * @date: 2021/12/11 23:23
 */
@ApiModel(
        description = "返回信息"
)
@Accessors(chain = true)
@Data
public class R<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "状态码", required = true)
    private int code;

    @ApiModelProperty(value = "是否成功", required = true)
    private boolean success;

    @ApiModelProperty("承载数据")
    private T data;

    @ApiModelProperty(value = "返回消息", required = true)
    private String msg;


    public static boolean isSuccess(@Nullable R<?> result) {
        return Optional.ofNullable(result).map(x ->
                ObjectUtils.nullSafeEquals(ResultCode.SUCCESS.code, x.code)
        ).orElse(Boolean.FALSE);
    }

    public static boolean isNotSuccess(@Nullable R<?> result) {
        return !isSuccess(result);
    }

    public boolean getSuccess(){
        return isSuccess(this);
    }

    public static <T> R<T> data(T data) {
        return data(data, ResultCode.SUCCESS.msg);
    }

    public static <T> R<T> data(T data, String msg) {
        return data(ResultCode.SUCCESS.code, data, msg);
    }

    public static <T> R<T> data(int code, T data, String msg) {
        return new R<T>().setCode(code).setData(data).setMsg(msg);
    }

    public static <T> R<T> success() {
        return new R<T>().setCode(ResultCode.SUCCESS.code).setMsg(ResultCode.SUCCESS.msg);
    }

    public static <T> R<T> success(String msg) {
        return new R<T>().setCode(ResultCode.SUCCESS.code).setMsg(msg);
    }

    public static <T> R<T> success(IResultCode resultCode) {
        return new R<T>().setCode(resultCode.getCode()).setMsg(resultCode.getMsg());
    }

    public static <T> R<T> success(IResultCode resultCode, String msg) {
        return new R<T>().setCode(resultCode.getCode()).setMsg(msg);
    }

    public static <T> R<T> fail(String msg) {
        return new R<T>().setCode(ResultCode.FAILURE.getCode()).setMsg(msg);
    }

    public static <T> R<T> fail(int code, String msg) {
        return new R<T>().setCode(code).setMsg(StringUtils.isBlank(msg) ? ResultCode.FAILURE.getMsg() : msg);
    }

    public static <T> R<T> fail(IResultCode resultCode) {
        return new R<T>().setCode(resultCode.getCode()).setMsg(resultCode.getMsg());
    }

    public static <T> R<T> fail(IResultCode resultCode, String msg) {
        return new R<T>().setCode(ResultCode.FAILURE.getCode()).setMsg(msg);

    }


}

