package com.scrm.server.wx.cp.feign.dto;

import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author ：qiuzl
 * @date ：Created in 2022/5/10 14:14
 * @description： 企微导出id转译的参数
 **/
@Data
@Accessors(chain = true)
public class TpIdTranslateParams {

    private String auth_corpid;

    private List<String> media_id_list;

    private String output_file_name;

    private String output_file_format;
}
