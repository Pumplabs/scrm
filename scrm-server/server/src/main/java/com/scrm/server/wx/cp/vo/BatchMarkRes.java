package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.vo.WxCustomerStaffVO;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/31 10:55
 * @description：批量打标结果
 **/
@Data
public class BatchMarkRes {

    private List<WxCustomerStaffVO> successList = new ArrayList<>();

    private List<WxCustomerStaffVO> failList = new ArrayList<>();
}
