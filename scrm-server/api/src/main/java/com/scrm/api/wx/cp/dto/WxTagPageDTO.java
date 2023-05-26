package com.scrm.api.wx.cp.dto;

import com.scrm.common.dto.BasePageDTO;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author xxh
 * @since 2021-12-29
 */
@Data
@ApiModel(value = "企业微信标签管理分页请求参数")
@Accessors(chain = true)
public class WxTagPageDTO extends BasePageDTO {


}

