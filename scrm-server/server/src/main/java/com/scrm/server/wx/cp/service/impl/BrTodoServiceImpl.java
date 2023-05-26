package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.util.*;
import com.scrm.server.wx.cp.service.IStaffService;
import lombok.extern.slf4j.Slf4j;
import com.scrm.server.wx.cp.entity.BrTodo;
import com.scrm.server.wx.cp.mapper.BrTodoMapper;
import com.scrm.server.wx.cp.service.IBrTodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scrm.server.wx.cp.dto.BrTodoPageDTO;
import com.scrm.server.wx.cp.dto.BrTodoSaveDTO;
import com.scrm.server.wx.cp.dto.BrTodoUpdateDTO;

import com.scrm.server.wx.cp.dto.BrTodoQueryDTO;
import com.scrm.server.wx.cp.vo.BrTodoVO;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import com.scrm.common.exception.BaseException;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import java.util.stream.Collectors;

/**
 * 待办 服务实现类
 *
 * @author ouyang
 * @since 2022-05-20
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrTodoServiceImpl extends ServiceImpl<BrTodoMapper, BrTodo> implements IBrTodoService {

    @Autowired
    private IStaffService staffService;

    @Override
    public IPage<BrTodoVO> pageList(BrTodoPageDTO dto) {
        BrTodoQueryDTO queryDTO = new BrTodoQueryDTO();
        BeanUtils.copyProperties(dto, queryDTO);
        return PageUtils.page(dto.getPageNum(), dto.getPageSize(), queryList(queryDTO));
    }

    @Override
    public List<BrTodoVO> queryList(BrTodoQueryDTO dto) {
        String extUserId = JwtUtil.getExtUserId();
        LambdaQueryWrapper<BrTodo> wrapper = new QueryWrapper<BrTodo>()
                .lambda().eq(BrTodo::getExtCorpId, dto.getExtCorpId()).eq(BrTodo::getOwnerExtId, extUserId)
                .orderByDesc(BrTodo::getCreateTime);
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation)
                .filter(e -> dto.getStatus().equals(e.getStatus())).collect(Collectors.toList());
    }


    @Override
    public BrTodoVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public BrTodo save(BrTodoSaveDTO dto) {

        //封装数据
        BrTodo brTodo = new BrTodo();
        BeanUtils.copyProperties(dto, brTodo);
        brTodo.setId(UUID.get32UUID())
                .setCreator(JwtUtil.getUserId());

        //入库
        save(brTodo);

        return brTodo;
    }


    @Override
    public BrTodo update(BrTodoUpdateDTO dto) {

        //校验参数
        BrTodo old = checkExists(dto.getId());

        //封装数据
        BrTodo brTodo = new BrTodo();
        BeanUtils.copyProperties(dto, brTodo);
        brTodo.setCreateTime(old.getCreateTime())
                .setCreator(old.getCreator());


        //入库
        updateById(brTodo);

        return brTodo;
    }


    @Override
    public void delete(String id) {

        //校验参数
        BrTodo brTodo = checkExists(id);

        //删除
        removeById(id);

    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {

        //校验参数
        List<BrTodo> brTodoList = new ArrayList<>();
        Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).forEach(id -> brTodoList.add(checkExists(id)));

        //删除
        removeByIds(dto.getIds());
    }


    /**
     * 翻译
     *
     * @param brTodo 实体
     * @return BrTodoVO 结果集
     * @author ouyang
     * @date 2022-05-20
     */
    private BrTodoVO translation(BrTodo brTodo) {
        BrTodoVO vo = new BrTodoVO();
        BeanUtils.copyProperties(brTodo, vo);

        setStatus(brTodo);
        vo.setStatus(brTodo.getStatus());
        vo.setCreatorStaff(staffService.find(brTodo.getCreator()));

        return vo;
    }

    /**
     * 判断是否已逾期
     */
    private void setStatus(BrTodo brTodo) {
        if (BrTodo.TODO_STATUS.equals(brTodo.getStatus()) && brTodo.getDeadlineTime() != null && !DateUtils.belongCalendarBefore(brTodo.getDeadlineTime())) {
            update(new LambdaUpdateWrapper<BrTodo>().eq(BrTodo::getId, brTodo.getId())
                    .set(BrTodo::getStatus, BrTodo.OVERDUE_STATUS));
            brTodo.setStatus(BrTodo.OVERDUE_STATUS);
        }
    }

    @Override
    public BrTodo checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrTodo byId = getById(id);
        if (byId == null) {
            throw new BaseException("待办不存在");
        }
        return byId;
    }

    @Override
    public BrTodo getOne(BrTodoQueryDTO dto) {
        BrTodo brTodo = getOne(new LambdaQueryWrapper<BrTodo>().eq(BrTodo::getExtCorpId, dto.getExtCorpId()).eq(BrTodo::getBusinessId, dto.getBusinessId())
                .eq(BrTodo::getBusinessId1, dto.getBusinessId1()).eq(BrTodo::getType, dto.getType()).eq(BrTodo::getOwnerExtId, dto.getOwnerExtId())
                .eq(dto.getCreateTime() != null, BrTodo::getCreateTime, dto.getCreateTime()));
        setStatus(brTodo);

        return brTodo;
    }
}
