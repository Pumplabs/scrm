package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.util.DateUtils;
import com.scrm.common.util.ListUtils;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.BrCustomerFollow;
import com.scrm.server.wx.cp.entity.BrFieldLog;
import com.scrm.server.wx.cp.entity.BrTodo;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.utils.WxMsgUtils;
import lombok.extern.slf4j.Slf4j;
import com.scrm.server.wx.cp.entity.BrFollowTask;
import com.scrm.server.wx.cp.mapper.BrFollowTaskMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.scrm.server.wx.cp.vo.BrFollowTaskVO;

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
 * 跟进任务 服务实现类
 *
 * @author ouyang
 * @since 2022-06-16
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrFollowTaskServiceImpl extends ServiceImpl<BrFollowTaskMapper, BrFollowTask> implements IBrFollowTaskService {

    @Autowired
    private IBrTodoService todoService;

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IBrFieldLogService fieldLogService;

    @Autowired
    private IBrCustomerFollowService followService;

    @Override
    public IPage<BrFollowTaskVO> pageList(BrFollowTaskPageDTO dto) {
        LambdaQueryWrapper<BrFollowTask> wrapper = new QueryWrapper<BrFollowTask>()
                .lambda().eq(BrFollowTask::getExtCorpId, dto.getExtCorpId());
        IPage<BrFollowTask> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<BrFollowTaskVO> queryList(BrFollowTaskQueryDTO dto) {
        LambdaQueryWrapper<BrFollowTask> wrapper = new QueryWrapper<BrFollowTask>()
                .lambda().eq(BrFollowTask::getExtCorpId, dto.getExtCorpId())
                .in(ListUtils.isNotEmpty(dto.getFollowIds()), BrFollowTask::getFollowId, dto.getFollowIds());
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public BrFollowTaskVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public BrFollowTask save(BrFollowTaskSaveDTO dto, Boolean isTodo) {

        //封装数据
        BrFollowTask brFollowTask = new BrFollowTask();
        BeanUtils.copyProperties(dto, brFollowTask);
        brFollowTask.setCreatedAt(new Date())
                .setId(UUID.get32UUID())
                .setStatus(BrTodo.TODO_STATUS);

        //入库
        save(brFollowTask);

        if (isTodo) {
            saveTodo(brFollowTask);
        }

        return brFollowTask;
    }


    @Override
    public BrFollowTask update(BrFollowTaskUpdateDTO dto, Boolean isTodo) {

        //校验参数
        BrFollowTask old = checkExists(dto.getId());

        //封装数据
        BrFollowTask brFollowTask = new BrFollowTask();
        BeanUtils.copyProperties(dto, brFollowTask);
        brFollowTask.setCreatedAt(old.getCreatedAt())
                .setStatus(old.getStatus());

        //入库
        updateById(brFollowTask);

        if (isTodo) {
            BrTodo todo = todoService.getOne(new LambdaQueryWrapper<BrTodo>()
                    .eq(BrTodo::getExtCorpId, brFollowTask.getExtCorpId())
                    .eq(BrTodo::getType, BrTodo.FOLLOW_TYPE)
                    .eq(BrTodo::getBusinessId, brFollowTask.getFollowId())
                    .eq(BrTodo::getBusinessId1, brFollowTask.getId()));
            if (todo != null) {
                todo.setCreateTime(new Date()).setUpdateTime(new Date()).setOwnerExtId(brFollowTask.getOwner())
                        .setName(brFollowTask.getName()).setDeadlineTime(brFollowTask.getFinishAt());
                todoService.updateById(todo);
            } else {
                saveTodo(brFollowTask);
            }
        }

        return brFollowTask;
    }

    //新增待办
    private void saveTodo(BrFollowTask brFollowTask) {
        BrTodoSaveDTO brTodoSaveDTO = new BrTodoSaveDTO();
        brTodoSaveDTO.setName(brFollowTask.getName()).setCreateTime(brFollowTask.getCreatedAt())
                .setExtCorpId(brFollowTask.getExtCorpId()).setBusinessId(brFollowTask.getFollowId())
                .setBusinessId1(brFollowTask.getId()).setStatus(BrTodo.TODO_STATUS).setType(BrTodo.FOLLOW_TYPE)
                .setOwnerExtId(brFollowTask.getOwner()).setDeadlineTime(brFollowTask.getFinishAt());
        todoService.save(brTodoSaveDTO);

        WxMsgUtils.sendMessage(brFollowTask.getExtCorpId(),
                "您有一条新的待办任务，请及时处理！",
                Collections.singletonList(brFollowTask.getOwner()));
    }

    @Override
    public void delete(String id) {

        //校验参数
        BrFollowTask brFollowTask = checkExists(id);

        //删除
        removeById(id);

    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {

        //校验参数
        List<BrFollowTask> brFollowTaskList = new ArrayList<>();
        Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).forEach(id -> brFollowTaskList.add(checkExists(id)));

        //删除
        removeByIds(dto.getIds());
    }


    /**
     * 翻译
     *
     * @param brFollowTask 实体
     * @return BrFollowTaskVO 结果集
     * @author ouyang
     * @date 2022-06-16
     */
    private BrFollowTaskVO translation(BrFollowTask brFollowTask) {
        BrFollowTaskVO vo = new BrFollowTaskVO();
        BeanUtils.copyProperties(brFollowTask, vo);

        setStatus(brFollowTask);
        vo.setStatus(brFollowTask.getStatus());

        vo.setOwnerStaff(staffService.findByExtId(brFollowTask.getExtCorpId(), brFollowTask.getOwner()));

        return vo;
    }

    /**
     * 判断是否已逾期
     */
    private void setStatus(BrFollowTask brFollowTask) {
        if (BrTodo.TODO_STATUS.equals(brFollowTask.getStatus()) && !DateUtils.belongCalendarBefore(brFollowTask.getFinishAt())) {
            update(new LambdaUpdateWrapper<BrFollowTask>().eq(BrFollowTask::getId, brFollowTask.getId())
                    .set(BrFollowTask::getStatus, BrTodo.OVERDUE_STATUS));
            brFollowTask.setStatus(BrTodo.OVERDUE_STATUS);
            BrCustomerFollow followVO = followService.getById(brFollowTask.getFollowId());
            //记录任务逾期动态
            if (BrCustomerFollow.OPPORTUNITY_TYPE.equals(followVO.getType())) {
                fieldLogService.save(BrFieldLog.OPPORTUNITY_TABLE_NAME,followVO.getExtCustomerId(), BrFieldLog.TASK_OVERDUE,
                        new BrFieldLogInfoDTO().setContentId(brFollowTask.getId()).setContent(brFollowTask.getName()),
                        brFollowTask.getFinishAt(), brFollowTask.getOwner());
            }
        }
    }

    @Override
    public BrFollowTask checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrFollowTask byId = getById(id);
        if (byId == null) {
            throw new BaseException("跟进任务不存在");
        }
        return byId;
    }

    @Override
    public void finishTask(String extCorpId, String taskId) {
        BrFollowTask brFollowTask = checkExists(taskId);
       /* if (!brFollowTask.getOwner().equals(JwtUtil.getExtUserId())) {
            throw new BaseException("你无当前任务操作权限！");
        }*/

        update(new LambdaUpdateWrapper<BrFollowTask>()
                .eq(BrFollowTask::getId, taskId)
                .set(BrFollowTask::getStatus, BrTodo.DONE_STATUS));

        todoService.update(new LambdaUpdateWrapper<BrTodo>()
                .eq(BrTodo::getOwnerExtId, brFollowTask.getOwner())
                .eq(BrTodo::getBusinessId, brFollowTask.getFollowId())
                .eq(BrTodo::getBusinessId1, brFollowTask.getId())
                .eq(BrTodo::getType, BrTodo.FOLLOW_TYPE)
                .set(BrTodo::getStatus, BrTodo.DONE_STATUS)
        );

        //记录任务完成动态
        BrCustomerFollow followVO = followService.getById(brFollowTask.getFollowId());
        if (BrCustomerFollow.OPPORTUNITY_TYPE.equals(followVO.getType())) {
            fieldLogService.save(BrFieldLog.OPPORTUNITY_TABLE_NAME, followVO.getExtCustomerId(), BrFieldLog.TASK_DONE,
                    new BrFieldLogInfoDTO().setContentId(brFollowTask.getId()).setContent(brFollowTask.getName()),
                    new Date(),brFollowTask.getOwner());
        }
    }
}
