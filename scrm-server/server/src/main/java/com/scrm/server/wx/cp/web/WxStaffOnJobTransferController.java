package com.scrm.server.wx.cp.web;

import com.scrm.api.wx.cp.dto.WxWaitTransferCustomerPageDTO;
import com.scrm.api.wx.cp.dto.WxWaitTransferGroupChatPageDTO;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.api.wx.cp.entity.WxGroupChat;
import com.scrm.api.wx.cp.vo.WxCustomerVO;
import com.scrm.api.wx.cp.vo.WxGroupChatVO;
import com.scrm.common.log.annotation.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.common.constant.R;
import com.scrm.api.wx.cp.dto.StaffOnJobTransferCustomerDTO;
import com.scrm.api.wx.cp.dto.WxStaffTransferInfoPageDTO;
import com.scrm.api.wx.cp.entity.WxStaffTransferInfo;
import com.scrm.server.wx.cp.service.IWxStaffTransferInfoService;
import com.scrm.server.wx.cp.service.IWxStaffOnJobTransferService;
import com.scrm.api.wx.cp.vo.StaffTransferCustomerVO;
import com.scrm.api.wx.cp.vo.WxStaffTransferInfoVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
@RequestMapping("/staffOnJobTransfer")
@Api(tags = {"企业员工在职转移"})
public class WxStaffOnJobTransferController {

    @Autowired
    private IWxStaffOnJobTransferService staffOnJobTransferService;

    @Autowired
    private IWxStaffTransferInfoService infoService;

    @PostMapping("/transferCustomer")
    @ApiOperation(value = "企业员工转移客户")
    @Log(modelName = "企业员工在职转移", operatorType = "企业员工转移客户")
    public R<StaffTransferCustomerVO> transferCustomer(@Valid @RequestBody StaffOnJobTransferCustomerDTO dto) {
        return R.data(staffOnJobTransferService.transferCustomer(dto));
    }

    @PostMapping("/pageInfo")
    @ApiOperation(value = "分页查询移交详情")
    @Log(modelName = "企业员工在职转移", operatorType = "分页查询移交详情")
    public R<IPage<WxStaffTransferInfoVO>> pageInfo(@Valid @RequestBody WxStaffTransferInfoPageDTO dto) {
        dto.setType(WxStaffTransferInfo.TYPE_ON_JOB);
        return R.data(infoService.pageList(dto));
    }

    @PostMapping("/waitTransferCustomerPage")
    @ApiOperation(value = "分页查询待移交客户")
    @Log(modelName = "企业员工在职转移", operatorType = "分页查询待移交客户")
    public R<IPage<WxCustomerVO>> waitTransferCustomerPage(@Valid @RequestBody WxWaitTransferCustomerPageDTO dto) {
        return R.data(infoService.waitTransferCustomerPage(dto));
    }

    @PostMapping("/waitTransferGroupChatPage")
    @ApiOperation(value = "分页查询待移交群聊")
    @Log(modelName = "企业员工在职转移", operatorType = "分页查询待移交群聊")
    public R<IPage<WxGroupChatVO>> waitTransferGroupChatPage(@Valid @RequestBody WxWaitTransferGroupChatPageDTO dto) {
        return R.data(infoService.waitTransferGroupChatPage(dto));
    }


}
