package com.scrm.api.wx.cp.enums;


import com.scrm.common.util.ListUtils;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.apache.commons.lang3.StringUtils;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 员工接替状态
 */
@Getter
@AllArgsConstructor
public enum WxStaffTransferStatusEnum {

    TAKE_OVER(1, "接替完毕", ""),
    WAITING_TO_TAKE_OVER(2, "等待接替", ""),
    CUSTOMER_REFUSED(3, "客户拒绝", "customer_refused"),
    CUSTOMER_LIMIT_EXCEED(4, "接替成员客户达到上限", "customer_limit_exceed"),
    NO_SUCCESSION_RECORD(5, "无接替记录", "");

    private Integer value;

    private String name;

    private String code;

    public static String getName(Integer value) {
        if (value == null) {
            return null;
        }
        List<String> nameList = Arrays.stream(Optional.of(WxStaffTransferStatusEnum.values()).orElse(new WxStaffTransferStatusEnum[]{}))
                .filter(i -> Objects.equals(i.value, value))
                .map(WxStaffTransferStatusEnum::getName)
                .collect(Collectors.toList());
        return ListUtils.isNotEmpty(nameList) ? nameList.get(0) : null;
    }

    public static Integer getValue(String code) {
        if (StringUtils.isBlank(code)) {
            return null;
        }
        List<Integer> valueList = Arrays.stream(Optional.of(WxStaffTransferStatusEnum.values()).orElse(new WxStaffTransferStatusEnum[]{}))
                .filter(i -> Objects.equals(i.code, code))
                .map(WxStaffTransferStatusEnum::getValue)
                .collect(Collectors.toList());
        return ListUtils.isNotEmpty(valueList) ? valueList.get(0) : null;
    }

    @Override
    public String toString() {
        return String.valueOf(value);
    }

}
