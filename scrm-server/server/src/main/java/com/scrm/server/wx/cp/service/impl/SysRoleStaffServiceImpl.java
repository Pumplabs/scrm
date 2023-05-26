package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.common.constant.Constants;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.SysRoleStaffPageDTO;
import com.scrm.server.wx.cp.dto.SysRoleStaffQueryDTO;
import com.scrm.server.wx.cp.dto.SysRoleStaffSaveDTO;
import com.scrm.common.entity.SysRole;
import com.scrm.common.entity.SysRoleStaff;
import com.scrm.server.wx.cp.mapper.SysRoleStaffMapper;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.service.ISysRoleService;
import com.scrm.server.wx.cp.service.ISysRoleStaffService;
import com.scrm.server.wx.cp.vo.SysRoleStaffVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.redisson.api.RBucket;
import org.redisson.api.RedissonClient;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 角色-员工关联 服务实现类
 *
 * @author xxh
 * @since 2022-06-16
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class SysRoleStaffServiceImpl extends ServiceImpl<SysRoleStaffMapper, SysRoleStaff> implements ISysRoleStaffService {

    @Autowired
    private ISysRoleService roleService;

    @Autowired
    private IStaffService staffService;
    
    @Autowired
    private RedissonClient redissonClient;

    @Override
    public IPage<SysRoleStaffVO> pageList(SysRoleStaffPageDTO dto) {
        LambdaQueryWrapper<SysRoleStaff> wrapper = new QueryWrapper<SysRoleStaff>()
                .lambda().eq(SysRoleStaff::getExtCorpId, dto.getExtCorpId());
        if (StringUtils.isNotBlank(dto.getRoleKey())) {
            String roleId = roleService.getEnterpriseAdminRole().getId();
            wrapper.eq(SysRoleStaff::getRoleId, roleId);
        }
        IPage<SysRoleStaff> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper.orderByDesc(SysRoleStaff::getCreatedAt));
        return page.convert(this::translation);
    }


    @Override
    public List<SysRoleStaffVO> queryList(SysRoleStaffQueryDTO dto) {
        LambdaQueryWrapper<SysRoleStaff> wrapper = new QueryWrapper<SysRoleStaff>()
                .lambda().eq(SysRoleStaff::getExtCorpId, dto.getExtCorpId());
        if (StringUtils.isNotBlank(dto.getRoleKey())) {
            String roleId = roleService.getEnterpriseAdminRole().getId();
            wrapper.eq(SysRoleStaff::getRoleId, roleId);
        }
        return Optional.ofNullable(list(wrapper.orderByDesc(SysRoleStaff::getCreatedAt))).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public SysRoleStaffVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public List<SysRoleStaff> save(SysRoleStaffSaveDTO dto) {

        List<SysRoleStaff> list = new ArrayList<>();
        //校验数据
        SysRole sysRole = roleService.checkExists(dto.getRoleId());
        dto.getExtStaffIds().forEach(extStaffId -> {
            Staff staff = staffService.checkExists(extStaffId, dto.getExtCorpId());
            //封装数据
            SysRoleStaff sysRoleStaff = new SysRoleStaff();
            BeanUtils.copyProperties(dto, sysRoleStaff);
            sysRoleStaff.setId(UUID.get32UUID())
                    .setExtStaffId(extStaffId)
                    .setCreatedAt(new Date())
                    .setCreator(JwtUtil.getUserIdCatchError());

            SysRoleStaff one = getOne(new LambdaQueryWrapper<SysRoleStaff>()
                    .eq(SysRoleStaff::getExtCorpId, dto.getExtCorpId())
                    .eq(SysRoleStaff::getExtStaffId, extStaffId)
                    .eq(SysRoleStaff::getRoleId, dto.getRoleId()));
            if (one == null) {
                //入库
                save(sysRoleStaff);
                list.add(sysRoleStaff);
            }
            
        });

        updateAdminToRedis(dto.getExtCorpId());
        return list;
    }

    /**
     * 把管理员id更新到redis
     * @param extCorpId
     */
    private void updateAdminToRedis(String extCorpId) {
        List<String> idList = roleService.getExtStaffIdsByRoleKey(extCorpId, Constants.SYS_ROLE_KEY_ENTERPRISE_ADMIN);
        RBucket<List<String>> bucket = redissonClient.getBucket(Constants.CORP_ADMIN_REDIS_PRE + extCorpId);
        bucket.set(idList);
    }


    @Override
    public void delete(String id) {
        //校验参数
        SysRoleStaff sysRoleStaff = checkExists(id);

        //不能移除自己的管理员角色
        String extStaffId = sysRoleStaff.getExtStaffId();
        if (extStaffId.equals(JwtUtil.getExtUserId())) {
            throw new BaseException("不能移除自己的角色");
        }

        //只有管理员才能把员工的管理员角色移除
        String enterpriseAdminRoleId = roleService.getEnterpriseAdminRole().getId();
        if (Objects.equals(enterpriseAdminRoleId, sysRoleStaff.getRoleId())) {

            if (count(new LambdaQueryWrapper<SysRoleStaff>()
                    .eq(SysRoleStaff::getRoleId, enterpriseAdminRoleId)
                    .eq(SysRoleStaff::getExtCorpId, JwtUtil.getExtCorpId())) < 1) {
                throw new BaseException("至少有一个人为企业管理员");
            }

            if (!isEnterpriseAdmin(JwtUtil.getExtUserId(), JwtUtil.getExtCorpId())) {
                throw new BaseException("只有管理员才能进行删除操作");
            }
        }

        //删除
        removeById(id);

        updateAdminToRedis(sysRoleStaff.getExtCorpId());
    }




    /**
     * 翻译
     *
     * @param sysRoleStaff 实体
     * @return SysRoleStaffVO 结果集
     * @author xxh
     * @date 2022-06-16
     */
    private SysRoleStaffVO translation(SysRoleStaff sysRoleStaff) {
        SysRoleStaffVO vo = new SysRoleStaffVO();
        BeanUtils.copyProperties(sysRoleStaff, vo);
        vo.setCreatorStaff(staffService.translation(staffService.find(sysRoleStaff.getCreator())))
                .setStaff(staffService.translation(staffService.find(JwtUtil.getExtCorpId(), sysRoleStaff.getExtStaffId())));

        return vo;
    }


    @Override
    public SysRoleStaff checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        SysRoleStaff byId = getById(id);
        if (byId == null) {
            throw new BaseException("角色-员工关联不存在");
        }
        return byId;
    }

    @Override
    public boolean isEnterpriseAdmin(String extStaffId, String extCorpId) {
        return OptionalLong.of(count(new LambdaQueryWrapper<SysRoleStaff>()
                .eq(SysRoleStaff::getExtCorpId, extCorpId)
                .eq(SysRoleStaff::getExtStaffId, extStaffId)
                .eq(SysRoleStaff::getRoleId, roleService.getEnterpriseAdminRole().getId())
        )).orElse(0) > 0;
    }

    @Override
    public boolean isEnterpriseAdmin() {
        return isEnterpriseAdmin(JwtUtil.getExtUserId(), JwtUtil.getExtCorpId());
    }
}
