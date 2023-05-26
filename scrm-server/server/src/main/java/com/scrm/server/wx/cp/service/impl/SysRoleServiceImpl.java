package com.scrm.server.wx.cp.service.impl;

import com.scrm.common.constant.Constants;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.entity.SysRoleStaff;
import com.scrm.server.wx.cp.service.ISysRoleStaffService;
import lombok.extern.slf4j.Slf4j;
import com.scrm.common.entity.SysRole;
import com.scrm.server.wx.cp.mapper.SysRoleMapper;
import com.scrm.server.wx.cp.service.ISysRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.scrm.server.wx.cp.dto.SysRolePageDTO;
import com.scrm.server.wx.cp.dto.SysRoleSaveDTO;
import com.scrm.server.wx.cp.dto.SysRoleUpdateDTO;
import com.scrm.server.wx.cp.dto.SysRoleQueryDTO;
import com.scrm.server.wx.cp.vo.SysRoleVO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.scrm.common.util.UUID;
import com.scrm.common.exception.BaseException;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;

import java.util.stream.Collectors;

/**
 * 角色信息表 服务实现类
 *
 * @author xxh
 * @since 2022-06-16
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class SysRoleServiceImpl extends ServiceImpl<SysRoleMapper, SysRole> implements ISysRoleService {

    @Autowired
    private ISysRoleStaffService roleStaffService;

    @Override
    public IPage<SysRoleVO> pageList(SysRolePageDTO dto) {
        LambdaQueryWrapper<SysRole> wrapper = new LambdaQueryWrapper<SysRole>().orderByDesc(SysRole::getUpdatedAt);
        IPage<SysRole> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<SysRoleVO> queryList(SysRoleQueryDTO dto) {
        LambdaQueryWrapper<SysRole> wrapper = new LambdaQueryWrapper<SysRole>().orderByDesc(SysRole::getUpdatedAt);
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public SysRoleVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public SysRole save(SysRoleSaveDTO dto) {

        //封装数据
        SysRole sysRole = new SysRole();
        BeanUtils.copyProperties(dto, sysRole);
        sysRole.setId(UUID.get32UUID());

        //入库
        save(sysRole);

        return sysRole;
    }

    @Override
    public SysRole getEnterpriseAdminRole() {
        SysRole enterpriseAdminRole = getOne(new LambdaQueryWrapper<SysRole>().eq(SysRole::getRoleKey, Constants.SYS_ROLE_KEY_ENTERPRISE_ADMIN));
        if (enterpriseAdminRole == null) {
            enterpriseAdminRole = new SysRole().setId(UUID.get32UUID())
                    .setRoleKey(Constants.SYS_ROLE_KEY_ENTERPRISE_ADMIN)
                    .setCreator(JwtUtil.getUserId())
                    .setCreatedAt(new Date())
                    .setStatus(SysRole.STATUS_NORMAL)
                    .setRoleName("企业管理员")
                    .setRemark("企业管理员")
                    .setRoleSort(Optional.ofNullable(baseMapper.getMaxSort()).orElse(0) + 1);
            save(enterpriseAdminRole);
        }
        return enterpriseAdminRole;
    }


    @Override
    public SysRole update(SysRoleUpdateDTO dto) {

        //校验参数
        SysRole old = checkExists(dto.getId());

        //封装数据
        SysRole sysRole = new SysRole();
        BeanUtils.copyProperties(dto, sysRole);
        sysRole.setUpdatedAt(new Date())
                .setCreatedAt(old.getCreatedAt())
                .setCreator(JwtUtil.getUserId());

        //入库
        updateById(sysRole);

        return sysRole;
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
        List<SysRole> sysRoleList = Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).stream().map(this::checkExists).collect(Collectors.toList());

        //删除
        removeByIds(dto.getIds());
    }


    /**
     * 翻译
     *
     * @param sysRole 实体
     * @return SysRoleVO 结果集
     * @author xxh
     * @date 2022-06-16
     */
    private SysRoleVO translation(SysRole sysRole) {
        SysRoleVO vo = new SysRoleVO();
        BeanUtils.copyProperties(sysRole, vo);
        return vo;
    }


    @Override
    public SysRole checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        SysRole byId = getById(id);
        if (byId == null) {
            throw new BaseException("角色信息表不存在");
        }
        return byId;
    }

    @Override
    public List<String> getExtStaffIdsByRoleKey(String extCorpId, String roleKey) {
        List<String> list = new ArrayList<>();
        if (StringUtils.isNotBlank(roleKey)) {
            SysRole role = getOne(new LambdaQueryWrapper<SysRole>().eq(SysRole::getRoleKey, roleKey));
            if (role != null) {
                list = Optional.ofNullable(roleStaffService.list(new LambdaQueryWrapper<SysRoleStaff>().select(SysRoleStaff::getExtStaffId)
                                .eq(SysRoleStaff::getExtCorpId, extCorpId)
                                .eq(SysRoleStaff::getRoleId, role.getId())))
                        .orElse(new ArrayList<>()).stream().map(SysRoleStaff::getExtStaffId).collect(Collectors.toList());
            }
        }
        return list;
    }
}
