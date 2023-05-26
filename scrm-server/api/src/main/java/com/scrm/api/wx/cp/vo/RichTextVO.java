package com.scrm.api.wx.cp.vo;

import io.swagger.annotations.ApiModel;
import lombok.Data;

import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/3/14 18:01
 * @description：富文本VO
 **/
@Data
@ApiModel("富文本VO")
public class RichTextVO {

    private String tag;

    private List<Object> attrs;

    private List<Object> children;

}
