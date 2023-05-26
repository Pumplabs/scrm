package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.server.wx.cp.entity.BrFollowTask;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author ouyang
 * @since 2022-06-16
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "跟进任务结果集")
public class BrFollowTaskVO extends BrFollowTask{

    @ApiModelProperty(value = "负责人")
    private Staff ownerStaff;

    @ApiModelProperty("创建人名字")
    private String creatorCN;
}
