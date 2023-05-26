package com.scrm.server.wx.cp.service.impl;

import com.scrm.api.wx.cp.entity.Department;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.StaffDepartment;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.server.wx.cp.dto.BrFriendWelcomeSaveOrUpdateDTO;
import com.scrm.server.wx.cp.service.IDepartmentService;
import com.scrm.server.wx.cp.service.IStaffDepartmentService;
import com.scrm.server.wx.cp.service.IStaffService;
import lombok.extern.slf4j.Slf4j;
import com.scrm.server.wx.cp.entity.BrFriendWelcome;
import com.scrm.server.wx.cp.mapper.BrFriendWelcomeMapper;
import com.scrm.server.wx.cp.service.IBrFriendWelcomeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.scrm.api.wx.cp.dto.*;

import com.scrm.server.wx.cp.dto.BrFriendWelcomePageDTO;

import com.scrm.server.wx.cp.dto.BrFriendWelcomeQueryDTO;
import com.scrm.server.wx.cp.vo.BrFriendWelcomeVO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.*;

import com.scrm.common.util.UUID;
import com.scrm.common.exception.BaseException;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import java.util.stream.Collectors;

/**
 * 好友欢迎语 服务实现类
 *
 * @author xxh
 * @since 2022-04-23
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrFriendWelcomeServiceImpl extends ServiceImpl<BrFriendWelcomeMapper, BrFriendWelcome> implements IBrFriendWelcomeService {

    @Autowired
    private IStaffDepartmentService staffDepartmentService;

    @Autowired
    private IDepartmentService departmentService;

    @Autowired
    private IStaffService staffService;

    @Override
    public IPage<BrFriendWelcomeVO> pageList(BrFriendWelcomePageDTO dto) {
        LambdaQueryWrapper<BrFriendWelcome> wrapper = new LambdaQueryWrapper<BrFriendWelcome>()
                .eq(BrFriendWelcome::getExtCorpId, dto.getExtCorpId())
                .apply(StringUtils.isNotBlank(dto.getContent()), String.format(" `msg` -> '$.text[*].content' like '%%%s%%'", dto.getContent()))
                .orderByDesc(BrFriendWelcome::getUpdatedAt);
        IPage<BrFriendWelcome> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<BrFriendWelcomeVO> queryList(BrFriendWelcomeQueryDTO dto) {
        LambdaQueryWrapper<BrFriendWelcome> wrapper = new QueryWrapper<BrFriendWelcome>()
                .lambda().eq(BrFriendWelcome::getExtCorpId, dto.getExtCorpId());
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public BrFriendWelcomeVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public BrFriendWelcome saveOrUpdate(BrFriendWelcomeSaveOrUpdateDTO dto) {

        //封装数据
        BrFriendWelcome brFriendWelcome = new BrFriendWelcome();
        BeanUtils.copyProperties(dto, brFriendWelcome);
        brFriendWelcome.setUpdatedAt(new Date());

        if (StringUtils.isBlank(dto.getId())) {
            brFriendWelcome.setId(UUID.get32UUID())
                    .setCreatedAt(new Date())
                    .setCreator(JwtUtil.getUserId());
            //新增
            save(brFriendWelcome);
        } else {

            //校验参数
            BrFriendWelcome old = checkExists(dto.getId());

            brFriendWelcome.setId(old.getId())
                    .setCreator(old.getCreator())
                    .setCreatedAt(old.getCreatedAt())
                    .setUpdatedAt(new Date())
                    .setEditor(JwtUtil.getUserId());
            //修改
            updateById(brFriendWelcome);
        }


        return brFriendWelcome;
    }


    @Override
    public void delete(String id) {

        //校验参数
        checkExists(id);

        //删除
        removeById(id);

    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {

        //校验参数
        Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).forEach(this::checkExists);

        //删除
        removeByIds(dto.getIds());
    }


    /**
     * 翻译
     *
     * @param brFriendWelcome 实体
     * @return BrFriendWelcomeVO 结果集
     * @author xxh
     * @date 2022-04-23
     */
    private BrFriendWelcomeVO translation(BrFriendWelcome brFriendWelcome) {
        BrFriendWelcomeVO vo = new BrFriendWelcomeVO();
        BeanUtils.copyProperties(brFriendWelcome, vo);

        //翻译员工
        List<String> staffExtIds = brFriendWelcome.getStaffExtIds();
        if (ListUtils.isNotEmpty(staffExtIds)) {
            vo.setStaffList(ListUtils.execute2List(extIds -> staffService.list(new LambdaQueryWrapper<Staff>()
                    .eq(Staff::getExtCorpId, brFriendWelcome.getExtCorpId())
                    .in(Staff::getExtId, extIds)
                    .orderByAsc(Staff::getName)), staffExtIds, 999));
        }

        //翻译部门
        List<Long> departmentExtIds = brFriendWelcome.getDepartmentExtIds();
        if (ListUtils.isNotEmpty(departmentExtIds)) {
            vo.setDepartmentList(ListUtils.execute2List(extIds -> departmentService.list(new LambdaQueryWrapper<Department>()
                    .eq(Department::getExtCorpId, brFriendWelcome.getExtCorpId())
                    .in(Department::getExtId, extIds)
                    .orderByAsc(Department::getName)), departmentExtIds, 999));
        }

        vo.setCreatorStaff(staffService.find(brFriendWelcome.getCreator()));

        return vo;
    }


    @Override
    public BrFriendWelcome checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrFriendWelcome byId = getById(id);
        if (byId == null) {
            throw new BaseException("好友欢迎语不存在");
        }
        return byId;
    }

    @Override
    public WxMsgDTO getMxgByStaffExtId(String extCorpId, String staffExtId) {

        List<Long> extDepartmentIds = Optional.ofNullable(
                        staffDepartmentService.list(new LambdaQueryWrapper<StaffDepartment>()
                                .eq(StaffDepartment::getExtCorpId, extCorpId)
                                .eq(StaffDepartment::getExtStaffId, staffExtId))
                )
                .orElse(new ArrayList<>()).stream()
                .map(StaffDepartment::getExtDepartmentId)
                .collect(Collectors.toList());

        List<BrFriendWelcome> list = Optional.ofNullable(list(new LambdaQueryWrapper<BrFriendWelcome>()
                        .eq(BrFriendWelcome::getExtCorpId, extCorpId)
                        .apply(String.format("json_contains(staff_ext_ids, '\"%s\"')", staffExtId))))
                .orElse(new ArrayList<>());

        if (ListUtils.isNotEmpty(extDepartmentIds)) {
            extDepartmentIds.forEach(extDepartmentId -> {
                List<BrFriendWelcome> brFriendWelcomes = list(new LambdaQueryWrapper<BrFriendWelcome>()
                        .eq(BrFriendWelcome::getExtCorpId, extCorpId)
                        .apply(String.format("json_contains(department_ext_ids, '%s')", extDepartmentId)));
                if (ListUtils.isNotEmpty(brFriendWelcomes)) {
                    list.addAll(brFriendWelcomes);
                }
            });
        }

        List<BrFriendWelcome> friendWelcomes = list.stream()
                .filter(ListUtils.distinctByKey(BrFriendWelcome::getId))
                .sorted(Comparator.comparing(BrFriendWelcome::getUpdatedAt).reversed())
                .collect(Collectors.toList());

        if (ListUtils.isNotEmpty(friendWelcomes)) {
            return friendWelcomes.get(0).getMsg();
        }


        return null;
    }
}
