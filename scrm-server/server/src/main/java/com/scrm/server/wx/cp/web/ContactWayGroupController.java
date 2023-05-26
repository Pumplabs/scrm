package com.scrm.server.wx.cp.web;

import com.scrm.common.log.annotation.Log;
import com.scrm.common.constant.R;
import com.scrm.api.wx.cp.dto.ContactWayGroupQueryDTO;
import com.scrm.api.wx.cp.dto.ContactWayGroupSaveDTO;
import com.scrm.api.wx.cp.dto.ContactWayGroupUpdateDTO;
import com.scrm.api.wx.cp.entity.ContactWayGroup;
import com.scrm.server.wx.cp.service.IContactWayGroupService;
import com.scrm.api.wx.cp.vo.ContactWayGroupRepeatVO;
import com.scrm.api.wx.cp.vo.ContactWayGroupVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * 渠道活码-分组信息 控制器
 * @author xxh
 * @since 2021-12-26
 */
@RestController
@RequestMapping("/contactWayGroup")
@Api(tags = {"渠道活码-分组信息"})
public class ContactWayGroupController {

    @Autowired
    private IContactWayGroupService contactWayGroupService;


    @PostMapping("/list")
    @ApiImplicitParam(name = "extCorpId", value = "extCorpId", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "查询列表")
    @Log(modelName = "渠道活码-分组信息", operatorType = "查询列表")
    public R<List<ContactWayGroupVO>> list(@RequestParam String extCorpId){
        Assert.isTrue(StringUtils.isNotBlank(extCorpId), "公司参数不能为空");
        return R.data(contactWayGroupService.queryList(extCorpId));
    }

    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "渠道活码-分组信息", operatorType = "新增")
    public R<ContactWayGroup> save(@RequestBody @Valid ContactWayGroupSaveDTO dto){
        return R.data(contactWayGroupService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "渠道活码-分组信息", operatorType = "修改")
    public R<ContactWayGroup> update(@RequestBody @Valid ContactWayGroupUpdateDTO dto){
        contactWayGroupService.update(dto);
        return R.success();
    }


    @PostMapping("/delete")
    @ApiImplicitParam(name = "id", value = "id", required = true, dataType = "string", paramType = "query")
    @ApiOperation(value = "删除")
    @Log(modelName = "渠道活码-分组信息", operatorType = "删除")
    public R<Void> delete(@RequestParam String id){
        Assert.isTrue(StringUtils.isNotBlank(id), "渠道活码-分组信息ID不能为空");
        contactWayGroupService.delete(id);
        return R.success("删除成功");
    }

    @PostMapping(value = "/checkRepeat")
    @ApiOperation(value = "重名校验, true -> 重名， false -> 没重名")
    @Log(modelName = "渠道活码-分组信息", operatorType = "重名校验,true->重名，false->没重名")
    public R<Boolean> checkRepeat(@RequestBody @Valid ContactWayGroupRepeatVO dto){
        return R.data(contactWayGroupService.checkRepeat(dto));
    }
}
