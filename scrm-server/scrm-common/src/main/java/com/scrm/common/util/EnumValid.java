package com.scrm.common.util;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

/**
 * 枚举校验注解
 * @author xuxh
 * @date 2021/7/9 10:12
 */
@Target({ElementType.FIELD, ElementType.METHOD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = {EnumValidator.class})
public @interface EnumValid {

    //异常信息
    String message() default "";

    //分组
    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    //目标枚举类
    Class<?> target() default Class.class;

    //是否忽略空值
    boolean ignoreEmpty() default true;

}
