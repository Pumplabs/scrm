package com.scrm.api.wx.cp.entity;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableId;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;

/**
 * 员工离职继承统计
 * @author xxh
 * @since 2022-03-14
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "员工离职继承统计")
@TableName("wx_staff_resigned_transfer_statistics")
public class WxStaffResignedTransferStatistics implements Serializable{

    private static final long serialVersionUID=1L;

    @ApiModelProperty(value = "员工主键")
    @TableId
    private String staffId;

    @ApiModelProperty("企业id")
    private String extCorpId;

    @ApiModelProperty(value = "离职时间")
    @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private Date resignedTime;

    @ApiModelProperty(value = "已交接员工数量")
    private Integer transferCustomerNum;

    @ApiModelProperty(value = "已交接群聊数量")
    private Integer transferGroupChatNum;


}
