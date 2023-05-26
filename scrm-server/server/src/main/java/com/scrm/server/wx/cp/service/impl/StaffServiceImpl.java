package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.StaffExportDTO;
import com.scrm.api.wx.cp.dto.StaffPageDTO;
import com.scrm.api.wx.cp.dto.StaffSaveDTO;
import com.scrm.api.wx.cp.dto.StaffUpdateDTO;
import com.scrm.api.wx.cp.entity.*;
import com.scrm.api.wx.cp.vo.SimpleStaffVO;
import com.scrm.api.wx.cp.vo.StaffExportVO;
import com.scrm.api.wx.cp.vo.StaffVO;
import com.scrm.common.constant.Constants;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.exception.ErrorMsgEnum;
import com.scrm.common.util.EasyPoiUtils;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.config.WxCpTpConfiguration;
import com.scrm.server.wx.cp.entity.WxResignedStaffGroupChat;
import com.scrm.server.wx.cp.feign.CpTpFeign;
import com.scrm.server.wx.cp.feign.dto.WxCpUserRes;
import com.scrm.server.wx.cp.mapper.StaffMapper;
import com.scrm.server.wx.cp.service.*;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpUserService;
import me.chanjar.weixin.cp.api.impl.WxCpUserServiceImpl;
import me.chanjar.weixin.cp.bean.WxCpTpAdmin;
import me.chanjar.weixin.cp.bean.WxCpTpContactSearch;
import me.chanjar.weixin.cp.bean.WxCpTpContactSearchResp;
import me.chanjar.weixin.cp.bean.WxCpUser;
import me.chanjar.weixin.cp.bean.user.WxCpDeptUserResult;
import me.chanjar.weixin.cp.tp.service.WxCpTpContactService;
import me.chanjar.weixin.cp.tp.service.WxCpTpService;
import me.chanjar.weixin.cp.tp.service.impl.WxCpTpContactServiceImpl;
import me.chanjar.weixin.cp.tp.service.impl.WxCpTpServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;


/**
 * 员工服务实现类
 *
 * @author xxh
 * @since 2021-12-16
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class StaffServiceImpl extends ServiceImpl<StaffMapper, Staff> implements IStaffService {

    @Autowired
    private IDepartmentService departmentService;

    @Autowired
    private IStaffDepartmentService staffDepartmentService;

    @Autowired
    private WxCpConfiguration wxCpConfiguration;

    @Autowired
    private WxCpTpConfiguration wxCpTpConfiguration;

    @Autowired
    private IWxCustomerStaffService customerStaffService;

    @Autowired
    private IWxCustomerInfoService customerInfoService;

    @Autowired
    private IWxCustomerStaffTagService customerStaffTagService;

    @Autowired
    private IWxCustomerService customerService;

    @Autowired
    private IBrJourneyStageCustomerService journeyStageCustomerService;




    @Autowired
    private IWxResignedStaffCustomerService resignedStaffCustomerService;

    @Autowired
    private IWxResignedStaffGroupChatService resignedStaffGroupChatService;

    @Autowired
    private IWxGroupChatService groupChatService;

    @Autowired
    private IBrCorpAccreditService accreditService;

    @Autowired
    private CpTpFeign cpTpFeign;

    @Autowired
    private ISysRoleStaffService roleStaffService;

    @Override
    public IPage<StaffVO> pageList(StaffPageDTO dto) {

        List<String> extIds = null;
        if (StringUtils.isNotBlank(dto.getName())) {
            extIds = contactSearch(dto.getExtCorpId(), dto.getName());
            if (ListUtils.isEmpty(extIds)) {
                return new Page<>();
            }
        }

        LambdaQueryWrapper<Staff> wrapper = new QueryWrapper<Staff>().lambda()
                .eq(Staff::getExtCorpId, dto.getExtCorpId())
                .eq(dto.getStatus() != null, Staff::getStatus, dto.getStatus())
                .in(ListUtils.isNotEmpty(extIds), Staff::getExtId, extIds)
                .ne(dto.getExcludeMyself() != null && dto.getExcludeMyself(), Staff::getId, JwtUtil.getUserId())
                .like(StringUtils.isNotBlank(dto.getAlias()), Staff::getAlias, dto.getAlias())
                .orderByDesc(Staff::getCreatedAt);

        if (StringUtils.isNotBlank(dto.getDepartmentId())) {
            Department rootDepartment = departmentService.getRootDepartment(dto.getExtCorpId());
            if (!rootDepartment.getId().equals(dto.getDepartmentId())) {
                Department department = departmentService.checkExists(dto.getDepartmentId());
                List<Long> departmentExtIds = departmentService.getChildIdList(dto.getExtCorpId(), Collections.singletonList(department.getExtId()));
                List<String> staffIds = Optional.ofNullable(staffDepartmentService.list(new LambdaQueryWrapper<StaffDepartment>()
                                .in(StaffDepartment::getExtDepartmentId, departmentExtIds))).orElse(new ArrayList<>()).stream()
                        .map(StaffDepartment::getStaffId).collect(Collectors.toList());
                if (ListUtils.isEmpty(staffIds)) {
                    return new Page<>();
                }
                //TODO 待优化
                wrapper.in(Staff::getId, staffIds);
            }

        }

        IPage<Staff> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }

    @Override
    public StaffVO findById(String id) {
        return translation(checkExists(id));
    }

    @Override
    public Staff find(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        return baseMapper.findOne(id);
    }

    @Override
    public Staff find(String extCorpId, String extId) {
        if (StringUtils.isBlank(extId) || StringUtils.isBlank(extCorpId)) {
            return null;
        }
        return baseMapper.findByExtCorpIdAndExtId(extCorpId, extId);
    }


    @Override
    public Staff save(StaffSaveDTO dto) throws WxErrorException {

        //校验数据
        String userId = UUID.get32UUID();


        List<Department> departments = new ArrayList<>();
        String deptIds = dto.getDeptIds();
        if (StringUtils.isNotBlank(deptIds)) {
            Optional.ofNullable(JSON.parseArray(deptIds, Long.class)).orElse(new ArrayList<>())
                    .forEach(deptId -> departments.add(departmentService.checkExists(deptId, dto.getExtCorpId())));
        }

        //封装数据
        Staff staff = new Staff();
        BeanUtils.copyProperties(dto, staff);
        staff.setCreatedAt(new Date());
        staff.setExtId(userId);
        staff.setId(UUID.get32UUID());

        //入库

        //1.新增成员
        save(staff);

        //2.处理员工-部门数据
        handlerDepartmentData(staff, departments, false);


        //调用企业微信接口新增员工
        WxCpUser wxCpUser = new WxCpUser();
        BeanUtils.copyProperties(staff, wxCpUser);
        wxCpUser.setUserId(userId);
        wxCpUser.setDepartIds(JSON.parseArray(deptIds, Long.class).toArray(new Long[0]));
        WxCpUserService userService = new WxCpUserServiceImpl(wxCpConfiguration.getAddressBookWxCpService());
        userService.create(wxCpUser);

        return staff;
    }

    @Override
    public Staff update(StaffUpdateDTO dto) throws WxErrorException {

        //校验参数
        Staff old = checkExists(dto.getId());
        List<Department> departments = new ArrayList<>();
        String deptIds = dto.getDeptIds();
        if (StringUtils.isNotBlank(deptIds)) {
            Optional.ofNullable(JSON.parseArray(deptIds, Long.class)).orElse(new ArrayList<>())
                    .forEach(deptId -> departments.add(departmentService.checkExists(deptId, dto.getExtCorpId())));
        }


        //封装数据
        Staff staff = new Staff();
        BeanUtils.copyProperties(dto, staff);
        staff.setCreatedAt(old.getCreatedAt())
                .setUpdatedAt(new Date());

        //入库

        //1.修改成员
        updateById(staff);

        //2.处理员工-部门数据
        handlerDepartmentData(staff, departments, true);


        //调用企业微信接口修改用户
        WxCpUser wxCpUser = new WxCpUser();
        BeanUtils.copyProperties(staff, wxCpUser);
        wxCpUser.setUserId(staff.getExtId());
        WxCpUserService userService = new WxCpUserServiceImpl(wxCpConfiguration.getAddressBookWxCpService());
        userService.update(wxCpUser);

        return staff;
    }

    /**
     * 处理员工-部门数据
     *
     * @param staff       员工
     * @param departments 部门
     * @param isUpdate    是否为修改
     */
    private void handlerDepartmentData(Staff staff, List<Department> departments, boolean isUpdate) {

        //如果为修改，将所在部门数量减1操作,删除当前员工的关联数据
        if (isUpdate) {
            List<String> departmentIds = Optional.ofNullable(staffDepartmentService.list(new LambdaQueryWrapper<StaffDepartment>()
                    .select(StaffDepartment::getDepartmentId)
                    .eq(StaffDepartment::getStaffId, staff.getId())
            )).orElse(new ArrayList<>()).stream().map(StaffDepartment::getDepartmentId).collect(Collectors.toList());

            if (ListUtils.isNotEmpty(departmentIds)) {
                List<Department> departmentList = departmentService.listByIds(departmentIds);
                if (ListUtils.isNotEmpty(departmentList)) {
                    departmentService.listByIds(departmentIds).forEach(department ->
                            department.setStaffNum(Optional.ofNullable(department.getStaffNum()).orElse(0L) - 1)
                    );
                    departmentService.updateBatchById(departmentList);
                }

            }

            staffDepartmentService.remove(new LambdaQueryWrapper<StaffDepartment>().eq(StaffDepartment::getStaffId, staff.getId()));
        }

        //新增用户数据关联
        if (ListUtils.isNotEmpty(departments)) {
            List<StaffDepartment> staffDepartmentList = new ArrayList<>();
            List<Department> departmentList = new ArrayList<>();
            departments.forEach(department -> {
                        staffDepartmentList.add(new StaffDepartment().setExtCorpId(staff.getExtCorpId())
                                .setStaffId(staff.getId())
                                .setIsLeader(0)
                                .setDepartmentId(department.getId())
                                .setExtDepartmentId(department.getExtId())
                                .setExtStaffId(staff.getExtId())
                        );
                        departmentList.add(department.setStaffNum(Optional.of(staffDepartmentService.count(new LambdaQueryWrapper<StaffDepartment>().eq(StaffDepartment::getDepartmentId, department.getId()))).orElse(0L) + 1L));
                    }

            );
            staffDepartmentService.saveBatch(staffDepartmentList);
            departmentService.updateBatchById(departmentList);
        }


    }

    @Override
    public void batchDelete(BatchDTO<String> dto) throws WxErrorException {
        batchDelete(dto, true);
    }

    @Override
    public void batchDelete(BatchDTO<String> dto, boolean needDelete) throws WxErrorException {

        //校验参数
        List<Staff> staffList = Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).stream().map(this::checkExists).collect(Collectors.toList());
        if (ListUtils.isEmpty(staffList)) {
            return;
        }

        //处理离职继承逻辑

        //将删除的员工的群聊置为跟进人离职状态,列入客户离职继承列表
        List<String> staffExtIds = staffList.stream().map(Staff::getExtId).collect(Collectors.toList());
        List<WxGroupChat> list = groupChatService.list(new LambdaQueryWrapper<WxGroupChat>()
                .eq(WxGroupChat::getExtCorpId, staffList.get(0).getExtCorpId())
                .in(WxGroupChat::getOwner, staffExtIds)
        );
        List<WxResignedStaffGroupChat> resignedStaffGroupChatList = new ArrayList<>();
        Optional.ofNullable(list).orElse(new ArrayList<>()).forEach(groupChat -> {
            groupChat.setStatus(WxGroupChat.STATUS_RESIGN)
                    .setUpdatedAt(new Date());
            resignedStaffGroupChatList.add(new WxResignedStaffGroupChat()
                    .setId(UUID.get32UUID())
                    .setCreateTime(new Date())
                    .setExtCorpId(groupChat.getExtCorpId())
                    .setGroupChatExtId(groupChat.getExtChatId())
                    .setHandoverStaffExtId(groupChat.getOwner())
                    .setHandoverStaffName(groupChat.getOwnerName()));
        });
        if (ListUtils.isNotEmpty(list)) {
            groupChatService.updateBatchById(list);
        }
        if (ListUtils.isNotEmpty(resignedStaffGroupChatList)) {
            resignedStaffGroupChatService.saveBatch(resignedStaffGroupChatList);
        }

        //修改部门员工数量
        List<String> departmentIds = Optional.ofNullable(staffDepartmentService.list(new LambdaQueryWrapper<StaffDepartment>().in(StaffDepartment::getStaffId, dto.getIds())))
                .orElse(new ArrayList<>()).stream().map(StaffDepartment::getDepartmentId).distinct().collect(Collectors.toList());
        if (ListUtils.isNotEmpty(departmentIds)) {
            List<Department> departments = departmentService.listByIds(departmentIds);
            Optional.ofNullable(departments).orElse(new ArrayList<>()).forEach(department -> department.setStaffNum(Optional.ofNullable(department.getStaffNum()).orElse(0L) - 1));
        }

        //删除员工
        removeByIds(dto.getIds());

        //删除员工-部门关联
        staffDepartmentService.removeByStaffIds(dto.getIds());

        //删除客户相关联系（删除员工-客户关联，员工-客户-详情，员工-客户标签）
        deleteCustomerAssociate(staffList.get(0).getExtCorpId(), staffList);


        if (needDelete) {
            //调用企业微信删除员工
            WxCpUserService userService = new WxCpUserServiceImpl(wxCpConfiguration.getAddressBookWxCpService());
            List<String> extIds = staffList.stream().filter(staff -> staff.getHasDelete() != null).map(Staff::getExtId).filter(StringUtils::isNotBlank).distinct().collect(Collectors.toList());
            if (ListUtils.isNotEmpty(extIds)) {
                userService.delete(extIds.toArray(new String[0]));
            }
        }
    }

    /**
     * 删除客户相关联系（删除员工-客户关联，员工-客户-详情，员工-客户标签）
     *
     * @param extCorpId
     * @param staffList
     */
    private void deleteCustomerAssociate(String extCorpId, List<Staff> staffList) {
        if (ListUtils.isEmpty(staffList)) {
            return;
        } else {
            staffList = staffList.stream().filter(Objects::nonNull).collect(Collectors.toList());
            if (ListUtils.isEmpty(staffList)) {
                return;
            }
        }
        List<String> staffExtIds = staffList.stream().map(Staff::getExtId).collect(Collectors.toList());

        if (ListUtils.isNotEmpty(staffExtIds)) {

            //员工-客户-详情
            customerInfoService.remove(new LambdaQueryWrapper<WxCustomerInfo>()
                    .eq(WxCustomerInfo::getExtCorpId, extCorpId)
                    .in(WxCustomerInfo::getExtStaffId, staffExtIds));

            //员工-客户标签
            customerStaffTagService.remove(new LambdaQueryWrapper<WxCustomerStaffTag>()
                    .eq(WxCustomerStaffTag::getExtCorpId, extCorpId)
                    .in(WxCustomerStaffTag::getExtStaffId, staffExtIds));

            List<WxCustomerStaff> customerStaffs = customerStaffService.list(new LambdaQueryWrapper<WxCustomerStaff>()
                    .eq(WxCustomerStaff::getExtCorpId, extCorpId)
                    .in(WxCustomerStaff::getExtStaffId, staffExtIds));

            if (ListUtils.isNotEmpty(customerStaffs)) {
                List<String> customerStaffIds = customerStaffs.stream().map(WxCustomerStaff::getId).collect(Collectors.toList());

                //删除员工-客户关联
                customerStaffService.removeByIds(customerStaffIds);

                //如果这个客户跟进人小于1，则把这个客户移除
                List<String> extCustomerIds = customerStaffs.stream().map(WxCustomerStaff::getExtCustomerId).distinct().collect(Collectors.toList());
                Optional.of(extCustomerIds).orElse(new ArrayList<>()).forEach(extCustomerId -> {
                    if (OptionalLong.of(customerStaffService.count(new LambdaQueryWrapper<WxCustomerStaff>().eq(WxCustomerStaff::getExtCorpId, extCorpId)
                            .in(WxCustomerStaff::getExtCustomerId, extCustomerIds))).orElse(0) < 1) {
                        WxCustomer customer = customerService.checkExists(extCorpId, extCustomerId);
                        if (customer != null) {
                            customerService.removeById(customer.getId());
                        }

                    }
                });


            }

        }


    }


    public StaffVO translation(Staff staff) {
        StaffVO vo = new StaffVO();
        if (staff != null) {
            BeanUtils.copyProperties(staff, vo);
            List<String> departmentIds = Optional.ofNullable(staffDepartmentService.list(new LambdaQueryWrapper<StaffDepartment>().eq(StaffDepartment::getStaffId, staff.getId())))
                    .orElse(new ArrayList<>()).stream().map(StaffDepartment::getDepartmentId).collect(Collectors.toList());
            if (ListUtils.isNotEmpty(departmentIds)) {
                List<Department> departments = Optional.ofNullable(departmentService.listByIds(departmentIds)).orElse(new ArrayList<>());
                departments.sort(Comparator.comparingLong(Department::getOrder).reversed());
                vo.setDepartmentList(departments);
            } else {
                vo.setDepartmentList(Collections.singletonList(departmentService.getRootDepartment(staff.getExtCorpId())));
            }
        }
        return vo;
    }

    @Override
    public SimpleStaffVO getSimpleInfo(String corpId, String id, String extId) {

        SimpleStaffVO result = new SimpleStaffVO();

        //群主消息
        Staff staff = getOne(new QueryWrapper<Staff>().lambda()
                .eq(Staff::getExtCorpId, corpId)
                .eq(StringUtils.isNotBlank(id), Staff::getId, id)
                .eq(StringUtils.isNotBlank(extId), Staff::getExtId, extId));

        if (staff == null) {
            return result;
        }

        result.setName(staff.getName());
        result.setAvatarUrl(staff.getAvatarUrl());

        //部门
        List<StaffDepartment> staffDeptList = staffDepartmentService.list(new QueryWrapper<StaffDepartment>().lambda()
                .eq(StaffDepartment::getExtCorpId, corpId)
                .eq(StaffDepartment::getStaffId, staff.getId()));

        if (ListUtils.isNotEmpty(staffDeptList)) {

            List<String> deptIds = staffDeptList.stream().map(StaffDepartment::getDepartmentId).collect(Collectors.toList());
            List<String> depts = departmentService.list(new QueryWrapper<Department>().lambda()
                            .eq(Department::getExtCorpId, corpId)
                            .in(Department::getId, deptIds))
                    .stream().map(Department::getName).collect(Collectors.toList());

            result.setDeptCN(StringUtils.join(depts));

        }
        return result;
    }

    @Override
    public List<Staff> listByExtIds(String corpId, List<String> extIds) {
        return list(new QueryWrapper<Staff>().lambda()
                .eq(Staff::getExtCorpId, corpId)
                .in(Staff::getExtId, extIds));
    }

    @Override
    public List<String> getStaffIdsByDepts(String corpId, List<Long> departmentIds, List<String> staffIds) {
        List<String> staffIdList = new ArrayList<>();
        //选择了根部门，查所有员工
        if (ListUtils.isNotEmpty(departmentIds) && departmentIds.contains(Constants.SYS_ROOT_DEPARTMENT)) {
            return Optional.ofNullable(list(new QueryWrapper<Staff>().lambda()
                            .select(Staff::getExtId)
                            .eq(Staff::getExtCorpId, corpId))).orElse(new ArrayList<>()).stream().map(Staff::getExtId)
                    .collect(Collectors.toList());
        }

        if (ListUtils.isNotEmpty(staffIds)) {
            staffIdList.addAll(staffIds);
        }

        //根据部门筛选当前及所有子部门员工id
        if (ListUtils.isNotEmpty(departmentIds)) {
            List<Long> childIdList = departmentService.getChildIdList(corpId, departmentIds);
            List<String> staffIdsByDept = Optional.ofNullable(staffDepartmentService.list(new LambdaQueryWrapper<StaffDepartment>()
                            .in(StaffDepartment::getExtDepartmentId, childIdList)
                            .eq(StaffDepartment::getExtCorpId, corpId)))
                    .orElse(new ArrayList<>()).stream().map(StaffDepartment::getExtStaffId).collect(Collectors.toList());
            if (ListUtils.isNotEmpty(staffIdsByDept)) {
                staffIdList.addAll(staffIdsByDept);
            }
        }
        return staffIdList.stream().distinct().collect(Collectors.toList());
    }


    @Override
    public Staff checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        Staff byId = getById(id);
        if (byId == null) {
            throw new BaseException("员工不存在");
        }
        return byId;
    }


    @Override
    public Staff checkExists(String extId, String extCorpId) {
        if (StringUtils.isBlank(extId)) {
            return null;
        }
        Staff staff = getOne(new QueryWrapper<Staff>().lambda().eq(Staff::getExtId, extId).eq(Staff::getExtCorpId, extCorpId));
        if (staff == null) {
            throw new BaseException("员工不存在");
        }
        return staff;
    }

    @Override
    public Boolean sync(String extCorpId) {

        log.info("开始同步[{}]的员工信息", extCorpId);

        Boolean syncRes = false;
        try {
            //先根据授权部门去同步
            syncRes = syncByDept(extCorpId);
        } catch (Exception e) {
            log.error("[{}]根据部门同步员工信息出错，", extCorpId, e);
        }


        //根据授权信息来同步
        //syncByAccredit(extCorpId);

        //刷新管理员
//        updateAdmin(extCorpId);

        return syncRes;

    }

    //根据授权信息来同步
    private void syncByAccredit(String extCorpId) {

        //根据授权信息去同步
        List<String> allowUserIds;
        try {
            allowUserIds = accreditService.getByCorpId(extCorpId).getAuthInfo().getAgents().get(0).getPrivilege().getAllowUsers();
            if (ListUtils.isEmpty(allowUserIds)) {
                return;
            }
        } catch (NullPointerException e) {
            log.error("根据授权信息去同步空指针异常，[{}]", extCorpId);
            return;
        }

        //根据授权人去同步
        List<String> existStaffIdList = list(new QueryWrapper<Staff>().lambda()
                .select(Staff::getExtId)
                .eq(Staff::getExtCorpId, extCorpId)
                .in(Staff::getExtId, allowUserIds))
                .stream().map(Staff::getExtId).collect(Collectors.toList());

        //找到根据部门同步后没有的员工id
        List<String> noExistStaffIds = allowUserIds.stream().filter(e -> !existStaffIdList.contains(e)).collect(Collectors.toList());

        if (ListUtils.isEmpty(noExistStaffIds)) {
            return;
        }

        String accessToken = null;
        try {
            accessToken = WxCpConfiguration.getWxCpService().getAccessToken();
        } catch (WxErrorException e) {
            log.error("获取[{}]的accessToken异常，", extCorpId, e);
            return;
        }

        String finalAccessToken = accessToken;
        noExistStaffIds.forEach(staffId -> {
            WxCpUserRes cpUser = cpTpFeign.get(finalAccessToken, staffId);
            Staff staff = new Staff()
                    .setId(UUID.get32UUID())
                    .setExtCorpId(extCorpId)
                    .setExtId(staffId)
                    .setName(cpUser.getName())
                    .setMobile(cpUser.getMobile())
                    .setExternalPosition(cpUser.getExternalPosition())
//                    .setGender(JSON.toJSONString(cpUser.getGender()))
                    .setEmail(cpUser.getEmail())
                    .setIsAdmin(false)
                    .setAvatarUrl(cpUser.getAvatar())
                    .setTelephone(cpUser.getTelephone())
                    .setAlias(cpUser.getAlias())
                    .setStatus(cpUser.getStatus())
                    .setQrCodeUrl(cpUser.getQrCode())
                    .setAddress(cpUser.getAddress());

            save(staff);
        });

    }

    private Boolean syncByDept(String extCorpId) {

        if (StringUtils.isBlank(extCorpId)) {
            return true;
        }

        //同步部门数据
        List<Department> departments = departmentService.sync(extCorpId);

        Map<String, String> departExtIdStrAndIdMap = Optional.of(departments).orElse(new ArrayList<>()).stream()
                .collect(Collectors.toMap(o -> o.getExtId().toString(), Department::getId));

        try {

            //同步员工数据
            WxCpUserService userService = new WxCpUserServiceImpl(wxCpConfiguration.getAddressBookWxCpService());
            WxCpDeptUserResult userListId = userService.getUserListId(null, 10000);
            Map<String, List<Long>> userDeptMap = userListId.getDeptUser().stream().collect(Collectors.groupingBy(WxCpDeptUserResult.DeptUserList::getUserId, Collectors.mapping(WxCpDeptUserResult.DeptUserList::getDepartment, Collectors.toList())));
            log.info("【同步员工】部门数量：{}，员工数量：{}", departments.size(), userListId.getDeptUser().size());

            List<WxCpUser> wxCpUsers = new ArrayList<>(userDeptMap.size());
            userDeptMap.forEach((u, d) -> {
                WxCpUser wxCpUser = new WxCpUser();
                wxCpUser.setUserId(u);
                wxCpUser.setName(u);
                wxCpUser.setDepartIds(d.toArray(new Long[0]));
                wxCpUsers.add(wxCpUser);
            });

            //去除重复的数据
            Map<String, String> map = new HashMap<>();
            Iterator<WxCpUser> iterator = wxCpUsers.iterator();
            while (iterator.hasNext()) {
                WxCpUser next = iterator.next();
                if (StringUtils.isBlank(map.get(next.getUserId()))) {
                    map.put(next.getUserId(), next.getUserId());
                } else {
                    iterator.remove();
                }
            }

            List<String> exitStaffIds = new ArrayList<>();
            if (ListUtils.isNotEmpty(wxCpUsers)) {
                wxCpUsers.forEach(user -> {
                    try {
                        List<StaffDepartment> staffDepartmentList = new ArrayList<>();

                        Staff staff = new Staff();
                        BeanUtils.copyProperties(user, staff);
                        staff.setAvatarUrl(user.getAvatar())
                                .setGender(user.getGender() == null ? "0" : user.getGender().getCode());

                        Staff old = getOne(new QueryWrapper<Staff>().lambda().eq(Staff::getExtId, user.getUserId()).eq(Staff::getExtCorpId, extCorpId));
                        if (old != null) {
                            staff.setId(old.getId())
                                    .setCreatedAt(old.getCreatedAt())
                                    .setIsAdmin(old.getIsAdmin());
                        } else {
                            staff.setId(UUID.get32UUID())
                                    .setCreatedAt(new Date());
                        }

                        staff.setExtId(user.getUserId())
                                .setExtCorpId(extCorpId)
                                .setDeptIds(Arrays.toString(Optional.ofNullable(user.getDepartIds()).orElse(new Long[]{})));

                        AtomicInteger num = new AtomicInteger();
                        Arrays.asList(Optional.ofNullable(user.getDepartIds()).orElse(new Long[]{})).forEach(departId -> {

                            Integer[] isLeaderInDept = Optional.ofNullable(user.getIsLeaderInDept()).orElse(new Integer[]{});
                            StaffDepartment staffDepartment = new StaffDepartment()
                                    .setStaffId(staff.getId())
                                    .setExtStaffId(staff.getExtId())
                                    .setExtDepartmentId(departId)
                                    .setDepartmentId(departExtIdStrAndIdMap.get(departId.toString()))
                                    .setExtCorpId(extCorpId)
                                    .setIsLeader(isLeaderInDept.length < num.get() + 1 ? null : user.getIsLeaderInDept()[num.get()])
//                                    .setOrder(user.getOrders()[num.get()])
                                    ;
                            num.set(num.get() + 1);
                            staffDepartmentList.add(staffDepartment);
                        });

                        if (old != null) {
                            updateById(staff);
                            //删除旧的关联
                            staffDepartmentService.remove(new LambdaQueryWrapper<StaffDepartment>().eq(StaffDepartment::getStaffId, staff.getId()));
                        } else {
                            save(staff);
                        }

                        exitStaffIds.add(staff.getId());
                        staffDepartmentService.saveBatch(staffDepartmentList);

                    } catch (Exception e) {
                        log.error("同步员工信息失败，企业ID：【{}】,企业微信用户信息：【{}】,异常信息：【{}】", extCorpId, user.toJson(), e);
                    }

                });
            }

            //删除不存在的员工
            List<Staff> staff = Optional.ofNullable(list(new LambdaQueryWrapper<Staff>().eq(Staff::getExtCorpId, extCorpId))).orElse(new ArrayList<>());
            Map<String, Staff> staffIdAndStaffMap = staff.stream().collect(Collectors.toMap(Staff::getId, o -> o));
            List<String> allIds = staff.stream().map(Staff::getId).collect(Collectors.toList());
            allIds.removeAll(exitStaffIds);
            if (ListUtils.isNotEmpty(allIds)) {
                staffDepartmentService.removeByStaffIds(allIds);
                removeByIds(allIds);
                List<Staff> staffList = allIds.stream().map(staffIdAndStaffMap::get).collect(Collectors.toList());
                log.info("删除用户列表：【{}】", allIds);
                //删除客户相关联系（删除员工-客户关联，员工-客户-详情，员工-客户标签）
                deleteCustomerAssociate(extCorpId, staffList);
            }

            //更新部门人数
            Optional.ofNullable(departmentService.list()).orElse(new ArrayList<>()).forEach(department -> {
                Long staffNum = Optional.ofNullable(staffDepartmentService.queryDepartmentStaffNum(extCorpId, department.getExtId())).orElse(0L);
                departmentService.updateById(department.setStaffNum(staffNum));
            });


            //刷新员工客户数量
            Optional.ofNullable(customerStaffService.countGroupByStaffExtId(extCorpId)).orElse(new ArrayList<>()).forEach(countVO ->
                    update(new LambdaUpdateWrapper<Staff>().eq(Staff::getExtCorpId, extCorpId)
                            .eq(Staff::getExtId, countVO.getExtStaffId())
                            .set(Staff::getCustomerCount, Optional.ofNullable(countVO.getTotal()).orElse(0))));

        } catch (WxErrorException wx) {
            log.error("同步员工数据,调用企业微信接口异常：企业ID:【{}】,异常信息:【{}】", extCorpId, wx);
            throw new BaseException(ErrorMsgEnum.CODE_90001);
        } catch (Exception e) {
            log.error("同步员工数据,系统异常：企业ID:【{}】,异常信息:【{}】", extCorpId, e);
            throw new BaseException(ErrorMsgEnum.CODE_90001);
        }
        return true;

    }

    @Override
    public Staff saveOrUpdateUser(WxCpUser user, String extCorpId) {
        try {
            List<StaffDepartment> staffDepartmentList = new ArrayList<>();

            Staff staff = new Staff();
            BeanUtils.copyProperties(user, staff);
            staff.setAvatarUrl(user.getAvatar())
                    .setGender(user.getGender() == null ? "0" : user.getGender().getCode());

            Staff old = getOne(new QueryWrapper<Staff>().lambda().eq(Staff::getExtId, user.getUserId()).eq(Staff::getExtCorpId, extCorpId));
            if (old != null) {
                staff.setId(old.getId())
                        .setCreatedAt(old.getCreatedAt());
            } else {
                staff.setId(UUID.get32UUID())
                        .setCreatedAt(new Date());
            }

            staff.setExtId(user.getUserId())
                    .setExtCorpId(extCorpId)
                    .setDeptIds(Arrays.toString(Optional.ofNullable(user.getDepartIds()).orElse(new Long[]{})));

            List<Department> departments = new ArrayList<>();
            AtomicInteger num = new AtomicInteger();
            Arrays.asList(Optional.ofNullable(user.getDepartIds()).orElse(new Long[]{})).forEach(departId -> {
                Department department = departmentService.getOne(new QueryWrapper<Department>().lambda()
                        .eq(Department::getExtId, departId)
                        .eq(Department::getExtCorpId, extCorpId));

                if (department != null) {
                    departments.add(department);
                    Integer[] isLeaderInDept = Optional.ofNullable(user.getIsLeaderInDept()).orElse(new Integer[]{});
                    StaffDepartment staffDepartment = new StaffDepartment()
                            .setStaffId(staff.getId())
                            .setExtStaffId(staff.getExtId())
                            .setExtDepartmentId(departId)
                            .setDepartmentId(department.getId())
                            .setExtCorpId(extCorpId)
                            .setIsLeader(isLeaderInDept.length < num.get() + 1 ? null : user.getIsLeaderInDept()[num.get()])
                            .setOrder(user.getOrders()[num.get()]);
                    num.set(num.get() + 1);
                    staffDepartmentList.add(staffDepartment);
                }

            });

            if (old != null) {
                updateById(staff);
                //删除旧的关联
                staffDepartmentService.remove(new LambdaQueryWrapper<StaffDepartment>().eq(StaffDepartment::getStaffId, staff.getId()));
            } else {
                save(staff);
            }

            staffDepartmentService.saveBatch(staffDepartmentList);

            //更新部门人数
            List<String> finishDepartment = new ArrayList<>();
            Optional.of(departments).orElse(new ArrayList<>()).stream().filter(Objects::nonNull).forEach(department -> {
                if (!finishDepartment.contains(department.getId())) {
                    finishDepartment.add(department.getId());
                    Long staffNum = Optional.ofNullable(staffDepartmentService.queryDepartmentStaffNum(extCorpId, department.getExtId())).orElse(0L);
                    departmentService.updateById(department.setStaffNum(staffNum));
                }
            });

            return staff;

        } catch (Exception e) {
            log.error("同步员工信息失败，企业ID：【{}】,企业微信用户信息：【{}】,异常信息：【{}】", extCorpId, user.toJson(), e);
        }
        return null;
    }


    @Override
    public void updateAdmin(String extCorpId) {

        update(null, new UpdateWrapper<Staff>().lambda()
                .eq(Staff::getExtCorpId, extCorpId)
                .set(Staff::getIsAdmin, 0));


        WxCpTpService wxCpTpService = new WxCpTpServiceImpl();
        wxCpTpService.setWxCpTpConfigStorage(wxCpTpConfiguration.getBaseConfig());

        try {
            WxCpTpAdmin adminList = wxCpTpService.getAdminList(extCorpId, accreditService.getAgentIdByCorpId(extCorpId));
            List<String> adminStaffIds = adminList.getAdmin().stream()
                    .filter(e -> e.getAuthType() == 1)
                    .map(WxCpTpAdmin.Admin::getUserId)
                    .collect(Collectors.toList());

            if (ListUtils.isNotEmpty(adminStaffIds)) {
                update(null, new UpdateWrapper<Staff>().lambda()
                        .eq(Staff::getExtCorpId, extCorpId)
                        .in(Staff::getExtId, adminStaffIds)
                        .set(Staff::getIsAdmin, 1));
            }
        } catch (WxErrorException e) {
            log.error("获取企业管理员异常，[{}],", extCorpId, e);
        }
    }

    @Override
    public boolean isAdmin() {
//        return getById(JwtUtil.getUserId()).getIsAdmin();
        return roleStaffService.isEnterpriseAdmin();
    }

    @Override
    public void deleteByCorpId(String extCorpId) {

        //删除员工-部门关联
        staffDepartmentService.remove(new LambdaQueryWrapper<StaffDepartment>().eq(StaffDepartment::getExtCorpId, extCorpId));

        //删除员工
        remove(new QueryWrapper<Staff>().lambda().eq(Staff::getExtCorpId, extCorpId));

        //删除员工-客户关联
        customerStaffService.remove(new LambdaQueryWrapper<WxCustomerStaff>().eq(WxCustomerStaff::getExtCorpId, extCorpId));

        //删除员工-客户-详情
        customerInfoService.remove(new LambdaQueryWrapper<WxCustomerInfo>().eq(WxCustomerInfo::getExtCorpId, extCorpId));

        //删除员工-客户标签
        customerStaffTagService.remove(new LambdaQueryWrapper<WxCustomerStaffTag>().eq(WxCustomerStaffTag::getExtCorpId, extCorpId));

        //删除客户
        customerService.remove(new LambdaQueryWrapper<WxCustomer>().eq(WxCustomer::getExtCorpId, extCorpId));
    }

    @Override
    public List<String> getAllExtId(String extCorpId) {
        return list(new QueryWrapper<Staff>().lambda()
                .select(Staff::getExtId)
                .eq(Staff::getExtCorpId, extCorpId))
                .stream().map(Staff::getExtId).collect(Collectors.toList());
    }

    public List<String> contactSearch(String corpId, String staffName) {
        List<String> result = new ArrayList<>();
        WxCpTpService tpService = new WxCpTpServiceImpl();
        tpService.setWxCpTpConfigStorage(wxCpTpConfiguration.getBaseConfig());
        WxCpTpContactService contactService = new WxCpTpContactServiceImpl(tpService);
        WxCpTpContactSearch wxCpTpContactSearch = new WxCpTpContactSearch();
        wxCpTpContactSearch.setAuthCorpId(corpId);
        wxCpTpContactSearch.setQueryWord(staffName);
        wxCpTpContactSearch.setType(1);
        wxCpTpContactSearch.setLimit(200);

        log.info("通讯录搜索查询条件=[{}]", JSON.toJSONString(wxCpTpContactSearch));
        try {
            WxCpTpContactSearchResp searchResp = contactService.contactSearch(wxCpTpContactSearch);
            WxCpTpContactSearchResp.QueryResult.User user = searchResp.getQueryResult().getUser();
            if (user != null) {
                result = user.getUserid();
            }
            log.info("获取到的通讯录信息=[{}]", JSON.toJSONString(searchResp));
        } catch (WxErrorException e) {
            log.error("通讯录搜索异常：", e);
        }

        return result;
    }

    @Override
    public void exportList(StaffExportDTO dto) {
        Department rootDepartment = departmentService.getRootDepartment(dto.getExtCorpId());
        LambdaQueryWrapper<Staff> wrapper = new QueryWrapper<Staff>().lambda()
                .eq(Staff::getExtCorpId, dto.getExtCorpId())
                .like(StringUtils.isNotBlank(dto.getName()), Staff::getName, dto.getName())
                .like(StringUtils.isNotBlank(dto.getAlias()), Staff::getAlias, dto.getAlias());
        List<StaffExportVO> exportVOS = new ArrayList<>();
        Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList()).forEach(staffVO -> {
            StaffExportVO staffExportVO = new StaffExportVO();
            BeanUtils.copyProperties(staffVO, staffExportVO);
            StringBuilder sb = new StringBuilder();
            exportVOS.add(staffExportVO);
        });

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String title = "员工列表(导出时间: %s)";
        title = String.format(title, dateFormat.format(new Date()));
        EasyPoiUtils.export("员工数据列表", title, null, StaffExportVO.class, exportVOS);

    }

    /**
     * 登录成功获取用户token
     *
     * @param staff
     * @param hasWeb
     * @return
     */
    @Override
    public String change2Token(Staff staff, boolean hasWeb) {


        JwtUtil.LoginInfo loginInfo = new JwtUtil.LoginInfo()
                .setStaffId(staff.getId())
                .setStaffExtId(staff.getExtId())
                .setCorpId(staff.getExtCorpId())
                .setHasWeb(hasWeb)
                .setIsAdmin(staff.getIsAdmin());

        return JwtUtil.sign(JSON.toJSONString(loginInfo));
    }

    @Override
    public Staff findByExtId(String extCorpId, String extId) {
        return getOne(new QueryWrapper<Staff>().lambda()
                .eq(Staff::getExtCorpId, extCorpId)
                .eq(Staff::getExtId, extId), false);
    }
}
