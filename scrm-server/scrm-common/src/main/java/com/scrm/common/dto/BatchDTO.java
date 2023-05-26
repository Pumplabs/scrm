package com.scrm.common.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

/**
 * @Author: xxh
 * @Date: 2021/12/13 00:51
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "批量操作请求VO")
public class BatchDTO<T> {

    @ApiModelProperty(value = "id列表")
    @NotNull(message = "id不能为空")
    @Size(min = 1, message = "id不能为空")
    private List<T> ids;
}
