package com.scrm.server.wx.cp.vo;

import cn.afterturn.easypoi.handler.inter.IExcelDataModel;
import cn.afterturn.easypoi.handler.inter.IExcelModel;
import lombok.Data;
 
@Data
public class ExcelVerifyInfo implements IExcelModel, IExcelDataModel {
 
    private String errorMsg;
 
    private int rowNum;
 
    @Override
    public Integer getRowNum() {
        return rowNum;
    }
 
    @Override
    public void setRowNum(Integer rowNum) {
        this.rowNum = rowNum;
    }
 
    @Override
    public String getErrorMsg() {
        return errorMsg;
    }
 
    @Override
    public void setErrorMsg(String errorMsg) {
        this.errorMsg = errorMsg;
    }
}