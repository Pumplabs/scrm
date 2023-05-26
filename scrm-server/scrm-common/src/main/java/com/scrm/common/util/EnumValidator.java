package com.scrm.common.util;

import lombok.extern.slf4j.Slf4j;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;


/**
 * 枚举校验
 *
 * @author xxh
 * @date 2021/6/17 8:54
 */
@Slf4j
public class EnumValidator implements ConstraintValidator<EnumValid, Object> {

    // 枚举校验注解
    private EnumValid annotation;

    @Override
    public void initialize(EnumValid constraintAnnotation) {

        annotation = constraintAnnotation;
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext constraintValidatorContext) {
        boolean result = false;

        Class<?> cls = annotation.target();
        boolean ignoreEmpty = annotation.ignoreEmpty();

        // target为枚举，并且value有值，或者不忽视空值，才进行校验
        if (cls.isEnum() && ((value != null && !value.equals("")) || !ignoreEmpty)) {

            Object[] objects = cls.getEnumConstants();
            for (Object obj : objects) {
                String s = value + "";
                if (s.equals(obj.toString())) {
                    result = true;
                    break;
                }
            }
        } else {
            result = true;
        }
        return result;
    }

}
