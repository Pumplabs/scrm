package com.scrm.common.exception;

import com.scrm.common.constant.R;
import com.scrm.common.constant.ResultCode;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintViolationException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * @Author: xxh
 * @Date: 2021/12/11 23:54
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(value = BaseException.class)
    public R<Object> handlerBaseException(BaseException ex) {
        return R.fail(ex.getCode() == null ? ResultCode.FAILURE.getCode() : ex.getCode(), ex.getMessage());
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(value = WxErrorException.class)
    public R<Object> handlerWxErrorException(WxErrorException ex) {
        log.error("", ex);
        if (Optional.ofNullable(ex.getError()).isPresent()) {
            return R.fail(ex.getError().getErrorCode(), BaseException.getErrorMsgByCode(ex.getError().getErrorCode(), ex.getError().getErrorMsg()));
        }
        return R.fail(ErrorMsgEnum.CODE_90000, BaseException.getErrorMsgByCode(ex.getError().getErrorCode(), "企微内部错误！"));
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ConstraintViolationException.class})
    public R<Object> handleConstraintException(Exception e) {
        log.error("", e);
        return R.fail(400, e.getMessage());
    }

    @ResponseBody
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({IllegalArgumentException.class})
    public R<Object> handleIllegalArgumentException(Exception e) {
        log.error("", e);
        return R.fail(400, e.getMessage());
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public R<Void> handlerNoFoundException(Exception e) {
        return R.fail(HttpStatus.NOT_FOUND.value(), "路径不存在，请检查路径是否正确");
    }

    @ExceptionHandler({Exception.class})
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public R<Map<String, String>> handleException(Exception e, HttpServletRequest request) {
        StringWriter sw = new StringWriter();
        e.printStackTrace(new PrintWriter(sw, true));
        String detailMsg = sw.toString();
        Map<String, String> dataMap = new HashMap<>();
        dataMap.put("url", request.getRequestURI());
        dataMap.put("detail", detailMsg);
        R<Map<String, String>> result = new R<>();
        result.setCode(ResultCode.FAILURE.getCode())
                .setMsg(ResultCode.FAILURE.getMsg())
                .setTraceId(R.getThreadTraceId())
                .setData(dataMap);
        log.error("发生系统异常：", e);
        return result;
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Object validExceptionHandler(MethodArgumentNotValidException e) {
        log.error(e.getMessage(), e);
        String message = e.getBindingResult().getFieldError().getDefaultMessage();
        return R.fail(message);
    }

    @ExceptionHandler({BindException.class})
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    public R<Object> handleBindException(HttpServletRequest request, BindingResult bindingResult) {
        StringBuilder errorMassage = new StringBuilder(bindingResult.getFieldErrors().size() * 16);
        for (int i = 0; i < bindingResult.getFieldErrors().size(); ++i) {
            if (i > 0) {
                errorMassage.append(",");
            }
            FieldError fieldError = bindingResult.getFieldErrors().get(i);
            errorMassage.append(fieldError.getField());
            errorMassage.append(":");
            errorMassage.append(fieldError.getDefaultMessage());
        }
        return R.fail(errorMassage.toString());
    }


}
