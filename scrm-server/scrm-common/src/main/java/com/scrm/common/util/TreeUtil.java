package com.scrm.common.util;

import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

/**
 * 构建树的工具类
 **/
public class TreeUtil {
    /**
     * 根据子节点递归获取所有的父级节点
     *
     * @param: allNode 所有树节点数据
     * @param: returnNodes 递归后所有树节点的数据
     * @param: childrenNode    子节点
     * @date: 2020/11/12
     **/
    public static <T extends ITreeNode<T>> void recursionRootNode(List<T> allNode, List<T> returnNodes, T childrenNode) {
        Optional<T> menu = allNode.stream().filter(x -> x.getKey().equals(childrenNode.getPKey())).findFirst();
        if (menu.isPresent() && !returnNodes.contains(menu.get())) {
            returnNodes.add(menu.get());
            recursionRootNode(allNode, returnNodes, menu.get());
        }
    }

    /**
     * 构建树形结构
     *
     * @param treeNodeList 数据集合
     * @date: 2020/11/6
     */
    public static <T extends ITreeNode<T>> List<T> createTreeList(List<T> treeNodeList) {
        // 根节点
        List<T> rootList = new ArrayList<>();
        Iterator<T> iterator;
        for (T p : treeNodeList) {
            String pid = p.getPKey();
            boolean isRoot = true;
            for (T ch : treeNodeList) {
                if (ch.getKey().equals(pid)) {
                    isRoot = false;
                    break;
                }
            }
            if (isRoot) {
                // 获取根节点图层
                rootList.add(p);
            }

        }
        iterator = rootList.iterator();
        while (iterator.hasNext()) {
            T root = iterator.next();
            // 递归添加子节点
            recursiveTreeChildren(root, treeNodeList);
        }
        return rootList;
    }

    /**
     * 构建树形结构
     *
     * @param rootNotId    指定根节点的ID
     * @param treeNodeList 数据集合
     * @date: 2020/11/6
     */
    public static <T extends ITreeNode<T>> List<T> createTreeList(String rootNotId, List<T> treeNodeList) {
        // 根节点
        List<T> rootList = new ArrayList<>();
        Iterator<T> iterator;
        for (T node : treeNodeList) {
            if (rootNotId != null && !"".equals(rootNotId)) {
                if (rootNotId.equals(node.getPKey())) {
                    // 选取指定的根节点
                    rootList.add(node);
                }
            } else {
                if (null == node.getPKey() || "".equals(node.getPKey())) {
                    // 选取默认为空值的根节点
                    rootList.add(node);
                }
            }
        }
        iterator = rootList.iterator();
        while (iterator.hasNext()) {
            T root = iterator.next();
            // 递归添加子节点
            recursiveTreeChildren(root, treeNodeList);
        }
        return rootList;
    }

    /***
     * 递归添加子节点
     * @param root      根节点对象
     * @param allList   数据集合
     * @date: 2020/11/6
     */
    private static <T extends ITreeNode<T>> void recursiveTreeChildren(T root, List<T> allList) {
        if (allList != null && !allList.isEmpty()) {
            for (T res : allList) {
                String parentId = res.getPKey();
                if (!res.getKey().equals(root.getKey()) && (StringUtils.isNotBlank(parentId)
                        && root.getKey().equals(parentId))) {
                    List<T> children = Optional.ofNullable(root.getChildren()).orElse(new ArrayList<>());
                    children.add(res);
                    root.setChildren(children);
                    recursiveTreeChildren(res, allList);
                }
            }
        }
    }

}
