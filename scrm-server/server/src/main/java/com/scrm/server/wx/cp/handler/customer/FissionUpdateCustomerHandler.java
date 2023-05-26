package com.scrm.server.wx.cp.handler.customer;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.scrm.api.wx.cp.dto.WxCpXmlOutMessageDTO;
import com.scrm.api.wx.cp.dto.WxCustomerTagSaveOrUpdateDTO;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.api.wx.cp.entity.WxFissionContact;
import com.scrm.api.wx.cp.entity.WxFissionTask;
import com.scrm.common.constant.Constants;
import com.scrm.common.util.ListUtils;
import com.scrm.server.wx.cp.service.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/4/2 14:36
 * @description：应用宝欢迎语
 **/
@Slf4j
@Service
public class FissionUpdateCustomerHandler extends CommonUpdateCustomerHandler {


    @Autowired
    private IWxCustomerService customerService;

    @Autowired
    private IStaffService staffService;

    @Override
    public int getSort() {
        return 0;
    }

    @Override
    public boolean match(String extCorpId, String extStaffId, String state) {
        return getFissionContact(extCorpId, state) != null;
    }

    @Override
    @Transactional
    public void saveHandle(WxCpXmlOutMessageDTO dto) {



    }

    @Override
    public void deleteHandle(WxCpXmlOutMessageDTO dto) {
    }

    private WxFissionContact getFissionContact(String extCorpId, String state){

       return null;
    }
}
