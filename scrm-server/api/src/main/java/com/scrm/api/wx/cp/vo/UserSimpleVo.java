package com.scrm.api.wx.cp.vo;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import java.io.Serializable;

/**
 * @author xxh
 * @since 2021-12-16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "用户信息，员工和客户通用")
public class UserSimpleVo implements Serializable {

    private static final long serialVersionUID = 1L;

    @ApiModelProperty(value = "'ID'")
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "外部员工ID", required = true)
    private String extId;

    @ApiModelProperty(value = "员工名", required = true)
    private String name;

}
