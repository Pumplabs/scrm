package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.DepartmentPageDTO;
import com.scrm.api.wx.cp.dto.DepartmentSaveDTO;
import com.scrm.api.wx.cp.dto.DepartmentUpdateDTO;
import com.scrm.api.wx.cp.entity.Department;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.StaffDepartment;
import com.scrm.api.wx.cp.vo.DepartmentTreeVO;
import com.scrm.api.wx.cp.vo.DepartmentVO;
import com.scrm.common.constant.Constants;
import com.scrm.common.exception.BaseException;
import com.scrm.common.exception.ErrorMsgEnum;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.TreeUtil;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.mapper.DepartmentMapper;
import com.scrm.server.wx.cp.service.*;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpDepartmentService;
import me.chanjar.weixin.cp.api.impl.WxCpDepartmentServiceImpl;
import me.chanjar.weixin.cp.bean.WxCpDepart;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 服务实现类
 *
 * @author xxh
 * @since 2021-12-16
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class DepartmentServiceImpl extends ServiceImpl<DepartmentMapper, Department> implements IDepartmentService {

    @Autowired
    private IStaffDepartmentService staffDepartmentService;

    @Autowired
    private ISysRoleService sysRoleService;

    @Autowired
    private IStaffService staffService;

    @Autowired
    private WxCpConfiguration wxCpConfiguration;

    @Autowired
    private IBrCorpAccreditService corpAccreditService;


    @Override
    public IPage<DepartmentVO> pageList(DepartmentPageDTO dto) {
        LambdaQueryWrapper<Department> wrapper = new QueryWrapper<Department>().lambda()
                .eq(StringUtils.isNotBlank(dto.getExtCorpId()), Department::getExtCorpId, dto.getExtCorpId())
                .eq(dto.getExtParentId() != null, Department::getExtParentId, dto.getExtParentId())
                .eq(dto.getExtParentId() == null, Department::getExtParentId, 1L)
                .orderByDesc(Department::getOrder)
                .orderByAsc(Department::getCreatedAt);
        IPage<Department> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public DepartmentVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public Department save(DepartmentSaveDTO dto) throws WxErrorException {

        //校验数据
        checkExists(dto.getExtParentId(), dto.getExtCorpId());

        //封装数据
        Department department = new Department();
        BeanUtils.copyProperties(dto, department);
        department.setId(UUID.get32UUID())
                .setCreatedAt(Optional.ofNullable(dto.getCreateTime()).orElse(new Date()));

        //调用企业微信接口新增部门
        if (dto.isNeedSynToWx()) {
            WxCpDepartmentService departmentService = new WxCpDepartmentServiceImpl(wxCpConfiguration.getAddressBookWxCpService());
            WxCpDepart depart = new WxCpDepart();
            depart.setName(dto.getName());
            depart.setOrder(dto.getOrder());
            depart.setParentId(dto.getExtParentId());
            Long extId = departmentService.create(depart);
            department.setExtId(extId);
        }

        //入库
        save(department);

        return department;
    }


    @Override
    public Department update(DepartmentUpdateDTO dto) throws WxErrorException {

        //校验参数
        Department old = checkExists(dto.getId());
        checkExists(dto.getExtParentId(), old.getExtCorpId());

        //封装数据
        Department department = new Department();
        BeanUtils.copyProperties(dto, department);
        department.setExtId(old.getExtId())
                .setExtCorpId(old.getExtCorpId())
                .setCreatedAt(old.getCreatedAt())
                .setUpdatedAt(new Date());

        //入库
        updateById(department);

        if (dto.isNeedSynToWx()) {
            //调用企业微信接口修改部门
            WxCpDepartmentService departmentService = new WxCpDepartmentServiceImpl(WxCpConfiguration.getAddressBookWxCpService());
            WxCpDepart wxCpDepart = new WxCpDepart();
            wxCpDepart.setName(department.getName());
            wxCpDepart.setOrder(department.getOrder());
            wxCpDepart.setParentId(department.getExtParentId());
            wxCpDepart.setId(department.getExtId());
            departmentService.update(wxCpDepart);
        }

        return department;
    }

    @Override
    public void delete(String id, boolean needSynToWx) throws WxErrorException {
        //校验参数,不能删除根部门；不能删除含有子部门、成员的部门
        Department department = checkExists(id);
        Long extId = department.getExtId();
        if (extId == 1) {
            throw new BaseException("不能删除根部门");
        }
        if (department.getStaffNum() > 0) {
            throw new BaseException("不能删除含成员的部门");
        }
        if (count(new QueryWrapper<Department>().lambda().eq(Department::getExtParentId, extId)) > 0) {
            throw new BaseException("不能删除含子部门的部门");
        }

        //删除
        removeById(id);

        if (needSynToWx) {
            //调用企业微信接口删除部门
            WxCpDepartmentService departmentService = new WxCpDepartmentServiceImpl(wxCpConfiguration.getAddressBookWxCpService());
            departmentService.delete(extId);
        }

    }

    @Override
    public void delete(String id) throws WxErrorException {
        delete(id, true);
    }


    /**
     * 翻译
     *
     * @param department 实体
     * @return DepartmentVO 结果集
     * @author xxh
     * @date 2021-12-16
     */
    private DepartmentVO translation(Department department) {
        DepartmentVO vo = new DepartmentVO();
        BeanUtils.copyProperties(department, vo);
        vo.setStaffNum(staffDepartmentService.queryDepartmentStaffNum(department.getExtCorpId(), department.getExtId()));
        return vo;
    }


    @Override
    public Department checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        Department byId = getById(id);
        if (byId == null) {
            throw new BaseException("部门不存在");
        }
        return byId;
    }

    @Override
    public Department checkExists(Long extId, String extCorpId) {
        if (extId == null) {
            return null;
        }
        Department department = getOne(new QueryWrapper<Department>().lambda()
                .eq(Department::getExtId, extId)
                .eq(Department::getExtCorpId, extCorpId)
        );
        if (department == null) {
            throw new BaseException("部门不存在");
        }
        return department;
    }

    @Override
    public List<Department> sync(String extCorpId) {

        List<Department> departments = new ArrayList<>();

        if (StringUtils.isBlank(extCorpId)) {
            return departments;
        }

        try {
            //获取所有的部门信息，根部门为1
            WxCpDepartmentService departmentService = new WxCpDepartmentServiceImpl(wxCpConfiguration.getAddressBookWxCpService());
            List<WxCpDepart> list = departmentService.simpleList(null);

            //依然存在的部门id
            List<Long> existsExtIds = new ArrayList<>();

            //需要修改的列表
            List<Department> updateList = new ArrayList<>();

            //需要新增的列表
            List<Department> saveList = new ArrayList<>();

            Optional.ofNullable(list).orElse(new ArrayList<>()).forEach(department -> {
                //校验是否存在
                Department depart = getOne(new QueryWrapper<Department>().lambda()
                        .eq(Department::getExtId, department.getId())
                        .eq(Department::getExtCorpId, extCorpId));

                //修改
                if (depart != null) {

                    depart.setUpdatedAt(new Date())
                            .setName(department.getId() + "")
                            .setOrder(department.getOrder())
                            .setExtParentId(department.getParentId());
                    updateList.add(depart);
                    existsExtIds.add(department.getId());

                } else {
                    depart = new Department()
                            .setId(UUID.get32UUID())
                            .setExtId(department.getId())
                            .setExtCorpId(extCorpId)
                            .setCreatedAt(new Date())
                            .setUpdatedAt(new Date())
                            .setName(department.getId() + "")
                            .setOrder(department.getOrder())
                            .setExtParentId(department.getParentId());
                    saveList.add(depart);
                }
            });

            //将已经不存在的部门设置为删除状态
            if (ListUtils.isNotEmpty(existsExtIds)) {
                update(new UpdateWrapper<Department>()
                        .lambda()
                        .set(Department::getHasDelete, null)
                        .eq(Department::getExtCorpId, extCorpId)
                        .notIn(Department::getExtId, existsExtIds)
                );
            } else {
                update(new UpdateWrapper<Department>()
                        .lambda()
                        .set(Department::getHasDelete, null)
                        .eq(Department::getExtCorpId, extCorpId));
            }

            //批量修改
            if (ListUtils.isNotEmpty(updateList)) {
                departments.addAll(updateList);
                updateBatchById(updateList);
            }


            //批量新增
            if (ListUtils.isNotEmpty(saveList)) {
                saveBatch(saveList);
                departments.addAll(saveList);
            }

            //删除不存在的部门，及用户部门关联
            List<String> exitIds = departments.stream().map(Department::getId).collect(Collectors.toList());
            List<String> allIds = Optional.ofNullable(list()).orElse(new ArrayList<>()).stream().filter(department -> extCorpId.equals(department.getExtCorpId())).map(Department::getId).collect(Collectors.toList());
            allIds.removeAll(exitIds);
            if (ListUtils.isNotEmpty(allIds)) {
                staffDepartmentService.removeByDepartmentIds(allIds);
                removeByIds(allIds);
            }


        } catch (WxErrorException wx) {
            log.error("同步部门数据,调用企业微信接口异常：企业ID:【{}】,异常信息:", extCorpId, wx);
            throw new BaseException(ErrorMsgEnum.CODE_90001);
        } catch (Exception e) {
            log.error("同步部门数据,系统异常：企业ID:【{}】,异常信息:", extCorpId, e);
            throw new BaseException(ErrorMsgEnum.CODE_90001);
        }


        return departments;
    }

    @Override
    public List<DepartmentTreeVO> getTree(String extCorpId) {
        List<DepartmentTreeVO> results = new ArrayList<>();
        List<Department> list = list(new LambdaQueryWrapper<Department>().eq(Department::getExtCorpId, extCorpId));
        List<DepartmentTreeVO> treeVOS = new ArrayList<>();
        if (ListUtils.isNotEmpty(list)) {
            list.forEach(department -> {
                DepartmentTreeVO departmentTreeVO = new DepartmentTreeVO();
                BeanUtils.copyProperties(department, departmentTreeVO);
                treeVOS.add(departmentTreeVO);
            });
        }


        //如果没有根部门造一个
        List<Long> extIds = Optional.of(treeVOS).orElse(new ArrayList<>()).stream().map(DepartmentTreeVO::getExtId).collect(Collectors.toList());
        if (!extIds.contains(1L)) {
            DepartmentTreeVO departmentTreeVO = new DepartmentTreeVO();
            BeanUtils.copyProperties(getRootDepartment(extCorpId), departmentTreeVO);
            List<DepartmentTreeVO> treeList = TreeUtil.createTreeList(treeVOS);
            if (ListUtils.isNotEmpty(treeList)) {
                treeList.forEach(tree -> tree.setExtParentId(departmentTreeVO.getExtId()));
                departmentTreeVO.setChildren(treeList);
            }
            results.add(departmentTreeVO);
        } else {
            results = TreeUtil.createTreeList(treeVOS);
        }
        log.debug(JSONObject.toJSONString(results));
        sortTree(results);
        return results;
    }

    /**
     * 排序
     *
     * @param treeList
     */
    private void sortTree(List<DepartmentTreeVO> treeList) {
        if (ListUtils.isNotEmpty(treeList)) {
            treeList.sort(Comparator.comparing(DepartmentTreeVO::getOrder).reversed());
            treeList.forEach(tree -> sortTree(tree.getChildren()));
        }
    }

    @Override
    public Department getRootDepartment(String extCorpId) {
        String corpName = corpAccreditService.getCorpNameByCorpId(extCorpId);
        Department department = new Department();
        return department.setId(Constants.SYS_ROOT_DEPARTMENT.toString())
                .setStaffNum(staffService.count(new LambdaQueryWrapper<Staff>().eq(Staff::getExtCorpId, extCorpId)))
                .setName(corpName)
                .setExtId(Constants.SYS_ROOT_DEPARTMENT);
    }

    @Override
    public List<DepartmentTreeVO> getTreeWithStaffMap(String extCorpId, String staffName, String excludeRoleKey) {
        List<DepartmentTreeVO> tree = getTree(extCorpId);

        //获取所有员工-部门关联
        List<StaffDepartment> staffDepartments = staffDepartmentService.list(new LambdaQueryWrapper<StaffDepartment>()
                .eq(StaffDepartment::getExtCorpId, extCorpId));

        //获取拥有指定角色的用户
        List<String> hasRoleExtStaffIds = sysRoleService.getExtStaffIdsByRoleKey(extCorpId, excludeRoleKey);

        //查询用户列表
        Map<String, List<Staff>> departmentIdAndStaffIds = new HashMap<>();
        List<Staff> staffList;
        if (StringUtils.isNotBlank(staffName)) {
            staffList = Optional.ofNullable(staffService.list(new LambdaQueryWrapper<Staff>()
                    .eq(Staff::getExtCorpId, extCorpId)
                    .like(Staff::getName, staffName)
            )).orElse(new ArrayList<>());

        } else {
            staffList = Optional.ofNullable(staffService.list(new LambdaQueryWrapper<Staff>()
                    .eq(Staff::getExtCorpId, extCorpId))).orElse(new ArrayList<>());
        }

        if (StringUtils.isNotBlank(excludeRoleKey)) {
            staffList = staffList.stream().filter(staff -> !hasRoleExtStaffIds.contains(staff.getExtId())).collect(Collectors.toList());
        }

        Map<String, Staff> staffIdAndStaffsMap = staffList.stream().collect(Collectors.toMap(Staff::getId, o -> o));


        //给部门列表设置员工列表
        Optional.ofNullable(staffDepartments).orElse(new ArrayList<>()).forEach(staffDepartment -> {
            List<Staff> staffs = Optional.ofNullable(departmentIdAndStaffIds.get(staffDepartment.getDepartmentId())).orElse(new ArrayList<>());
            Staff staff = staffIdAndStaffsMap.get(staffDepartment.getStaffId());
            if (staff != null) {
                staffs.add(staff);
            }
            departmentIdAndStaffIds.put(staffDepartment.getDepartmentId(), staffs);
        });
        setStaffList(tree, departmentIdAndStaffIds);

        //设置根部门用户(没有关联部门的就挂在根部门下面)
        List<String> staffIds = Optional.ofNullable(staffDepartments).orElse(new ArrayList<>()).stream().map(StaffDepartment::getStaffId).distinct().collect(Collectors.toList());
        List<Staff> rootStaffList = staffList.stream().filter(staff -> !staffIds.contains(staff.getId())).collect(Collectors.toList());
        tree.forEach(departmentTreeVO -> {
            if (Constants.SYS_ROOT_DEPARTMENT.equals(departmentTreeVO.getExtId())) {
                departmentTreeVO.setStaffList(rootStaffList);
            }
        });

        //递归设置员工列表(将子集的员工都挂到父级)
        tree.forEach(this::setStaffList);

        return tree;
    }

    /**
     * 递归设置员工列表（将子集的员工都挂到父级）
     *
     * @param departmentTreeVO
     * @return void
     * @author xuxh
     * @date 2022/5/30 17:18
     */
    private void setStaffList(DepartmentTreeVO departmentTreeVO) {

        //获取本级及子级的员工列表
        List<Staff> staffList = getStaffList(departmentTreeVO);

        //去重，排序
        List<String> staffIds = new ArrayList<>();
        List<Staff> result = new ArrayList<>();
        Optional.ofNullable(staffList).orElse(new ArrayList<>()).forEach(staff -> {
            if (!staffIds.contains(staff.getId())) {
                result.add(staff);
                staffIds.add(staff.getId());
            }
        });
        result.sort(Comparator.comparing(Staff::getCreatedAt).reversed());
        departmentTreeVO.setStaffList(result);

        //遍历设置子集的员工列表
        Optional.ofNullable(departmentTreeVO.getChildren()).orElse(new ArrayList<>()).forEach(this::setStaffList);
    }

    private List<Staff> getStaffList(DepartmentTreeVO departmentTreeVO) {
        List<Staff> staffList = Optional.ofNullable(departmentTreeVO.getStaffList()).orElse(new ArrayList<>());
        Optional.ofNullable(departmentTreeVO.getChildren()).orElse(new ArrayList<>()).forEach(treeVo -> {
            List<Staff> staffs = getStaffList(treeVo);
            if (ListUtils.isNotEmpty(staffs)) {
                staffList.addAll(staffs);
            }
        });
        return staffList;
    }

    private void setStaffList(List<DepartmentTreeVO> tree, Map<String, List<Staff>> departmentIdAndStaffIds) {
        Optional.ofNullable(tree).orElse(new ArrayList<>()).forEach(departmentTreeVO -> {
            departmentTreeVO.setStaffList(departmentIdAndStaffIds.get(departmentTreeVO.getId()));
            setStaffList(departmentTreeVO.getChildren(), departmentIdAndStaffIds);
        });
    }

    public List<Long> getChildIdList(String extCorpId, List<Long> extParentIdList, List<Long> childIdList) {
        if (ListUtils.isNotEmpty(extParentIdList)) {
            List<Long> result = this.baseMapper.queryChildIdList(extCorpId, extParentIdList);
            if (ListUtils.isNotEmpty(result)) {
                childIdList.addAll(result);
                // 递归调用当前方法，直至获取所有子级id集合
                getChildIdList(extCorpId, result, childIdList);
            }
        }
        childIdList.addAll(extParentIdList);
        return childIdList.stream().distinct().collect(Collectors.toList());
    }

    @Override
    public List<Long> getChildIdList(String extCorpId, List<Long> extParentIdList) {
        return getChildIdList(extCorpId, extParentIdList, new ArrayList<>());
    }


}
