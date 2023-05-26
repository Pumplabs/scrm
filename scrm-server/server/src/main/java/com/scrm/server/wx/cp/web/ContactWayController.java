package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.api.wx.cp.dto.ContactWayPageDTO;
import com.scrm.api.wx.cp.dto.ContactWaySaveDTO;
import com.scrm.api.wx.cp.dto.ContactWayUpdateDTO;
import com.scrm.api.wx.cp.entity.ContactWay;
import com.scrm.api.wx.cp.vo.*;
import com.scrm.common.constant.R;
import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.service.IContactWayService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.List;

/**
 * 渠道活码 控制器
 * @author xxh
 * @since 2021-12-26
 */
@RestController
@RequestMapping("/contactWay")
@Api(tags = {"渠道活码", "https://work.weixin.qq.com/api/doc/90000/90135/92572"})
public class ContactWayController {

    @Autowired
    private IContactWayService contactWayService;


    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "渠道活码", operatorType = "分页查询")
    public R<IPage<ContactWayVO>> pageList(@RequestBody @Valid ContactWayPageDTO dto){
        return R.data(contactWayService.pageList(dto));
    }


    @GetMapping("/{id}")
    @ApiOperation(value = "根据主键查询")
    @Log(modelName = "渠道活码", operatorType = "根据主键查询")
    public R<ContactWay> findById(@PathVariable(value = "id") String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "渠道活码ID不能为空");
        return R.data(contactWayService.findById(id));
    }


    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "渠道活码", operatorType = "新增")
    public R<ContactWay> save(@RequestBody @Valid ContactWaySaveDTO dto){
        return R.data(contactWayService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "渠道活码", operatorType = "修改")
    public R<ContactWay> update(@RequestBody @Valid ContactWayUpdateDTO dto){
        return R.data(contactWayService.update(dto));
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "渠道活码", operatorType = "删除")
    public R<Void> delete(String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "渠道活码ID不能为空");
        contactWayService.delete(id);
        return R.success("删除成功");
    }


    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "渠道活码", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto){
        contactWayService.batchDelete(dto);
        return R.success("删除成功");
    }

    @PostMapping("/countTotal")
    @ApiOperation(value = "渠道活码统计(最上面那个没条件的总览)")
    @Log(modelName = "渠道活码", operatorType = "渠道活码统计(最上面那个没条件的总览)")
    public R<ContactWayCountTotalResVO> countTotal(@RequestBody @Valid ContactWayCountParamsVO paramsVO){
        return R.data(contactWayService.countTotal(paramsVO));
    }

    @PostMapping("/countByDate")
    @ApiOperation(value = "渠道活码统计(根据时间)")
    @Log(modelName = "渠道活码", operatorType = "渠道活码统计(根据时间)")
    public R<List<ContactWayCountResVO>> countByDate(@RequestBody @Valid ContactWayCountParamsVO paramsVO){
        return R.data(contactWayService.countByDate(paramsVO));
    }

    @PostMapping("/countByStaff")
    @ApiOperation(value = "渠道活码统计(根据员工)(前端来排序喔)")
    @Log(modelName = "渠道活码", operatorType = "渠道活码统计(根据员工)(前端来排序喔)")
    public R<List<ContactWayCountResVO>> countByStaff(@RequestBody @Valid ContactWayCountParamsVO paramsVO){
        return R.data(contactWayService.countByStaff(paramsVO));
    }

    @PostMapping("/countByCustomer")
    @ApiOperation(value = "渠道活码统计(根据客户)")
    @Log(modelName = "渠道活码", operatorType = "渠道活码统计(根据客户)")
    public R<List<ContactWayCountDetailVO>> countByCustomer(@RequestBody @Valid ContactWayCountParamsVO paramsVO){
        return R.data(contactWayService.countByCustomer(paramsVO));
    }

    @GetMapping("/exportUrlByDate")
    @ApiOperation(value = "导出渠道活码统计(根据时间)")
    @Log(modelName = "渠道活码", operatorType = "导出渠道活码统计(根据时间)")
    public void exportUrlByDate(ContactWayCountParamsVO paramsVO, HttpServletRequest request, HttpServletResponse response){
        contactWayService.exportUrlByDate(paramsVO, request, response);
    }

    @PostMapping("/getExportUrlByStaff")
    @ApiOperation(value = "导出渠道活码统计(根据员工)")
    @Log(modelName = "渠道活码", operatorType = "导出渠道活码统计(根据员工)")
    public void getExportUrlByStaff(@RequestBody @Valid ContactWayCountParamsVO paramsVO){
        contactWayService.getExportUrlByStaff(paramsVO);
    }

    @PostMapping("/getExportUrlByCustomer")
    @ApiOperation(value = "导出渠道活码统计(根据客户)")
    @Log(modelName = "渠道活码", operatorType = "导出渠道活码统计(根据客户)")
    public void getExportUrlByCustomer(@RequestBody @Valid ContactWayCountParamsVO paramsVO){
        contactWayService.getExportUrlByCustomer(paramsVO);
    }
}
