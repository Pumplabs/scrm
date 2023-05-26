package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.dto.SysRoleStaffPageDTO;
import com.scrm.server.wx.cp.dto.SysRoleStaffQueryDTO;
import com.scrm.server.wx.cp.dto.SysRoleStaffSaveDTO;
import com.scrm.common.entity.SysRoleStaff;
import com.scrm.server.wx.cp.vo.SysRoleStaffVO;

import java.util.List;

/**
 * 角色-员工关联 服务类
 *
 * @author xxh
 * @since 2022-06-16
 */
public interface ISysRoleStaffService extends IService<SysRoleStaff> {


    /**
     * 分页查询
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-06-16
     */
    IPage<SysRoleStaffVO> pageList(SysRoleStaffPageDTO dto);

    /**
     * 查询列表
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-06-16
     */
    List<SysRoleStaffVO> queryList(SysRoleStaffQueryDTO dto);

    /**
     * 根据id查询
     *
     * @param id 主键
     * @author xxh
     * @date 2022-06-16
     */
    SysRoleStaffVO findById(String id);


    /**
     * 新增
     *
     * @param dto 请求参数
     * @return com.scrm.common.entity.SysRoleStaff
     * @author xxh
     * @date 2022-06-16
     */
    List<SysRoleStaff> save(SysRoleStaffSaveDTO dto);

    /**
     * 删除
     *
     * @param id 角色-员工关联id
     * @author xxh
     * @date 2022-06-16
     */
    void delete(String id);

    /**
     * 校验是否存在
     *
     * @param id 角色-员工关联id
     * @return com.scrm.common.entity.SysRoleStaff
     * @author xxh
     * @date 2022-06-16
     */
    SysRoleStaff checkExists(String id);

    /**
     * 是否为企业管理员
     *
     * @param extStaffId 员工extId
     * @param extCorpId 外部企业ID
     * @return
     */
    boolean isEnterpriseAdmin(String extStaffId, String extCorpId);

    /**
     * 是否为企业管理员
     * @return
     */
    boolean isEnterpriseAdmin();
}
