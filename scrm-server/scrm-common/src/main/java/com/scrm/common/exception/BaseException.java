package com.scrm.common.exception;

import com.scrm.common.constant.IResultCode;
import com.scrm.common.constant.ResultCode;
import me.chanjar.weixin.common.error.WxError;
import org.apache.commons.lang3.StringUtils;

/**
 * @Author: xxh
 * @Date: 2021/12/11 23:12
 */
public class BaseException extends RuntimeException{

    /**
     * 状态码
     */
    private Integer code;

    public BaseException(String message) {
        super(message);
        this.code = ResultCode.FAILURE.getCode();
    }

    public BaseException(String format, Object... args) {
        super(String.format(format, args));
        this.code = ResultCode.FAILURE.getCode();
    }

    public BaseException(Integer code ,String message) {
        super(message);
        this.code = code;
    }

    public BaseException(IResultCode resultCode) {
        super(resultCode.getMsg());
        this.code = resultCode.getCode();
    }

    public static synchronized BaseException buildBaseException(WxError wxError, String message){

        return new BaseException(getErrorMsgByCode(wxError.getErrorCode(), message));

    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public Integer getCode() {
        return code;
    }

    public static String getErrorMsgByCode(Integer code, String defaultMsg){
        String wxErrorMsg = WxErrorEnum.findMsgByCode(code);
        wxErrorMsg = StringUtils.isBlank(wxErrorMsg) ? ErrorMsgEnum.findMsgByCode(code) : wxErrorMsg;
        return StringUtils.isNotBlank(wxErrorMsg) ? wxErrorMsg : defaultMsg;
    }
}
