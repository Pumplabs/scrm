package com.scrm.server.wx.cp.utils;

import lombok.Data;

/**
 * @author ouyang
 * @description
 * @date 2022/7/7 14:54
 */
@Data
public class ValueChange {
    private String oldValue;

    private String newValue;

    public ValueChange() {
    }

    public ValueChange(String oldValue, String newValue) {
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
}
