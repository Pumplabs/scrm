package com.scrm.server.wx.cp.web;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.common.constant.R;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.log.annotation.Log;
import com.scrm.server.wx.cp.dto.BrMediaSayPageDTO;
import com.scrm.server.wx.cp.dto.BrMediaSaySaveDTO;
import com.scrm.server.wx.cp.dto.BrMediaSayUpdateDTO;
import com.scrm.server.wx.cp.entity.BrMediaSay;
import com.scrm.server.wx.cp.service.IBrMediaSayService;
import com.scrm.server.wx.cp.vo.BrMediaSayVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

/**
 * （素材库）企业话术 控制器
 * @author xxh
 * @since 2022-05-10
 */
@RestController
@RequestMapping("/brMediaSay")
@Api(tags = {"（素材库）企业话术"})
public class BrMediaSayController {

    @Autowired
    private IBrMediaSayService brMediaSayService;

    @PostMapping("/pageList")
    @ApiOperation(value = "分页查询")
    @Log(modelName = "（素材库）企业话术", operatorType = "分页查询")
    public R<IPage<BrMediaSayVO>> pageList(@RequestBody @Valid BrMediaSayPageDTO dto){
        return R.data(brMediaSayService.pageList(dto));
    }

    @PostMapping(value = "/save")
    @ApiOperation(value = "新增")
    @Log(modelName = "（素材库）企业话术", operatorType = "新增")
    public R<BrMediaSay> save(@RequestBody @Valid BrMediaSaySaveDTO dto){
        return R.data(brMediaSayService.save(dto));
    }


    @PostMapping(value = "/update")
    @ApiOperation(value = "修改")
    @Log(modelName = "（素材库）企业话术", operatorType = "修改")
    public R<BrMediaSay> update(@RequestBody @Valid BrMediaSayUpdateDTO dto){
        return R.data(brMediaSayService.update(dto));
    }

    @PostMapping("/batchDelete")
    @ApiOperation(value = "批量删除")
    @Log(modelName = "（素材库）企业话术", operatorType = "批量删除")
    public R<Void> batchDelete(@RequestBody @Valid BatchDTO<String> dto){
        brMediaSayService.batchDelete(dto);
        return R.success("删除成功");
    }

//    @GetMapping(value = "/addSendCount")
//    @ApiOperation(value = "添加发送次数")
//    @Log(modelName = "（素材库）企业话术", operatorType = "添加发送次数")
//    public R addSendCount(@RequestParam String extCorpId, @RequestParam String sayId, @RequestParam Integer count){
//        brMediaSayService.addSendCount(extCorpId, sayId, count);
//        return R.success();
//    }
}
