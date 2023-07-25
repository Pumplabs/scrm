package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.CustomerDynamicInfoDTO;
import com.scrm.api.wx.cp.entity.WxCustomerStaff;
import com.scrm.api.wx.cp.enums.BrCustomerDynamicModelEnum;
import com.scrm.api.wx.cp.enums.BrCustomerDynamicTypeEnum;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.constant.Constants;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.DateUtils;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.*;
import com.scrm.server.wx.cp.mapper.BrCustomerFollowMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.utils.WxMsgUtils;
import com.scrm.server.wx.cp.vo.BrCustomerFollowVO;
import com.scrm.server.wx.cp.vo.TopNStatisticsVo;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 客户跟进 服务实现类
 *
 * @author xxh
 * @since 2022-05-19
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrCustomerFollowServiceImpl extends ServiceImpl<BrCustomerFollowMapper, BrCustomerFollow> implements IBrCustomerFollowService {

    @Autowired
    private IBrCustomerFollowMsgService followMsgService;

    @Autowired
    private IWxCustomerService customerService;

    @Autowired
    private IBrCustomerFollowReplyService customerFollowReplyService;

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IBrCustomerDynamicService customerDynamicService;

    @Autowired
    private IWxCustomerStaffAssistService customerStaffAssistService;

    @Autowired
    private IBrFollowTaskService followTaskService;

    @Autowired
    private IBrTodoService todoService;

    @Autowired
    private IBrFieldLogService fieldLogService;

    @Autowired
    private IXxlJobService jobService;

    @Autowired
    private IBrOpportunityService opportunityService;

    @Override
    public IPage<BrCustomerFollowVO> pageList(BrCustomerFollowPageDTO dto) {
        LambdaQueryWrapper<BrCustomerFollow> wrapper = new QueryWrapper<BrCustomerFollow>()
                .lambda().eq(BrCustomerFollow::getExtCorpId, dto.getExtCorpId())
                .eq(BrCustomerFollow::getType, dto.getType())
                .eq(StringUtils.isNotBlank(dto.getExtCustomerId()), BrCustomerFollow::getExtCustomerId, dto.getExtCustomerId())
                .orderByDesc(BrCustomerFollow::getCreatedAt);
        //客户跟进
        if (BrCustomerFollow.CUSTOMER_TYPE.equals(dto.getType())) {
            wrapper.eq(!dto.getHasAll(), BrCustomerFollow::getCreatorExtId, JwtUtil.getExtUserId())
                    //如果是应用主页的管理员，要看全部，就不会有这个查询条件的限制
                    .and(dto.getHasAll() && !(dto.getHasMain() && staffService.isAdmin()), wq ->
                            wq.eq(BrCustomerFollow::getCreatorExtId, JwtUtil.getExtUserId())
                                    .or()
                                    .apply(String.format(
                                            " JSON_CONTAINS(share_ext_staff_ids, '\"%s\"') ", JwtUtil.getExtUserId())
                                    )
                    );
        }

        IPage<BrCustomerFollow> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }

    @Override
    public List<BrCustomerFollowVO> list(BrCustomerFollowQueryDTO dto) {
        LambdaQueryWrapper<BrCustomerFollow> wrapper = new QueryWrapper<BrCustomerFollow>()
                .lambda().eq(BrCustomerFollow::getExtCorpId, dto.getExtCorpId())
                .eq(BrCustomerFollow::getType, dto.getType())
                .eq(StringUtils.isNotBlank(dto.getExtCustomerId()), BrCustomerFollow::getExtCustomerId, dto.getExtCustomerId())
                .orderByDesc(BrCustomerFollow::getCreatedAt);
        //客户跟进
        if (BrCustomerFollow.CUSTOMER_TYPE.equals(dto.getType())) {
            wrapper.eq(!dto.getHasAll(), BrCustomerFollow::getCreatorExtId, JwtUtil.getExtUserId())
                    //如果是应用主页的管理员，要看全部，就不会有这个查询条件的限制
                    .and(dto.getHasAll() && !(dto.getHasMain() && staffService.isAdmin()), wq ->
                            wq.eq(BrCustomerFollow::getCreatorExtId, JwtUtil.getExtUserId())
                                    .or()
                                    .apply(String.format(
                                            " JSON_CONTAINS(share_ext_staff_ids, '\"%s\"') ", JwtUtil.getExtUserId())
                                    )
                    );
        }

        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }

    @Override
    public BrCustomerFollowVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public void save(BrCustomerFollowSaveDTO dto) {

        dto.getExtCustomerStaffList().forEach(extCustomerStaff -> saveOne(dto, extCustomerStaff));

    }

    private void saveOne(BrCustomerFollowSaveDTO dto, WxCustomerStaff extCustomerStaff) {
        //封装数据
        BrCustomerFollow brCustomerFollow = new BrCustomerFollow();
        BeanUtils.copyProperties(dto, brCustomerFollow);
        brCustomerFollow.setId(UUID.get32UUID())
                .setExtCustomerId(extCustomerStaff.getExtCustomerId())
                .setExtStaffId(extCustomerStaff.getExtStaffId())
                .setCreatedAt(new Date())
                .setUpdatedAt(new Date())
                .setCreatorExtId(JwtUtil.getExtUserId());

        //新增跟进提醒
        if (dto.getRemindAt() != null) {
            brCustomerFollow.setJobId(addRemindJob(brCustomerFollow, dto.getRemindAt()));
        }

        //推送消息
        if (ListUtils.isNotEmpty(dto.getShareExtStaffIds())) {

            dto.getShareExtStaffIds().forEach(extStaffId -> {

                BrCustomerFollowMsg followMsg = new BrCustomerFollowMsg()
                        .setId(UUID.get32UUID())
                        .setFollowId(brCustomerFollow.getId())
                        .setCreatedAt(new Date())
                        .setExtCorpId(dto.getExtCorpId())
                        .setExtStaffId(extStaffId)
                        .setHasRead(false)
                        .setHasReply(false);

                followMsgService.save(followMsg);
            });
            WxMsgUtils.sendMessage(dto.getExtCorpId(),
                    String.format("有新的跟进@你\n<a href=\"%s\">立即查看</a>", ScrmConfig.getFollowDetailUrl() + "/" + brCustomerFollow.getId() + "?timestamp=" + System.currentTimeMillis()),
                    dto.getShareExtStaffIds());
        }

        //客户跟进
        if (BrCustomerFollow.CUSTOMER_TYPE.equals(dto.getType())) {
            //新增/修改协助人
            List<String> assistExtStaffIdList = Optional.of(dto.getFollowTaskList()).orElse(new ArrayList<>()).stream()
                    .map(BrFollowTaskSaveOrUpdateDTO::getOwner)
                    .filter(Objects::nonNull).distinct()
                    .collect(Collectors.toList());
            if (ListUtils.isNotEmpty(brCustomerFollow.getShareExtStaffIds())) {
                assistExtStaffIdList.addAll(brCustomerFollow.getShareExtStaffIds());
            }
            customerStaffAssistService.saveOrUpdate(new WxCustomerStaffAssistSaveOrUpdateDTO()
                    .setExtCorpId(JwtUtil.getExtCorpId())
                    .setExtCustomerId(brCustomerFollow.getExtCustomerId())
                    .setExtStaffId(brCustomerFollow.getExtStaffId())
                    .setAssistExtStaffIdList(assistExtStaffIdList));


            //客户跟进任务没有待办
            brCustomerFollow.setIsTodo(false);

            //增加客户动态
            CustomerDynamicInfoDTO dynamicInfoDTO = new CustomerDynamicInfoDTO()
                    .setFollowId(brCustomerFollow.getId()).setFollowContent(WxMsgUtils.changeToText(brCustomerFollow.getContent(), null).getContent());
            customerDynamicService.save(BrCustomerDynamicModelEnum.TASK_TREASURE.getCode(),
                    BrCustomerDynamicTypeEnum.ADD_FOLLOW.getCode(), dto.getExtCorpId(), JwtUtil.getExtUserId(),
                    extCustomerStaff.getExtCustomerId(), dynamicInfoDTO);
        }
        //商机跟进
        if (BrCustomerFollow.OPPORTUNITY_TYPE.equals(dto.getType())) {
            fieldLogService.save(BrFieldLog.OPPORTUNITY_TABLE_NAME, brCustomerFollow.getExtCustomerId(), BrFieldLog.ADD_FOLLOW,
                    new BrFieldLogInfoDTO().setContentId(brCustomerFollow.getId()).setContent(WxMsgUtils.changeToText(brCustomerFollow.getContent(), null).getContent()),
                    brCustomerFollow.getCreatedAt(), brCustomerFollow.getCreatorExtId());
        }

        //入库
        save(brCustomerFollow);

        //处理跟进任务
        handlerFollowTaskList(brCustomerFollow, dto.getFollowTaskList());


    }

    /**
     * @param
     * @return
     * @description 新增跟进定时提醒任务
     */
    private Integer addRemindJob(BrCustomerFollow brCustomerFollow, Date remindAt) {
        BrCustomerFollowRemindDTO params = new BrCustomerFollowRemindDTO();
        params.setExtCorpId(brCustomerFollow.getExtCorpId())
                .setFollowId(brCustomerFollow.getId())
                .setStaffExtId(brCustomerFollow.getCreatorExtId());
        XxlJobInfoDTO xxlJobInfoDTO = new XxlJobInfoDTO();
        xxlJobInfoDTO.setJobDesc("客户跟进")
                .setAuthor(params.getStaffExtId())
                .setExecutorHandler(Constants.FOLLOW_REMIND_HANDLER)
                .setExecutorParam(JSON.toJSONString(params))
                .setCron(DateUtils.getCron(DateUtils.handleTime(remindAt)));

        Integer jobId = jobService.addOrUpdate(xxlJobInfoDTO);
        jobService.start(jobId);

        return jobId;
    }

    @Override
    public BrCustomerFollow update(BrCustomerFollowUpdateDTO dto) {

        //校验参数
        BrCustomerFollow old = checkExists(dto.getId());

        //封装数据
        BrCustomerFollow brCustomerFollow = new BrCustomerFollow();
        BeanUtils.copyProperties(dto, brCustomerFollow);

        brCustomerFollow.setUpdatedAt(new Date());

        //更新跟进提醒
        if (dto.getRemindAt() != null) {
            if (old.getRemindAt() == null || !DateUtils.isSameTime(DateUtils.handleTime(dto.getRemindAt()), DateUtils.handleTime(old.getRemindAt()))) {
                if (old.getJobId() != null) {
                    jobService.delete(old.getJobId());
                }
                brCustomerFollow.setJobId(addRemindJob(brCustomerFollow, dto.getRemindAt()));
            }
        }

        BrCustomerFollowRemindDTO params = new BrCustomerFollowRemindDTO();
        params.setExtCorpId(brCustomerFollow.getExtCorpId())
                .setFollowId(brCustomerFollow.getId())
                .setStaffExtId(brCustomerFollow.getCreatorExtId());
        XxlJobInfoDTO xxlJobInfoDTO = new XxlJobInfoDTO();
        xxlJobInfoDTO.setJobDesc("客户跟进")
                .setAuthor(params.getStaffExtId())
                .setExecutorHandler(Constants.FOLLOW_REMIND_HANDLER)
                .setExecutorParam(JSON.toJSONString(params))
                .setCron(DateUtils.getCron(DateUtils.handleTime(dto.getRemindAt())));

        Integer jobId = jobService.addOrUpdate(xxlJobInfoDTO);
        jobService.start(jobId);
        brCustomerFollow.setJobId(jobId);

        //新加的就加条未读消息
        if (ListUtils.isNotEmpty(dto.getShareExtStaffIds())) {
            List<String> staffExtIds = followMsgService.list(new QueryWrapper<BrCustomerFollowMsg>().lambda()
                            .select(BrCustomerFollowMsg::getExtStaffId)
                            .eq(BrCustomerFollowMsg::getExtCorpId, dto.getExtCorpId())
                            .eq(BrCustomerFollowMsg::getFollowId, dto.getId()))
                    .stream().map(BrCustomerFollowMsg::getExtStaffId).collect(Collectors.toList());

            brCustomerFollow.getShareExtStaffIds().stream()
                    .filter(e -> !staffExtIds.contains(e))
                    .forEach(e -> {
                        BrCustomerFollowMsg followMsg = new BrCustomerFollowMsg()
                                .setId(UUID.get32UUID())
                                .setFollowId(brCustomerFollow.getId())
                                .setCreatedAt(new Date())
                                .setExtCorpId(dto.getExtCorpId())
                                .setExtStaffId(e)
                                .setHasRead(false)
                                .setHasReply(false);

                        followMsgService.save(followMsg);
                        WxMsgUtils.sendMessage(dto.getExtCorpId(),
                                String.format("有新的跟进@你\n<a href=\"%s\">立即查看</a>", ScrmConfig.getFollowDetailUrl() + "/" + brCustomerFollow.getId() + "?timestamp=" + System.currentTimeMillis()),
                                Collections.singletonList(e));
                    });
        }

        //客户跟进
        if (BrCustomerFollow.CUSTOMER_TYPE.equals(old.getType())) {
            //新增/修改协助人
            List<String> assistExtStaffIdList = Optional.of(dto.getFollowTaskList()).orElse(new ArrayList<>()).stream()
                    .map(BrFollowTaskSaveOrUpdateDTO::getOwner)
                    .filter(Objects::nonNull).distinct()
                    .collect(Collectors.toList());
            if (ListUtils.isNotEmpty(brCustomerFollow.getShareExtStaffIds())) {
                assistExtStaffIdList.addAll(brCustomerFollow.getShareExtStaffIds());
            }

            //新增
            customerStaffAssistService.saveOrUpdate(new WxCustomerStaffAssistSaveOrUpdateDTO()
                    .setExtCorpId(JwtUtil.getExtCorpId())
                    .setExtCustomerId(old.getExtCustomerId())
                    .setExtStaffId(old.getExtStaffId())
                    .setAssistExtStaffIdList(assistExtStaffIdList));

            //客户跟进任务没有待办
            brCustomerFollow.setIsTodo(false);
        }

        //入库
        updateById(brCustomerFollow);

        //处理跟进任务
        handlerFollowTaskList(brCustomerFollow, dto.getFollowTaskList());
        return brCustomerFollow;
    }

    /**
     * 新增/修改跟进任务
     *
     * @param brCustomerFollow 跟进
     * @param followTaskList   跟进任务列表
     * @author ouyang
     */
    private void handlerFollowTaskList(BrCustomerFollow brCustomerFollow, List<BrFollowTaskSaveOrUpdateDTO> followTaskList) {

        if (ListUtils.isEmpty(followTaskList)) {
            return;
        }

        //1、从数据库移除已被删除的数据,同时删除待办
        String id = brCustomerFollow.getId();
        List<String> followTaskIds = followTaskList.stream().map(BrFollowTaskSaveOrUpdateDTO::getId).collect(Collectors.toList());
        List<String> needDeletefollowTaskIds = Optional.ofNullable(followTaskService.list(new LambdaQueryWrapper<BrFollowTask>()
                .select(BrFollowTask::getId)
                .eq(BrFollowTask::getFollowId, id)
                .notIn(ListUtils.isNotEmpty(followTaskIds), BrFollowTask::getId, followTaskIds)
        )).orElse(new ArrayList<>()).stream().map(BrFollowTask::getId).collect(Collectors.toList());
        if (ListUtils.isNotEmpty(needDeletefollowTaskIds)) {
            followTaskService.batchDelete(new BatchDTO<String>().setIds(needDeletefollowTaskIds));
            todoService.remove(new LambdaQueryWrapper<BrTodo>().eq(BrTodo::getType, BrTodo.FOLLOW_TYPE)
                    .eq(BrTodo::getBusinessId, brCustomerFollow.getId()).in(BrTodo::getBusinessId1, needDeletefollowTaskIds));
        }
        Boolean isTodo = brCustomerFollow.getIsTodo();

        //2、遍历新增/修改跟进任务数据
        followTaskList.forEach(followTask -> {
            if (StringUtils.isNotBlank(followTask.getId())) {
                BrFollowTaskUpdateDTO followTaskUpdateDTO = new BrFollowTaskUpdateDTO();
                BeanUtils.copyProperties(followTask, followTaskUpdateDTO);
                followTaskUpdateDTO.setExtCorpId(brCustomerFollow.getExtCorpId()).setFollowId(brCustomerFollow.getId());
                followTaskService.update(followTaskUpdateDTO, isTodo);
            } else {
                BrFollowTaskSaveDTO followTaskSaveDTO = new BrFollowTaskSaveDTO();
                BeanUtils.copyProperties(followTask, followTaskSaveDTO);
                followTaskSaveDTO.setExtCorpId(brCustomerFollow.getExtCorpId()).setFollowId(brCustomerFollow.getId());
                followTaskService.save(followTaskSaveDTO, isTodo);
            }
        });

    }

    @Override
    public void delete(String id) {

        //校验参数
        BrCustomerFollow follow = checkExists(id);

        //删除
        removeById(id);

        //查询出所有的跟进人
        List<String> oldAssistExtStaffIdList = Optional.ofNullable(follow.getShareExtStaffIds()).orElse(new ArrayList<>());
        List<String> ownerList = Optional.ofNullable(followTaskService.list(new LambdaQueryWrapper<BrFollowTask>()
                        .select(BrFollowTask::getId)
                        .eq(BrFollowTask::getFollowId, follow.getId())))
                .orElse(new ArrayList<>()).stream().map(BrFollowTask::getOwner).filter(Objects::nonNull).collect(Collectors.toList());
        if (ListUtils.isNotEmpty(ownerList)) {
            oldAssistExtStaffIdList.addAll(ownerList);
        }

        log.info("测试协作人，[{}]", JSON.toJSONString(ownerList));

        //如果在别的地方没有用到就得删除协助人
        List<String> needDeleteExtStaffIdList = new ArrayList<>();
        Optional.of(oldAssistExtStaffIdList).orElse(new ArrayList<>()).forEach(oldAssistExtStaffId -> {
            long taskTotal = followTaskService.count(new LambdaQueryWrapper<BrFollowTask>()
                    .eq(BrFollowTask::getExtCorpId, follow.getExtCorpId())
                    .ne(BrFollowTask::getFollowId, follow.getId())
                    .eq(BrFollowTask::getOwner, oldAssistExtStaffId));
            long followTotal = count(new LambdaQueryWrapper<BrCustomerFollow>()
                    .eq(BrCustomerFollow::getExtCorpId, follow.getExtCorpId())
                    .ne(BrCustomerFollow::getId, follow.getId())
                    .eq(BrCustomerFollow::getExtStaffId, follow.getExtStaffId())
                    .eq(BrCustomerFollow::getExtCustomerId, follow.getExtCustomerId())
                    .apply(String.format(" JSON_CONTAINS(share_ext_staff_ids, '\"%s\"') ", oldAssistExtStaffId)));
            log.info("测试协作人，222，[{}]，[{}]，[{}]", oldAssistExtStaffId, taskTotal, followTotal);
            if (taskTotal <= 0 && followTotal <= 0) {
                needDeleteExtStaffIdList.add(oldAssistExtStaffId);
            }
        });
        log.info("测试协作人，333，[{}]", JSON.toJSONString(needDeleteExtStaffIdList));
        if (ListUtils.isNotEmpty(needDeleteExtStaffIdList)) {
            customerStaffAssistService.remove(new WxCustomerStaffAssistSaveOrUpdateDTO()
                    .setExtCorpId(follow.getExtCorpId())
                    .setAssistExtStaffIdList(needDeleteExtStaffIdList)
                    .setExtCustomerId(follow.getExtCustomerId())
                    .setExtStaffId(follow.getExtStaffId()));
        }


        //删掉回复和通知
        customerFollowReplyService.remove(new QueryWrapper<BrCustomerFollowReply>().lambda()
                .eq(BrCustomerFollowReply::getExtCorpId, follow.getExtCorpId())
                .eq(BrCustomerFollowReply::getFollowId, id));

        followMsgService.remove(new QueryWrapper<BrCustomerFollowMsg>().lambda()
                .eq(BrCustomerFollowMsg::getExtCorpId, follow.getExtCorpId())
                .eq(BrCustomerFollowMsg::getFollowId, id));

    }

    /**
     * 翻译
     *
     * @param brCustomerFollow 实体
     * @return BrCustomerFollowVO 结果集
     * @author xxh
     * @date 2022-05-19
     */
    private BrCustomerFollowVO translation(BrCustomerFollow brCustomerFollow) {
        BrCustomerFollowVO vo = new BrCustomerFollowVO();
        BeanUtils.copyProperties(brCustomerFollow, vo);

        vo.setStaff(staffService.find(vo.getExtCorpId(), vo.getCreatorExtId()));

        //客户跟进
        if (BrCustomerFollow.CUSTOMER_TYPE.equals(brCustomerFollow.getType())) {
            vo.setWxCustomer(customerService.checkExists(vo.getExtCorpId(), vo.getExtCustomerId()));
        }

        //商机跟进
        if (BrCustomerFollow.OPPORTUNITY_TYPE.equals(brCustomerFollow.getType())) {
            vo.setBrOpportunity(opportunityService.getById(vo.getExtCustomerId()));
        }

        vo.setReplyList(customerFollowReplyService.queryList(new BrCustomerFollowReplyQueryDTO()
                .setExtCorpId(vo.getExtCorpId())
                .setFollowId(vo.getId())));

        //关联任务
        vo.setTaskList(followTaskService.queryList(new BrFollowTaskQueryDTO().setExtCorpId(brCustomerFollow.getExtCorpId()).setFollowIds(Arrays.asList(brCustomerFollow.getId()))));

        WxMsgUtils.packMsgDto(vo.getContent());
        return vo;
    }


    @Override
    public BrCustomerFollow checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrCustomerFollow byId = getById(id);
        if (byId == null) {
            throw new BaseException("客户跟进不存在");
        }
        return byId;
    }



    @Override
    public Long getAddedCountByDate(Date date,String extCorpId) {
        return baseMapper.addedByDate(date,extCorpId);
    }

    @Override
    public  List<Map<String, Object>> countByDateAndCorp(Date date){
        return this.baseMapper.countByDateAndCorp(date);
    }

    @Override
    public List<TopNStatisticsVo> getStaffTotalFollowUpByDates(String extCorpId, Integer dates, Integer topN) {
        return baseMapper.getStaffTotalFollowUpByDates(extCorpId,dates,topN);
    }

    @Override
    public Long countByDateAndStaff() {
        String extStaffId =  JwtUtil.getExtUserId();
        String extCorpId = JwtUtil.getExtCorpId();
        Date startTime = DateUtils.getYesterdayTime(true);
        Date endTime = DateUtils.getYesterdayTime(false);
        return count(new QueryWrapper<BrCustomerFollow>().lambda()
                .eq(BrCustomerFollow::getExtCorpId,extCorpId)
                .eq(BrCustomerFollow::getExtStaffId,extStaffId)
                .ge(BrCustomerFollow::getCreatedAt,startTime).le(BrCustomerFollow::getCreatedAt,endTime));
    }

    @Override
    public Long countByToday(){
        Date startTime = DateUtils.getTodayStartTime();
        Date endTime = new Date();
        return count(new QueryWrapper<BrCustomerFollow>().lambda()
                .eq(BrCustomerFollow::getExtCorpId, JwtUtil.getExtCorpId())
                .ge(BrCustomerFollow::getCreatedAt, startTime).le(BrCustomerFollow::getCreatedAt, endTime)
                .eq(!staffService.isAdmin(),BrCustomerFollow::getCreatorExtId,JwtUtil.getExtUserId()));
    }

}
