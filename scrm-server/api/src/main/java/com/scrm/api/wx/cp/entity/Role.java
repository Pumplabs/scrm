package com.scrm.api.wx.cp.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

/**
 * <p>
 *
 * </p>
 *
 * @author qiu
 * @since 2021-12-13
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class Role implements Serializable {

    private static final long serialVersionUID=1L;

    /**
     * 'ID'
     */
      private Long id;

    /**
     * 外部企业ID
     */
    private String extCorpId;

    /**
     * 创建者外部员工ID
     */
    private String extCreatorId;

    /**
     * '角色名称'
     */
    private String name;

    /**
     * '角色描述'
     */
    private String description;

    /**
     * '角色类型'
     */
    private String type;

    /**
     * '角色排序权重'
     */
    private Long sortWeight;

    /**
     * '是否为默认角色，1：是；2：否'
     */
    private Long isDefault;

    /**
     * '角色绑定的权限标识数组'
     */
    private String permissionIds;

    /**
     * '创建时间'
     */
    private Date createdAt;

    /**
     * '更新时间'
     */
    private Date updatedAt;

    /**
     * '删除时间'
     */
    private Date deletedAt;


}
