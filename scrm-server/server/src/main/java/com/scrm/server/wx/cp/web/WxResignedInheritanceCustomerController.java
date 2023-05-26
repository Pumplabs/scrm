package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.common.constant.R;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.server.wx.cp.dto.WxResignedStaffCustomerInfoDTO;
import com.scrm.server.wx.cp.dto.WxResignedStaffCustomerPageDTO;
import com.scrm.server.wx.cp.dto.WxWaitResignedTransferCustomerPageDTO;
import com.scrm.server.wx.cp.service.*;
import com.scrm.api.wx.cp.vo.*;
import com.scrm.server.wx.cp.vo.WxResignedStaffCustomerInfoVO;
import com.scrm.server.wx.cp.vo.WxResignedStaffCustomerVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import me.chanjar.weixin.common.error.WxErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * @author xuxh
 * @date 2022/3/9 10:55
 * Still in Beta
 */
@RestController
@RequestMapping("/customerResignedInheritance")
@Api(tags = {"客户离职继承"})
public class WxResignedInheritanceCustomerController {

    @Autowired
    private IWxResignedStaffCustomerService resignedStaffCustomerService;


    @GetMapping("/syncCustomer")
    @ApiOperation(value = "同步客户离职信息")
    @Log(modelName = "客户离职继承", operatorType = "同步客户离职信息")
    public R<Void> syncCustomer(String extCorpId) throws WxErrorException {
        resignedStaffCustomerService.syncCustomer(extCorpId);
        return R.success();
    }

    @PostMapping("/transferCustomer")
    @ApiOperation(value = "分配客户")
    @Log(modelName = "客户离职继承", operatorType = "分配客户")
    public R<StaffTransferCustomerVO> transferCustomer(@RequestBody @Valid WxStaffResignedTransferCustomerDTO dto) throws WxErrorException {
        return R.data(resignedStaffCustomerService.transferCustomer(dto));
    }

    @PostMapping("/pageCustomerResignedInheritance")
    @ApiOperation(value = "查询客户离职列表")
    @Log(modelName = "客户离职继承", operatorType = "查询客户离职列表")
    public R<IPage<WxResignedStaffCustomerInfoVO>> pageCustomerResignedInheritance(@Valid @RequestBody WxResignedStaffCustomerInfoDTO dto){
        return R.data(resignedStaffCustomerService.pageCustomerResignedInheritance(dto));
    }

    @PostMapping("/waitTransferCustomerPage")
    @ApiOperation(value = "分页查询待移交客户")
    @Log(modelName = "客户离职继承", operatorType = "分页查询待移交客户")
    public R<IPage<WxCustomerVO>> waitTransferCustomerPage(@Valid @RequestBody WxWaitResignedTransferCustomerPageDTO dto) {
        return R.data(resignedStaffCustomerService.waitTransferPage(dto));
    }


    @PostMapping("/transferCustomerPageInfo")
    @ApiOperation(value = "分页查询客户分配记录")
    @Log(modelName = "客户离职继承", operatorType = "分页查询客户分配记录")
    public R<IPage<WxResignedStaffCustomerVO>> transferCustomerPageInfo(@Valid @RequestBody WxResignedStaffCustomerPageDTO dto) {
        return R.data(resignedStaffCustomerService.pageList(dto));
    }

}
