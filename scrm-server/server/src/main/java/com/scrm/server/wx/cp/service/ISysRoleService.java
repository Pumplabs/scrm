package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.common.entity.SysRole;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.dto.SysRolePageDTO;
import com.scrm.server.wx.cp.dto.SysRoleSaveDTO;
import com.scrm.server.wx.cp.dto.SysRoleUpdateDTO;

import com.scrm.server.wx.cp.dto.SysRoleQueryDTO;
import com.scrm.server.wx.cp.vo.SysRoleVO;

import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;

/**
 * 角色信息表 服务类
 * @author xxh
 * @since 2022-06-16
 */
public interface ISysRoleService extends IService<SysRole> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-06-16
     * @param dto 请求参数
     */
    IPage<SysRoleVO> pageList(SysRolePageDTO dto);

    /**
     * 查询列表
     * @author xxh
     * @date 2022-06-16
     * @param dto 请求参数
     */
    List<SysRoleVO> queryList(SysRoleQueryDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-06-16
     * @param id 主键
     */
    SysRoleVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-06-16
     * @param dto 请求参数
     * @return com.scrm.common.entity.SysRole
     */
    SysRole save(SysRoleSaveDTO dto);

    /**
     * 获取企业管理员角色
     * @return
     */
    SysRole getEnterpriseAdminRole();

     /**
      * 修改
      * @author xxh
      * @date 2022-06-16
      * @param dto 请求参数
      * @return com.scrm.common.entity.SysRole
      */
    SysRole update(SysRoleUpdateDTO dto);


    /**
     * 删除
     * @author xxh
     * @date 2022-06-16
     * @param id 角色信息表id
     */
    void delete(String id);

    /**
     * 批量删除
     * @author xxh
     * @date 2022-06-16
     * @param dto 请求参数
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-06-16
     * @param id 角色信息表id
     * @return com.scrm.common.entity.SysRole
     */
    SysRole checkExists(String id);

    /**
     * 根据roleKey获取所有的用户列表
     * @param extCorpId 外部企业ID
     * @param roleKey 角色key
     * @return
     */
    List<String> getExtStaffIdsByRoleKey(String extCorpId, String roleKey);
}
