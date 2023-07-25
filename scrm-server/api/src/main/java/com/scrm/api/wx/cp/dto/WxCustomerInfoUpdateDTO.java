package com.scrm.api.wx.cp.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;
import java.util.List;

/**
 * @author xxh
 * @since 2021-12-22
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "企业微信客户详情信息修改请求参数")
public class WxCustomerInfoUpdateDTO {

    @ApiModelProperty(value = "系统客户id", required = true)
    @NotBlank(message = "客户id不能为空")
    private String customerId;

    @ApiModelProperty(value = "跟进员工id", required = true)
    @NotBlank(message = "根据员工id不能为空")
    private String staffId;

    @ApiModelProperty(value = "年龄")
    private Integer age;

    @ApiModelProperty(value = "邮箱")
    private String email;

    @ApiModelProperty(value = "电话")
    private String phoneNumber;

    @ApiModelProperty(value = "qq")
    private String qq;

    @ApiModelProperty(value = "地址")
    private String address;

    @ApiModelProperty(value = "生日")
    private String birthday;

    @ApiModelProperty(value = "微博")
    private String weibo;

    @ApiModelProperty(value = "自定义字段的值")
    private String remarkField;

    @ApiModelProperty(value = "性别,0-未知 1-男性 2-女性")
    private Integer gender;

    @ApiModelProperty(value = "所属企业名称")
    private String corpName;

}
