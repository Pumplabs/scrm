package com.scrm.common.util;


import java.io.Serializable;
import java.util.List;

/**
 * 树节点接口类
 */
public interface ITreeNode<T> extends Serializable {
    /**
     * 获取主键ID
     */
    String getKey();
    /**
     * 获取父级ID
     */
    String getPKey();
    /**
     * 获取子节点
     */
    List<T> getChildren();

    /**
     * 设置子节点
     */
    void setChildren(List<T> children);
}
