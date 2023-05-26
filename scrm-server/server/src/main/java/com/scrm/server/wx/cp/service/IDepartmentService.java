package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.scrm.api.wx.cp.dto.DepartmentPageDTO;
import com.scrm.api.wx.cp.dto.DepartmentSaveDTO;
import com.scrm.api.wx.cp.dto.DepartmentUpdateDTO;
import com.scrm.api.wx.cp.entity.Department;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.vo.DepartmentTreeVO;
import com.scrm.api.wx.cp.vo.DepartmentVO;
import me.chanjar.weixin.common.error.WxErrorException;

import java.util.List;


/**
 * 服务类
 *
 * @author xxh
 * @since 2021-12-16
 */
public interface IDepartmentService extends IService<Department> {


    /**
     * 分页查询
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2021-12-16
     */
    IPage<DepartmentVO> pageList(DepartmentPageDTO dto);

    /**
     * 根据id查询
     *
     * @param id 主键
     * @author xxh
     * @date 2021-12-16
     */
    DepartmentVO findById(String id);


    /**
     * 新增
     *
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.Department
     * @author xxh
     * @date 2021-12-16
     */
    Department save(DepartmentSaveDTO dto) throws WxErrorException;

    /**
     * 修改
     *
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.Department
     * @author xxh
     * @date 2021-12-16
     */
    Department update(DepartmentUpdateDTO dto) throws WxErrorException;


    /**
     * 删除
     *
     * @param id id
     * @author xxh
     * @date 2021-12-16
     */
    void delete(String id) throws WxErrorException;


    /**
     * 删除
     *
     * @param id          id 部门ID
     * @param needSynToWx 是否需要同步
     * @author xxh
     * @date 2021-12-16
     */
    void delete(String id, boolean needSynToWx) throws WxErrorException;

    /**
     * 校验是否存在
     *
     * @param id id
     * @return com.scrm.api.wx.cp.entity.Department
     * @author xxh
     * @date 2021-12-16
     */
    Department checkExists(String id);


    /**
     * 校验是否存在
     *
     * @param extId     外部企业部门id
     * @param extCorpId 企业外部id
     * @return com.scrm.api.wx.cp.entity.Department
     * @author xxh
     * @date 2021-12-16
     */
    Department checkExists(Long extId, String extCorpId);


    /**
     * 同步企业部门数据
     *
     * @param extCorpId 企业外部id
     * @return 是否同步成功
     * @author xxh
     * @date 2021-12-17
     */
    List<Department> sync(String extCorpId);

    /**
     * 获取部门树
     *
     * @param extCorpId 企业外部id
     * @return 树形列表
     */
    List<DepartmentTreeVO> getTree(String extCorpId);

    /**
     * 获取部门树(包含员工集合)
     *
     * @param extCorpId 企业外部id
     * @param staffName 员工名称
     * @param excludeRoleKey 排除角色key
     * @return 树形列表
     */
    List<DepartmentTreeVO> getTreeWithStaffMap(String extCorpId, String staffName, String excludeRoleKey);


    /**
     * 递归查询子部门id集合（包含传进来的父部门）
     *
     * @return
     */
    List<Long> getChildIdList(String extCorpId, List<Long> extParentIdList);

    /**
     * 获取默认根部门
     *
     * @return
     */
    Department getRootDepartment(String extCorpId);


}
