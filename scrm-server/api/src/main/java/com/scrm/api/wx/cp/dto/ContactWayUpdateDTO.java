package com.scrm.api.wx.cp.dto;

import com.scrm.api.wx.cp.dto.WxMsgDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;


@Data
@Accessors(chain = true)
@ApiModel(value = "渠道活码修改请求参数")
public class ContactWayUpdateDTO {

    @ApiModelProperty("id")
    @NotNull(message = "请输入修改的id")
    private String id;

    @ApiModelProperty(value = "外部企业ID")
    @NotNull(message = "请输入外部企业ID")
    private String extCorpId;

    @ApiModelProperty(value = "'渠道码名称'")
    @NotNull(message = "请输入渠道码名称")
    private String name;

    @ApiModelProperty(value = "活码分组ID")
    @NotNull(message = "请选择渠道码分组")
    private String groupId;

    @ApiModelProperty(value = "渠道码的备注信息")
    private String remark;

    @ApiModelProperty(value = "外部客户添加时是否无需验证，假布尔类型")
    @NotNull(message = "请选择外部客户添加时是否无需验证")
    private Boolean skipVerify;

    @ApiModelProperty(value = "'欢迎语类型：1，渠道欢迎语；2, 渠道默认欢迎语；3，不送欢迎语；'")
    @NotNull(message = "请选择欢迎语类型")
    private Integer autoReplyType;

    @ApiModelProperty(value = "欢迎语策略")
    private WxMsgDTO autoReply;

    @ApiModelProperty(value = "客户描述")
    private String customerDesc;

    @ApiModelProperty(value = "是否开启客户描述")
    @NotNull(message = "请选择是否开启客户描述")
    private Boolean customerDescEnable;

    @ApiModelProperty(value = "客户备注")
    private String customerRemark;

    @ApiModelProperty(value = "是否开启客户备注")
    @NotNull(message = "请选择是否开启客户备注")
    private Boolean customerRemarkEnable;

    @ApiModelProperty(value = "是否开启员工每日添加上限")
    @NotNull(message = "请选择是否开启员工每日添加上限")
    private Boolean dailyAddCustomerLimitEnable;

    @ApiModelProperty(value = "员工每日添加上限")
    private Integer dailyAddCustomerLimit;

    @ApiModelProperty(value = "'是否自动打标签'")
    @NotNull(message = "请选择是否自动打标签")
    private Boolean autoTagEnable;

    @ApiModelProperty(value = "'自动打标签绑定的标签ExtID数组'")
    private List<String> customerTagExtIds;

    @ApiModelProperty(value = "'员工id集合'")
    @NotNull(message = "请至少选择一个员工")
    @Size(min = 1, message = "请至少选择一个员工")
    private List<String> staffIds;

    @ApiModelProperty(value = "'备用员工id集合'")
    private List<String> backOutStaffIds;

}
