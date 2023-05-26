package com.scrm.api.wx.cp.vo;

import com.scrm.api.wx.cp.entity.Department;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.common.util.ITreeNode;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.experimental.Accessors;
import org.apache.poi.ss.formula.functions.T;

import java.util.List;

/**
 * @Author: xxh
 * @Date: 2021/12/23 23:10
 */
@Data
@Accessors(chain = true)
public class DepartmentTreeVO extends Department implements ITreeNode<DepartmentTreeVO> {

    @ApiModelProperty(value = "子集")
    private List<DepartmentTreeVO> children;

    @ApiModelProperty(value = "员工集合")
    private List<Staff> staffList;

    @Override
    public void setChildren(List<DepartmentTreeVO> children) {
        this.children = children;
    }

    @Override
    public String getPKey() {
        return super.getExtParentId() == null ? "" : super.getExtParentId().toString();
    }

    @Override
    public String getKey() {
        return super.getExtId().toString();
    }
}
