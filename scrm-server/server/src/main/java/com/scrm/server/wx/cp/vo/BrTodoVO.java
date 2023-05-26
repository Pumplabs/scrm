package com.scrm.server.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.server.wx.cp.entity.BrTodo;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import io.swagger.annotations.ApiModel;

/**
 * @author ouyang
 * @since 2022-05-20
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "待办结果集")
public class BrTodoVO extends BrTodo{

    @ApiModelProperty("创建者")
    private Staff creatorStaff;

}
