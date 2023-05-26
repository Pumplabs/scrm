package com.scrm.server.wx.cp.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.FastjsonTypeHandler;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.scrm.api.wx.cp.dto.CustomerDynamicInfoDTO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.format.annotation.DateTimeFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * 客户动态
 * @author xxh
 * @since 2022-05-12
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "客户动态")
@TableName(value = "br_customer_dynamic", autoResultMap = true)
public class BrCustomerDynamic implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "主键")
    @TableId
    private String id;

    @ApiModelProperty(value = "模块")
    private Integer model;

    @ApiModelProperty(value = "类型，" +
            "    CUSTOMER_ADD_STAFF(1, \"客户添加好友\"),\n" +
            "    STAFF_ADD_CUSTOMER(2, \"员工添加客户\"),\n" +
            "    CUSTOMER_DELETE(3, \"客户删除\"),\n" +
            "    DELETE_CUSTOMER(4, \"删除客户\"),\n" +
            "    JOIN_GROUP_CHAT(5, \"加入群聊\"),\n" +
            "    EXIT_GROUP_CHAT(6, \"退出群聊\"),\n" +
            "    STAGE_ADD(7, \"阶段添加\"),\n" +
            "    STAGE_UPDATE(8, \"阶段变化\"),\n" +
            "    STAGE_DELETE(9, \"阶段移除\"),\n" +
            "    MARK_TAG(10, \"打标签\"),\n" +
            "    CHECK(11, \"查看轨迹素材\"),\n" +
            "    FISSION_FRIENDS(12, \"参加好友裂变\")")
    private Integer type;

    @ApiModelProperty(value = "详情")
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private CustomerDynamicInfoDTO info;

    @ApiModelProperty(value = "客户extId")
    private String extCustomerId;

    @ApiModelProperty(value = "员工extId")
    private String extStaffId;

    @ApiModelProperty(value = "'创建时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date createdAt;

    @ApiModelProperty(value = "'更新时间'")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date updatedAt;

    @ApiModelProperty(value = "外部企业ID")
    private String extCorpId;
}
