package com.scrm.common.vo;

import com.scrm.common.entity.SysMenu;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.List;

/**
 * @author ouyang
 * @description 菜单树
 * @date 2022/5/3 20:34
 */
@Data
@Accessors(chain = true)
@ApiModel(value = "系统菜单树")
public class MenuTreeVO extends SysMenu {

    @ApiModelProperty(value = "菜单子集")
    private List<MenuTreeVO> children;
}
