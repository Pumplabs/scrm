package com.scrm.server.wx.cp.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.*;
import com.scrm.api.wx.cp.enums.BrCustomerDynamicModelEnum;
import com.scrm.api.wx.cp.enums.BrCustomerDynamicTypeEnum;
import com.scrm.api.wx.cp.enums.WxCustomerAddWayEnum;
import com.scrm.api.wx.cp.vo.*;
import com.scrm.common.constant.Constants;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.UUID;
import com.scrm.common.util.*;
import com.scrm.common.vo.FailResultVO;
import com.scrm.server.wx.cp.config.WxCpConfiguration;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.BrJourneyStageCustomer;
import com.scrm.server.wx.cp.entity.WxResignedStaffCustomer;
import com.scrm.server.wx.cp.feign.dto.UserInfoRes;
import com.scrm.server.wx.cp.mapper.WxCustomerMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.thread.EditTagThread;
import com.scrm.server.wx.cp.thread.ExecutorList;
import com.scrm.server.wx.cp.vo.BatchMarkRes;
import com.scrm.server.wx.cp.vo.BrJourneyStageCustomerVO;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.api.WxCpExternalContactService;
import me.chanjar.weixin.cp.api.impl.WxCpExternalContactServiceImpl;
import me.chanjar.weixin.cp.bean.WxCpBaseResp;
import me.chanjar.weixin.cp.bean.external.WxCpUpdateRemarkRequest;
import me.chanjar.weixin.cp.bean.external.WxCpWelcomeMsg;
import me.chanjar.weixin.cp.bean.external.contact.ExternalContact;
import me.chanjar.weixin.cp.bean.external.contact.FollowedUser;
import me.chanjar.weixin.cp.bean.external.contact.WxCpExternalContactBatchInfo;
import me.chanjar.weixin.cp.bean.external.contact.WxCpExternalContactInfo;
import org.apache.commons.lang3.StringUtils;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * 企业微信客户 服务实现类
 *
 * @author xxh
 * @since 2021-12-22
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxCustomerServiceImpl extends ServiceImpl<WxCustomerMapper, WxCustomer> implements IWxCustomerService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IWxCustomerStaffService customerStaffService;

    @Autowired
    private IWxCustomerService customerService;

    @Autowired
    private IWxCustomerInfoService customerInfoService;

    @Autowired
    private IWxGroupChatMemberService groupChatMemberService;

    @Autowired
    private IWxGroupChatService groupChatService;

    @Autowired
    private IWxCustomerStaffTagService customerStaffTagService;

    @Autowired
    private IWxTagService tagService;

    @Autowired
    private IWxStaffTransferInfoService staffTransferInfoService;

    @Autowired
    private IWxCustomerLossInfoService customerLossInfoService;

    @Autowired
    private WxCpConfiguration wxCpConfiguration;



    @Autowired
    private IWxGroupChatMemberService chatMemberService;

    @Autowired
    private IWxCustomerStaffTagService staffTagService;

    @Autowired
    private IBrCustomerDynamicService customerDynamicService;

    @Autowired
    private IBrJourneyStageCustomerService journeyStageCustomerService;

    @Autowired
    private IBrJourneyStageService journeyStageService;

    @Autowired
    private IBrJourneyService journeyService;

    @Autowired
    private RedissonClient redissonClient;

    @Autowired
    private IWxCustomerService wxCustomerService;

    @Autowired
    private ISysRoleStaffService roleStaffService;

    @Autowired
    private IWxCustomerStaffAssistService customerStaffAssistService;


    @Autowired
    private IWxResignedStaffCustomerService resignedStaffCustomerService;


    @Override
    public IPage<WxCustomerVO> pageList(WxCustomerPageDTO dto) {
        if (dto.getNoTransferInfoStatus() != null) {
            List<WxStaffTransferInfo> list = staffTransferInfoService.list(new QueryWrapper<WxStaffTransferInfo>().lambda()
                    .le(WxStaffTransferInfo::getExtCorpId, dto.getExtCorpId())
                    .in(WxStaffTransferInfo::getStatus, dto.getNoTransferInfoStatus()));

            List<String> customerExtIds = list.stream().map(WxStaffTransferInfo::getCustomerExtId).collect(Collectors.toList());
            List<WxCustomerVO> wxCustomerVOS = find(dto.getExtCorpId(), customerExtIds);
            dto.setNoCustomerIds(Optional.ofNullable(wxCustomerVOS).orElse(new ArrayList<>()).stream().map(WxCustomerVO::getId).collect(Collectors.toList()));
        }
        /*LambdaQueryWrapper<WxCustomer> wrapper = new QueryWrapper<WxCustomer>().lambda()
                .eq(StringUtils.isNotBlank(dto.getExtCorpId()), WxCustomer::getExtCorpId, dto.getExtCorpId())
                .in(ListUtils.isNotEmpty(dto.getExtCreatorId()), WxCustomer::getExtCreatorId, dto.getExtCreatorId())
                .ge(dto.getCreatedAtBegin() != null, WxCustomer::getCreatedAt, dto.getCreatedAtBegin())getByIdAndStaffId
                .le(dto.getCreatedAtEnd() != null, WxCustomer::getCreatedAt, dto.getCreatedAtEnd())
                .eq(dto.getGender() != null, WxCustomer::getGender, dto.getGender())
                .eq(dto.getType() != null, WxCustomer::getType, dto.getType())
                .like(StringUtils.isNotBlank(dto.getName()), WxCustomer::getName, dto.getName())
                .orderByDesc(WxCustomer::getCreatedAt);*/

        dto.setLoginStaffExtId(JwtUtil.getExtUserId()).setIsEnterpriseAdmin(roleStaffService.isEnterpriseAdmin());
        return baseMapper.list(new Page<>(dto.getPageNum(), dto.getPageSize()), dto).convert(this::translation);
    }


    @Override
    public IPage<WxCustomerVO> dropDownPageList(WxCustomerDropDownPageDTO dto) {
        dto.setLoginStaffExtId(JwtUtil.getExtUserId()).setIsEnterpriseAdmin(roleStaffService.isEnterpriseAdmin());

        //分页查询
        IPage<WxCustomer> page = baseMapper.dropDownPageList(new Page<>(dto.getPageNum(), dto.getPageSize()), dto);
        return page.convert(this::translation);
    }

    @Override
    public IPage<WxCustomerVO> pageCustomerList(BrJourneyCustomerPageDTO dto) {
        return baseMapper.pageCustomerList(new Page<>(dto.getPageNum(), dto.getPageSize()), dto).convert(this::translation);
    }

    @Override
    public WxCustomerVO findById(String id) {
        return translation(checkExists(id), true);
    }


    @Override
    public WxCustomerVO translation(WxCustomer wxCustomer) {
        return translation(wxCustomer, false);
    }

    @Override
    public void staffDeleteCustomer(WxStaffDeleteCustomerDTO customerDTO) {

        //1、新增流水
        Staff staff = staffService.find(customerDTO.getExtCorpId(), customerDTO.getStaffExtId());
        WxCustomer wxCustomer = Optional.ofNullable(customerService.find(customerDTO.getExtCorpId(), customerDTO.getCustomerExtId())).orElse(new WxCustomer());
        WxCustomerStaff customerStaff = Optional.ofNullable(customerStaffService.checkExists(wxCustomer.getExtCorpId(), staff.getExtId(), wxCustomer.getExtId())).orElse(new WxCustomerStaff());
        WxCustomerLossInfoSaveDTO wxCustomerLossInfoSaveDTO = new WxCustomerLossInfoSaveDTO()
                .setDeleteByTransfer(customerDTO.getDeleteByTransfer())
                .setStaffId(Optional.ofNullable(staff).orElse(new Staff()).getId())
                .setCustomerId(wxCustomer.getId())
                .setCustomerStaffId(customerStaff.getId())
                .setExtCorpId(customerDTO.getExtCorpId())
                .setCreateTime(new Date())
                .setType(customerDTO.getType())
                .setDeleteTime(customerDTO.getDeleteTime())
                .setAddTime(customerStaff.getCreateTime())
                .setExtCustomerId(wxCustomer.getExtId())
                .setTagExtIds(Optional.ofNullable(customerStaffTagService.list(new LambdaQueryWrapper<WxCustomerStaffTag>()
                        .eq(WxCustomerStaffTag::getExtCorpId, customerDTO.getExtCorpId())
                        .eq(WxCustomerStaffTag::getExtCustomerId, customerStaff.getExtCustomerId())
                )).orElse(new ArrayList<>()).stream().map(WxCustomerStaffTag::getExtTagId).collect(Collectors.toList()));

        //客户删除员工
        if (Objects.equals(WxCustomerLossInfo.TYPE_CUSTOMER_DELETE_STAFF, customerDTO.getType())) {
            log.info("客户删除员工");
            customerStaff.setIsDeletedStaff(true).setUpdatedAt(new Date());
            customerStaffService.updateById(customerStaff);

            if (OptionalLong.of(customerStaffService.count(new LambdaQueryWrapper<WxCustomerStaff>()
                    .eq(WxCustomerStaff::getExtCorpId, customerDTO.getExtCorpId())
                    .eq(WxCustomerStaff::getExtCustomerId, wxCustomer.getExtId())
                    .and(wrapper -> wrapper.eq(WxCustomerStaff::getIsDeletedStaff, false).or().isNull(WxCustomerStaff::getIsDeletedStaff))
            )).orElse(0) < 1) {
                customerService.updateById(wxCustomer.setIsDeletedStaff(true));
            }
        } else {
            log.info("员工删除客户");
            //2、判断是否还有别的跟进人员，如果有则删除跟进关系、从客户旅程中移除，如果没有删除跟进关系,客户信息,客户详情信息,客户-标签
            if (OptionalLong.of(customerStaffService.count(new LambdaQueryWrapper<WxCustomerStaff>().eq(WxCustomerStaff::getExtCorpId, customerDTO.getExtCorpId())
                    .eq(WxCustomerStaff::getExtCustomerId, customerDTO.getCustomerExtId()))).orElse(0) < 2) {
                customerService.removeById(wxCustomer.getId());

                //记录删除的时候的客户旅程信息
                wxCustomerLossInfoSaveDTO.setJourneyStageIds(Optional.ofNullable(journeyStageCustomerService.list(
                        new LambdaQueryWrapper<BrJourneyStageCustomer>()
                                .eq(BrJourneyStageCustomer::getExtCorpId, customerDTO.getExtCorpId())
                                .eq(BrJourneyStageCustomer::getCustomerExtId, wxCustomer.getExtId())
                )).orElse(new ArrayList<>()).stream().map(BrJourneyStageCustomer::getJourneyStageId).collect(Collectors.toList()));

                journeyStageCustomerService.remove(new LambdaQueryWrapper<BrJourneyStageCustomer>()
                        .eq(BrJourneyStageCustomer::getExtCorpId, customerDTO.getExtCorpId())
                        .eq(BrJourneyStageCustomer::getCustomerExtId, wxCustomer.getId())
                );
            }
            if (StringUtils.isNotBlank(customerStaff.getId())) {
                customerStaffService.removeById(customerStaff.getId());
                customerInfoService.remove(new LambdaQueryWrapper<WxCustomerInfo>()
                        .eq(WxCustomerInfo::getExtCorpId, customerStaff.getExtCorpId())
                        .eq(WxCustomerInfo::getExtStaffId, customerStaff.getExtStaffId())
                        .eq(WxCustomerInfo::getExtCustomerId, customerStaff.getExtCustomerId()));

                customerStaffTagService.remove(new LambdaQueryWrapper<WxCustomerStaffTag>()
                        .eq(WxCustomerStaffTag::getExtCorpId, customerStaff.getExtCorpId())
                        .in(WxCustomerStaffTag::getExtCustomerId, customerStaff.getExtCustomerId()));
            }

            //3、更新员工的客户数
            staff.setCustomerCount(Math.toIntExact(OptionalLong.of(customerStaffService.count(new LambdaQueryWrapper<WxCustomerStaff>()
                    .eq(WxCustomerStaff::getExtCorpId, wxCustomer.getExtCorpId())
                    .eq(WxCustomerStaff::getExtStaffId, staff.getExtId()))).orElse(0)));
            staffService.updateById(staff);
        }

        WxCustomerLossInfo wxCustomerLossInfo = customerLossInfoService.save(wxCustomerLossInfoSaveDTO.setStaffExtId(staff.getExtId()));
        log.info("新增流失记录,入参：【{}】,出参【{}】", wxCustomerLossInfoSaveDTO, wxCustomerLossInfo);


    }

    @Override
    public List<String> findByNameIncludeDel(String extCorpId, String name) {
        return baseMapper.findByName(extCorpId, name);
    }

    @Override
    public List<WxCustomerVO> findByExtIdsIncludeDel(String extCorpId, List<String> extIds) {
        return baseMapper.findByExtIds(extCorpId, extIds);
    }

    /**
     * 翻译
     *
     * @param wxCustomer 实体
     * @return WxCustomerVO 结果集
     * @author xxh
     * @date 2021-12-22
     */
    private WxCustomerVO translation(WxCustomer wxCustomer, boolean hasDetail) {
        WxCustomerVO vo = new WxCustomerVO();
        if (wxCustomer == null) {
            return null;
        }
        String extCorpId = wxCustomer.getExtCorpId();
        BeanUtils.copyProperties(wxCustomer, vo);
        if (StringUtils.isNotBlank(wxCustomer.getExtCreatorId())) {
            StaffVO staff = staffService.translation(staffService.find(wxCustomer.getExtCorpId(), wxCustomer.getExtCreatorId()));
            vo.setExtCreatorAvatar(staff.getAvatarUrl()).setExtCreatorName(staff.getName()).setCreatorStaff(staff);
        }

        WxCustomerStaff customerStaff = customerStaffService.getOne(new LambdaQueryWrapper<WxCustomerStaff>()
                .eq(WxCustomerStaff::getExtStaffId, wxCustomer.getExtCreatorId())
                .eq(WxCustomerStaff::getExtCustomerId, wxCustomer.getExtId())
        );
        String addWay = Optional.ofNullable(customerStaff).orElse(new WxCustomerStaff()).getAddWay();
        vo.setAddWay(addWay).setAddWayName(WxCustomerAddWayEnum.getName(addWay));

        List<WxCustomerStaff> customerStaffs = customerStaffService.list(new LambdaQueryWrapper<WxCustomerStaff>()
                .eq(WxCustomerStaff::getExtCorpId, wxCustomer.getExtCorpId())
                .eq(WxCustomerStaff::getExtCustomerId, wxCustomer.getExtId()));


        if (hasDetail) {
            vo.setCustomerInfo(customerInfoService.getOne(new LambdaQueryWrapper<WxCustomerInfo>()
                    .eq(WxCustomerInfo::getExtCorpId, wxCustomer.getExtCorpId())
                    .eq(WxCustomerInfo::getExtCustomerId, wxCustomer.getExtId())
                    .eq(WxCustomerInfo::getExtStaffId, wxCustomer.getExtCreatorId())));

            //关联群聊列表
            List<WxGroupChatMemberVO> groupChatMemberList = groupChatMemberService.queryList(new WxGroupChatMemberQueryDTO().setExtCorpId(wxCustomer.getExtCorpId())
                    .setType(WxGroupChatMember.TYPE_EXTERNAL_CONTACT).setUserId(wxCustomer.getExtId()));
            List<String> groupExtIds = Optional.ofNullable(groupChatMemberList).orElse(new ArrayList<>()).stream().map(WxGroupChatMemberVO::getExtChatId).collect(Collectors.toList());
            if (ListUtils.isNotEmpty(groupExtIds)) {
                List<WxGroupChat> list = groupChatService.list(new LambdaQueryWrapper<WxGroupChat>().eq(WxGroupChat::getExtChatId, wxCustomer.getExtCorpId()).in(WxGroupChat::getExtChatId, groupExtIds).orderByDesc(WxGroupChat::getUpdatedAt));
                vo.setGroupChatList(list);
            }
        }

        List<StaffFollowVO> staffFollowVOS = new ArrayList<>();

        //跟进员工列表
        if (ListUtils.isNotEmpty(customerStaffs)) {
            List<String> extStaffIds = customerStaffs.stream().map(WxCustomerStaff::getExtStaffId).collect(Collectors.toList());
            if (ListUtils.isNotEmpty(extStaffIds)) {

                customerStaffs.forEach(entry -> {
                    Staff staff = staffService.find(extCorpId, entry.getExtStaffId());
                    if (staff != null) {
                        StaffFollowVO staffFollowVO = new StaffFollowVO();
                        BeanUtils.copyProperties(staff, staffFollowVO);
                        List<WxCustomerStaffTag> staffTags = customerStaffTagService.list(new LambdaQueryWrapper<WxCustomerStaffTag>()
                                .eq(WxCustomerStaffTag::getExtCorpId, extCorpId)
                                .eq(WxCustomerStaffTag::getExtCustomerId, entry.getExtCustomerId())
                        );
                        List<String> tagExtIds = Optional.ofNullable(staffTags).orElse(new ArrayList<>()).stream().map(WxCustomerStaffTag::getExtTagId).distinct().collect(Collectors.toList());
                        if (ListUtils.isNotEmpty(tagExtIds)) {
                            staffFollowVO.setTags(tagService.list(new LambdaQueryWrapper<WxTag>().eq(WxTag::getExtCorpId, extCorpId).in(WxTag::getExtId, tagExtIds)));
                        }
                        staffFollowVO.setAddWay(entry.getAddWay()).setAddWayName(WxCustomerAddWayEnum.getName(entry.getAddWay()));
                        staffFollowVOS.add(staffFollowVO);
                    }
                });
                vo.setFollowStaffList(staffFollowVOS);
            }
        }


        //设置所有的标签
        if (ListUtils.isNotEmpty(staffFollowVOS)) {
            List<WxTag> tags = new ArrayList<>();
            staffFollowVOS.stream().map(StaffFollowVO::getTags).filter(ListUtils::isNotEmpty).forEach(tags::addAll);
            Optional.of(tags).orElse(new ArrayList<>()).sort(Comparator.comparing(WxTag::getCreatedAt).reversed());
            vo.setTags(tags.stream().distinct().collect(Collectors.toList()));
        }


        //查询转移情况
        WxStaffTransferInfo staffTransferInfo = staffTransferInfoService.getOne(new LambdaQueryWrapper<WxStaffTransferInfo>()
                .eq(WxStaffTransferInfo::getExtCorpId, vo.getExtCorpId())
                .eq(WxStaffTransferInfo::getCustomerExtId, vo.getExtId())
                .orderByDesc(WxStaffTransferInfo::getCreateTime)
                .last("limit 1")
        );
        vo.setStaffTransferInfo(staffTransferInfo);
        return vo;
    }


    @Override
    public WxCustomer checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        WxCustomer byId = getById(id);
        if (byId == null || !byId.getHasFriend()) {
            throw new BaseException("企业微信客户不存在");
        }
        return byId;
    }

    @Override
    public WxCustomer checkExists(String extCorpId, String extId) {
        return getOne(new LambdaQueryWrapper<WxCustomer>()
                .eq(WxCustomer::getExtCorpId, extCorpId)
                .eq(WxCustomer::getExtId, extId)
                .eq(WxCustomer::getHasFriend, true)
        );
    }

    @Override
    public WxCustomer checkExistsWithNoFriend(String extCorpId, String extId) {
        return getOne(new LambdaQueryWrapper<WxCustomer>()
                .eq(WxCustomer::getExtCorpId, extCorpId)
                .eq(WxCustomer::getExtId, extId));
    }

    @Override
    public void sync(String extCorpId) {

        //获取该企业，状态为未退出企业的员工
        List<Staff> list = staffService.list(new LambdaQueryWrapper<Staff>()
                .eq(Staff::getExtCorpId, extCorpId)
        //        .ne(Staff::getStatus, 5)
        );

        //批量遍历同步数据（每次同步100个员工的客户数据）
        WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
        List<Staff> staffList = new ArrayList<>();
        Optional.of(ListUtils.subCollection(Optional.ofNullable(list).orElse(new ArrayList<>()), 100))
                .orElse(new ArrayList<>()).stream().filter(ListUtils::isNotEmpty).forEach(staffList::addAll);

        List<String> staffExtIds = staffList.stream().map(Staff::getExtId).collect(Collectors.toList());
        try {

            List<WxCpExternalContactBatchInfo.ExternalContactInfo> externalContactList = new ArrayList<>();
            if (ListUtils.isNotEmpty(staffExtIds)) {
                //调用批量获取客户信息接口（每次最多只能获取100条数据，因此得递归分页获取所有的）
                WxCpExternalContactBatchInfo contactDetailBatch = externalContactService.getContactDetailBatch(staffExtIds.toArray(new String[0]), null, 100);
                externalContactList = contactDetailBatch.getExternalContactList();
                getContactDetailBatch(externalContactService, externalContactList, staffExtIds, contactDetailBatch.getNextCursor());
            }

            log.info("【同步客户】员工数量：{}，客户数量：{}", staffExtIds.size(), externalContactList.size());

            //还存在的客户extId列表
            List<String> existCustomerExtIds = new ArrayList<>();

            //遍历客户信息
            Map<String, List<String>> staffExtIdAndCustomerExtIdsMap = new HashMap<>();
            Optional.ofNullable(externalContactList).orElse(new ArrayList<>()).forEach(externalContactInfo -> {

                //刷新客户信息，客户-标签关联
                WxCustomer customer = refreshCustomer(externalContactInfo, extCorpId);
                existCustomerExtIds.add(customer.getExtId());

                String extStaffId = externalContactInfo.getFollowInfo().getUserId();
                List<String> customerExtIds = Optional.ofNullable(staffExtIdAndCustomerExtIdsMap.get(extStaffId)).orElse(new ArrayList<>());
                customerExtIds.add(customer.getExtId());
                staffExtIdAndCustomerExtIdsMap.put(extStaffId, customerExtIds);
            });

            //移除不存在的客户信息（移除客户，客户跟进情况，客户详情，客户-标签，员工客户数量）
            List<String> allCustomerExtIds = Optional.ofNullable(list(new LambdaQueryWrapper<WxCustomer>()
                            .select(WxCustomer::getExtId)
                            .eq(WxCustomer::getExtCorpId, extCorpId)
                            .eq(WxCustomer::getHasFriend, true)))
                    .orElse(new ArrayList<>()).stream().map(WxCustomer::getExtId).collect(Collectors.toList());
            allCustomerExtIds.removeAll(existCustomerExtIds);

            if (ListUtils.isNotEmpty(allCustomerExtIds)) {
                //移除客户
                remove(new LambdaQueryWrapper<WxCustomer>()
                        .eq(WxCustomer::getExtCorpId, extCorpId)
                        .in(WxCustomer::getExtId, allCustomerExtIds));

                //移除客户-标签
                customerStaffTagService.remove(new LambdaQueryWrapper<WxCustomerStaffTag>()
                        .eq(WxCustomerStaffTag::getExtCorpId, extCorpId)
                        .in(WxCustomerStaffTag::getExtCustomerId, allCustomerExtIds));

                //移除客户跟进情况
                customerStaffService.remove(new LambdaQueryWrapper<WxCustomerStaff>()
                        .eq(WxCustomerStaff::getExtCorpId, extCorpId)
                        .in(WxCustomerStaff::getExtCustomerId, allCustomerExtIds));

                //移除客户详情
                customerInfoService.remove(new LambdaQueryWrapper<WxCustomerInfo>()
                        .eq(WxCustomerInfo::getExtCorpId, extCorpId)
                        .in(WxCustomerInfo::getExtCustomerId, allCustomerExtIds));
            }

            staffExtIdAndCustomerExtIdsMap.forEach((key, value) -> {
                //移除客户-标签
                customerStaffTagService.remove(new LambdaQueryWrapper<WxCustomerStaffTag>()
                        .eq(WxCustomerStaffTag::getExtCorpId, extCorpId)
                        .eq(WxCustomerStaffTag::getExtStaffId, key)
                        .notIn(ListUtils.isNotEmpty(value), WxCustomerStaffTag::getExtCustomerId, value));

                //移除客户跟进情况
                customerStaffService.remove(new LambdaQueryWrapper<WxCustomerStaff>()
                        .eq(WxCustomerStaff::getExtCorpId, extCorpId)
                        .eq(WxCustomerStaff::getExtStaffId, key)
                        .notIn(ListUtils.isNotEmpty(value), WxCustomerStaff::getExtCustomerId, value));

                //移除客户详情
                customerInfoService.remove(new LambdaQueryWrapper<WxCustomerInfo>()
                        .eq(WxCustomerInfo::getExtCorpId, extCorpId)
                        .eq(WxCustomerInfo::getExtStaffId, key)
                        .notIn(ListUtils.isNotEmpty(value), WxCustomerInfo::getExtCustomerId, value));


            });


            //刷新员工客户数量
            Optional.ofNullable(customerStaffService.countGroupByStaffExtId(extCorpId)).orElse(new ArrayList<>()).forEach(countVO ->
                    staffService.update(new LambdaUpdateWrapper<Staff>().eq(Staff::getExtCorpId, extCorpId)
                            .eq(Staff::getExtId, countVO.getExtStaffId())
                            .set(Staff::getCustomerCount, Optional.ofNullable(countVO.getTotal()).orElse(0))));

        } catch (
                WxErrorException e) {
            log.error("同步客户信息失败，企业ID：【{}】,异常信息：【{}】", extCorpId, e);
            throw new BaseException("同步客户信息异常");
        }

    }

    @Override
    public void sync(String extCorpId, boolean isSync) {

    }

    @Validated
    public WxCustomer refreshCustomer(WxCpExternalContactBatchInfo.ExternalContactInfo externalContactInfo, String extCorpId) {

        ExternalContact externalContact = externalContactInfo.getExternalContact();
        FollowedUser followInfo = externalContactInfo.getFollowInfo();
        String operatorUserId = followInfo.getOperatorUserId();
        String staffExtId = followInfo.getUserId();
        String customerExtId = externalContact.getExternalUserId();

        //更新客户信息
        WxCustomer oldCustomer = customerService.checkExists(extCorpId, customerExtId);
        WxCustomer customer = new WxCustomer();
        BeanUtils.copyProperties(externalContact, customer);
        customer.setId(UUID.get32UUID())
                .setUnionid(externalContact.getUnionId())
                .setExtCorpId(extCorpId)
                .setExtId(customerExtId);
        if (oldCustomer != null) {
            customer.setUpdatedAt(new Date())
                    .setIsDeletedStaff(oldCustomer.getIsDeletedStaff())
                    .setExtCreatorId(oldCustomer.getExtCreatorId())
                    .setCreatedAt(oldCustomer.getCreatedAt())
                    .setId(oldCustomer.getId())
                    //头像和性别第三方拿不到，暂时从公众号授权拿
                    .setGender(oldCustomer.getGender())
                    .setAvatar(oldCustomer.getAvatar());
            customerService.updateById(customer);
        } else {
            customer.setExtCreatorId(staffExtId)
                    .setCreatedAt(new Date(followInfo.getCreateTime() * 1000));
            customerService.save(customer);
        }

        //更新客户员工更进情况数据
        WxCustomerStaff oldCustomerStaff = customerStaffService.checkExists(extCorpId, staffExtId, customerExtId);
        WxCustomerStaff customerStaff = new WxCustomerStaff();
        BeanUtils.copyProperties(followInfo, customerStaff);
        customerStaff.setOperUserId(operatorUserId)
                .setRemarkMobiles(Arrays.asList(Optional.ofNullable(followInfo.getRemarkMobiles()).orElse(new String[]{})))
                .setExtCreatorId(customer.getExtCreatorId())
                .setRemarkCorpName(followInfo.getRemarkCompany())
                .setExtStaffId(staffExtId)
                .setExtCustomerId(customerExtId)
                .setCustomerId(customer.getId())
                .setExtCorpId(extCorpId)
                .setId(UUID.get32UUID())
                .setCreateTime(new Date(followInfo.getCreateTime() * 1000))
                .setCreatedAt(new Date(followInfo.getCreateTime() * 1000));
        if (oldCustomerStaff != null) {
            customerStaff.setCreatedAt(oldCustomerStaff.getCreatedAt())
                    .setIsDeletedStaff(oldCustomerStaff.getIsDeletedStaff())
                    .setUpdatedAt(new Date())
                    .setId(oldCustomerStaff.getId());
            customerStaffService.updateById(customerStaff);
        } else {
            customerStaffService.save(customerStaff);

            //刷新员工客户数
            Staff staff = staffService.getOne(new QueryWrapper<Staff>().lambda().eq(Staff::getExtId, staffExtId).eq(Staff::getExtCorpId, extCorpId));
            if (staff != null) {
                staff.setCustomerCount(Optional.ofNullable(staff.getCustomerCount()).orElse(0) + 1);
                staffService.updateById(staff);
            }
        }


        //更新客户-标签
        List<String> customerStaffTagIds = new ArrayList<>();
        Optional.of(Arrays.asList(Optional.ofNullable(followInfo.getTagIds()).orElse(new String[]{}))).orElse(new ArrayList<>()).forEach(tagId -> {
            WxCustomerStaffTag staffTagOld = customerStaffTagService.getOne(new LambdaQueryWrapper<WxCustomerStaffTag>()
                    .eq(WxCustomerStaffTag::getExtCorpId, extCorpId)
                    .eq(WxCustomerStaffTag::getExtCustomerId, customerExtId)
                    .eq(WxCustomerStaffTag::getExtStaffId, staffExtId)
                    .eq(WxCustomerStaffTag::getExtTagId, tagId)
            );

            WxCustomerStaffTag staffTag = new WxCustomerStaffTag();
            if (staffTagOld == null) {
                staffTag.setId(UUID.get32UUID())
                        .setExtTagId(tagId)
                        .setExtCustomerId(customerExtId)
                        .setExtStaffId(staffExtId)
                        .setExtCorpId(extCorpId)
                        .setCreatedAt(new Date());
                customerStaffTagService.save(staffTag);
            } else {
                staffTag.setId(staffTagOld.getId())
                        .setExtCustomerId(customerExtId)
                        .setExtStaffId(staffExtId)
                        .setExtTagId(tagId)
                        .setCreatedAt(staffTagOld.getCreatedAt())
                        .setUpdatedAt(new Date())
                        .setExtCorpId(extCorpId);
                customerStaffTagService.updateById(staffTag);
            }
            customerStaffTagIds.add(tagId);
        });

        //移除不存在的客户-标签关联
        List<String> tagIds = customerStaffTagIds.stream().distinct().collect(Collectors.toList());
        customerStaffTagService.remove(new LambdaQueryWrapper<WxCustomerStaffTag>()
                .eq(WxCustomerStaffTag::getExtCorpId, extCorpId)
                .eq(WxCustomerStaffTag::getExtCustomerId, customerExtId)
                .eq(WxCustomerStaffTag::getExtStaffId, staffExtId)
                .notIn(ListUtils.isNotEmpty(tagIds), WxCustomerStaffTag::getExtTagId, tagIds));


        return customer;
    }


    @Override
    public WxCustomerVO updateCustomerInfo(WxCustomerInfoUpdateDTO dto) {
        WxCustomer customer = getById(dto.getCustomerId());
        if (customer == null) {
            throw new BaseException("客户不存在");
        }
        Staff staff = staffService.checkExists(dto.getStaffId());
        WxCustomerInfo old = customerInfoService.getOne(new LambdaQueryWrapper<WxCustomerInfo>()
                .eq(WxCustomerInfo::getExtCorpId, customer.getExtCorpId())
                .eq(WxCustomerInfo::getExtCustomerId, customer.getExtId())
                .eq(WxCustomerInfo::getExtStaffId, staff.getExtId()));

        WxCustomerInfo customerInfo = new WxCustomerInfo();
        BeanUtils.copyProperties(dto, customerInfo);
        customerInfo.setExtCorpId(customer.getExtCorpId())
                .setExtCreatorId(customer.getExtCreatorId())
                .setExtCustomerId(customer.getExtId())
                .setExtStaffId(staff.getExtId());
        if (old == null) {
            customerInfo.setCreatedAt(new Date())
                    .setRemarkField("{}")
                    .setId(UUID.get32UUID());
            customerInfoService.save(customerInfo);
        } else {
            customerInfo.setId(old.getId())
                    .setCreatedAt(old.getCreatedAt())
                    .setRemarkField("{}")
                    .setUpdatedAt(new Date());
            customerInfoService.updateById(customerInfo);
        }
        return translation(customer);
    }

    @Override
    public void exportList(WxCustomerExportDTO dto) {
       /* LambdaQueryWrapper<WxCustomer> wrapper = new QueryWrapper<WxCustomer>().lambda()
                .eq(StringUtils.isNotBlank(dto.getExtCorpId()), WxCustomer::getExtCorpId, dto.getExtCorpId())
                .eq(StringUtils.isNotBlank(dto.getExtCreatorId()), WxCustomer::getExtCreatorId, dto.getExtCreatorId())
                .ge(dto.getCreatedAtBegin() != null, WxCustomer::getCreatedAt, dto.getCreatedAtBegin())
                .le(dto.getCreatedAtEnd() != null, WxCustomer::getCreatedAt, dto.getCreatedAtEnd())
                .eq(dto.getGender() != null, WxCustomer::getGender, dto.getGender())
                .eq(dto.getType() != null, WxCustomer::getType, dto.getType())
                .like(StringUtils.isNotBlank(dto.getName()), WxCustomer::getName, dto.getName());
        List<WxCustomerVO> list = Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(wxCustomer -> translation(wxCustomer, true)).collect(Collectors.toList());*/

        List<WxCustomer> wxCustomerList = baseMapper.queryList(dto);
        List<WxCustomerExportVO> exportVOS = new ArrayList<>();
        wxCustomerList.forEach(wxCustomer -> {
            WxCustomerVO vo = new WxCustomerVO();
            BeanUtils.copyProperties(wxCustomer, vo);
            if (StringUtils.isNotBlank(wxCustomer.getExtCreatorId())) {
                StaffVO staff = staffService.translation(staffService.find(wxCustomer.getExtCorpId(), wxCustomer.getExtCreatorId()));
                if (staff != null) {
//                    vo.setExtCreatorAvatar(staff.getAvatarUrl()).setExtCreatorName("$userName=" + staff.getExtId() + "$");
                }
            }

            WxCustomerStaff customerStaff = customerStaffService.getOne(new LambdaQueryWrapper<WxCustomerStaff>()
                    .eq(WxCustomerStaff::getExtStaffId, wxCustomer.getExtCreatorId())
                    .eq(WxCustomerStaff::getExtCustomerId, wxCustomer.getExtId())
            );

            if (customerStaff != null) {
                String addWay = Optional.ofNullable(customerStaff).orElse(new WxCustomerStaff()).getAddWay();
                vo.setAddWay(addWay)
                        .setDescription(customerStaff.getDescription())
                        .setAddWayName(WxCustomerAddWayEnum.getName(addWay));
            }
            WxCustomerExportVO exportVO = new WxCustomerExportVO();
            BeanUtils.copyProperties(vo, exportVO);
            WxCustomerInfo wxCustomerInfo = customerInfoService.find(wxCustomer.getExtCorpId(), wxCustomer.getExtId(), wxCustomer.getExtCreatorId());
            if (wxCustomerInfo != null) {
                exportVO.setPhoneNumber(wxCustomerInfo.getPhoneNumber())
                        .setGender(wxCustomerInfo.getGender())
                        .setPhoneNumber(wxCustomerInfo.getPhoneNumber())
                        .setAge(wxCustomerInfo.getAge())
                        .setEmail(wxCustomerInfo.getEmail());
            }

            exportVO.setGender(Optional.ofNullable(exportVO.getGender()).orElse(0));
            exportVOS.add(exportVO);
        });

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String title = "客户列表(导出时间: %s)";
        title = String.format(title, dateFormat.format(new Date()));

        EasyPoiUtils.export("客户数据列表", title, null, WxCustomerExportVO.class, exportVOS);
    }

    @Override
    public WxCustomerVO editTag(WxCustomerTagSaveOrUpdateDTO dto) throws WxErrorException {
        //考虑下标签被删的情况，很多时候是关联过来打标签的，刚好写俩方法了
        log.info("客户打标签开始，[{}]", JSON.toJSONString(dto));

        WxCustomer wxCustomer = syncGetCustomer(dto.getId());
        if (wxCustomer == null) {
            log.error("异步打标签找不到客户信息[{}]", JSON.toJSONString(dto));
            throw new BaseException("找不到客户信息");
        }
        Staff staff = staffService.checkExists(dto.getStaffId());
        List<String> addTags = Optional.ofNullable(dto.getAddTags()).orElse(new ArrayList<>()).stream().map(tagId -> tagService.checkExists(tagId).getExtId()).collect(Collectors.toList());
        List<String> removeTags = Optional.ofNullable(dto.getRemoveTags()).orElse(new ArrayList<>()).stream().map(tagId -> tagService.checkExists(tagId).getExtId()).collect(Collectors.toList());

        //开始打标签
        WxCpExternalContactServiceImpl externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
        WxCpBaseResp wxCpBaseResp = externalContactService.markTag(staff.getExtId(), wxCustomer.getExtId(), addTags.toArray(new String[0]), removeTags.toArray(new String[0]));

        //删除客户-标签关联标签
        customerStaffTagService.batchDelete(new BatchDTO<String>().setIds(removeTags));

        //新增客户-标签关联
        WxCustomerStaff customerStaff = Optional.ofNullable(customerStaffService.getOne(new LambdaQueryWrapper<WxCustomerStaff>()
                .eq(WxCustomerStaff::getExtStaffId, staff.getExtId())
                .eq(WxCustomerStaff::getExtCustomerId, wxCustomer.getExtId())
        )).orElse(new WxCustomerStaff());

        List<WxTag> actualAddTags = new ArrayList<>();
        Optional.ofNullable(addTags).orElse(new ArrayList<>()).stream().filter(addTagId -> {

            WxTag wxTag = tagService.checkExists(dto.getExtCorpId(), addTagId);
            return customerStaffTagService.count(new LambdaQueryWrapper<WxCustomerStaffTag>()
                    .eq(WxCustomerStaffTag::getExtTagId, wxTag.getExtId())
                    .eq(WxCustomerStaffTag::getExtStaffId, staff.getExtId())
                    .eq(WxCustomerStaffTag::getExtCustomerId, wxCustomer.getExtId())) == 0;

        }).collect(Collectors.toList()).forEach(addTagId -> {

            WxTag wxTag = tagService.checkExists(dto.getExtCorpId(), addTagId);
            actualAddTags.add(wxTag);
            WxCustomerStaffTag customerStaffTag = new WxCustomerStaffTag()
                    .setId(UUID.get32UUID())
                    .setExtCustomerId(wxCustomer.getExtId())
                    .setExtStaffId(staff.getExtId())
                    .setExtTagId(wxTag.getExtId())
                    .setExtCorpId(wxCustomer.getExtCorpId())
                    .setCreatedAt(new Date());
            customerStaffTagService.save(customerStaffTag);
        });

        //客户动态
        if (ListUtils.isNotEmpty(actualAddTags) && Constants.DYNAMIC_TAG_TYPE_MANUAL.equals(dto.getOrigin())) {
            CustomerDynamicInfoDTO dynamicInfoDTO = new CustomerDynamicInfoDTO()
                    .setTagOrigin(dto.getOrigin())
                    .setTags(actualAddTags);
            customerDynamicService.save(BrCustomerDynamicModelEnum.CUSTOMER_TAG.getCode(),
                    BrCustomerDynamicTypeEnum.MARK_TAG.getCode(), wxCustomer.getExtCorpId(),
                    dto.getOperatorExtId(), wxCustomer.getExtId(), dynamicInfoDTO);
        }
        return translation(wxCustomer);
    }

    private WxCustomer syncGetCustomer(String id) {
        //因为异步的，可能添加客户的方法没走完
        WxCustomer wxCustomer = wxCustomerService.getByIdNewTr(id);
        int retryTimes = 5;
        while (wxCustomer == null && retryTimes-- > 0) {
            wxCustomer = wxCustomerService.getByIdNewTr(id);
            try {
                Thread.sleep(1000);
                log.debug("等待客户完成添加");
            } catch (InterruptedException e) {
                log.error("", e);
            }
        }
        return wxCustomer;
    }

    @Override
    public FailResultVO priorityEditTag(WxCustomerTagSaveOrUpdateDTO dto) {

        dto.setOperatorExtId(JwtUtil.getExtUserId());
        dto.setOrigin(Constants.DYNAMIC_TAG_TYPE_MANUAL);

        String id = UUID.get32UUID();
        EditTagThread editTagThread = new EditTagThread();
        editTagThread.setThreadId(id)
                .setTagSaveOrUpdateDTO(dto)
                .setCreateTime(System.currentTimeMillis())
                .setStatus(EditTagThread.WAIT)
                .setHasPriority(true);

        //存入redis
        redissonClient.getBucket(Constants.EDIT_TAG_REDIS_PRE + id)
                .set(JSON.toJSONString(editTagThread));

        ExecutorList.tagExecutorService.submit(editTagThread);

        //等5秒
        long now = System.currentTimeMillis();
        String execRes;
        FailResultVO result = new FailResultVO();
        EditTagThread res;
        while ((System.currentTimeMillis() - now) <= 5000) {

            execRes = (String) redissonClient.getBucket(Constants.EDIT_TAG_REDIS_PRE + id).get();
            res = JSON.parseObject(execRes, EditTagThread.class);
            result = new FailResultVO();
            BeanUtils.copyProperties(res, result);
            if (EditTagThread.SUCCESS.equals(res.getStatus())) {
                return result;
            } else if (EditTagThread.FAIL.equals(res.getStatus())) {
                return result;
            } else {
                try {
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }

        }
        return result;
    }

    @Override
    public void queueEditTag(WxCustomerTagSaveOrUpdateDTO dto) {

        log.debug("异步打标签参数=[{}]", JSON.toJSONString(dto));

        //把已删除的标签剔除掉,这里一般是关联调用的，有可能标签已经被删了
        List<String> addTags = Optional.ofNullable(dto.getAddTags()).orElse(new ArrayList<>()).stream()
                .filter(e -> tagService.getById(e) != null).collect(Collectors.toList());
        List<String> removeTags = Optional.ofNullable(dto.getRemoveTags()).orElse(new ArrayList<>()).stream()
                .filter(e -> tagService.getById(e) != null).collect(Collectors.toList());

        dto.setAddTags(addTags);
        dto.setRemoveTags(removeTags);

        String id = UUID.get32UUID();
        EditTagThread editTagThread = new EditTagThread();
        editTagThread.setThreadId(id)
                .setTagSaveOrUpdateDTO(dto)
                .setCreateTime(System.currentTimeMillis())
                .setStatus(EditTagThread.WAIT)
                .setHasPriority(false);

        //存入redis
        redissonClient.getBucket(Constants.EDIT_TAG_REDIS_PRE + id)
                .set(JSON.toJSONString(editTagThread));

        ExecutorList.tagExecutorService.submit(editTagThread);

    }

    @Override
    public void updateRemark(WxCpUpdateRemarkRequest wxCpUpdateRemarkRequest, String extCorpId) throws WxErrorException {

        WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
        externalContactService.updateRemark(wxCpUpdateRemarkRequest);

        WxCustomerStaff customerStaff = customerStaffService.checkExists(extCorpId, wxCpUpdateRemarkRequest.getUserId(), wxCpUpdateRemarkRequest.getExternalUserId());
        if (customerStaff != null) {
            customerStaff.setRemark(wxCpUpdateRemarkRequest.getRemark()).setUpdatedAt(new Date());
            customerStaffService.updateById(customerStaff);
        }

    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void sendWelcomeMsg(WxCpWelcomeMsg msg) {

        try {
            WxCpExternalContactService externalContactService = getWxCpExternalContactService();
            externalContactService.sendWelcomeMsg(msg);
        } catch (WxErrorException e) {
            log.error("[{}]发送新客户欢迎语失败，", JSON.toJSONString(msg), e);
        }

    }

    @Override
    public WxCpExternalContactInfo getCustomInfo(String userId) {
        WxCpExternalContactService externalContactService = getWxCpExternalContactService();
        try {
            return externalContactService.getContactDetail(userId, null);
        } catch (WxErrorException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public BatchMarkRes batchMarking(WxCustomerBatchMarkingDTO dto) {

        BatchMarkRes result = new BatchMarkRes();

        Optional.ofNullable(dto.getCustomerIds()).orElse(new ArrayList<>()).forEach(customerId -> {
            WxCustomerTagSaveOrUpdateDTO saveOrUpdateDTO = new WxCustomerTagSaveOrUpdateDTO()
                    .setId(customerId.getCustomerId()).setExtCorpId(dto.getExtCorpId())
                    .setStaffId(staffService.checkExists(customerId.getExtStaffId(), dto.getExtCorpId())
                            .getId())
                    .setAddTags(dto.getTagIds())
                    .setRemoveTags(dto.getRemoveTags());

            FailResultVO threadRes = priorityEditTag(saveOrUpdateDTO);
            WxCustomerStaffVO wxCustomerStaffVO = customerStaffService.find(saveOrUpdateDTO.getExtCorpId(), saveOrUpdateDTO.getId(), customerId.getExtStaffId());
            wxCustomerStaffVO.setFailMsg(threadRes.getFailMsg());
            if (EditTagThread.SUCCESS.equals(threadRes.getStatus())) {
                result.getSuccessList().add(wxCustomerStaffVO);
            } else {
                result.getFailList().add(wxCustomerStaffVO);
            }

        });

        return result;
    }

    @Override
    public WxCustomer find(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        return baseMapper.findOne(id);
    }

    @Override
    public WxCustomer find(String extCorpId, String extId) {
        if (StringUtils.isBlank(extId) || StringUtils.isBlank(extCorpId)) {
            return null;
        }
        return baseMapper.findByExtCorpIdAndExtId(extCorpId, extId);
    }

    @Override
    public List<WxCustomerVO> find(String extCorpId, List<String> extIds) {
        if (ListUtils.isEmpty(extIds) || StringUtils.isBlank(extCorpId)) {
            return null;
        }
        return baseMapper.findByExtIds(extCorpId, extIds);
    }

    private void getContactDetailBatch(WxCpExternalContactService externalContactService, List<WxCpExternalContactBatchInfo.ExternalContactInfo> list, List<String> staffIds, String nextCursor) throws WxErrorException {
        if (StringUtils.isBlank(nextCursor)) {
            return;
        }
        WxCpExternalContactBatchInfo contactDetailBatch = externalContactService.getContactDetailBatch(staffIds.toArray(new String[0]), nextCursor, 100);
        List<WxCpExternalContactBatchInfo.ExternalContactInfo> externalContactList = contactDetailBatch.getExternalContactList();
        if (ListUtils.isNotEmpty(externalContactList)) {
            list.addAll(contactDetailBatch.getExternalContactList());
        }
        String next = contactDetailBatch.getNextCursor();
        if (StringUtils.isNotBlank(next)) {
            getContactDetailBatch(externalContactService, list, staffIds, nextCursor);
        }
    }

    private WxCpExternalContactService getWxCpExternalContactService() {
        return new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
    }

    @Override
    public List<WxCustomer> getCustomerListByCondition(WxMsgTemplateCountCustomerDTO dto) {
        //企业查询条件
        List<WxCustomer> result = list(new QueryWrapper<WxCustomer>().lambda()
                .eq(WxCustomer::getExtCorpId, dto.getExtCorpId()));
        if (ListUtils.isEmpty(result)) {
            return new ArrayList<>();
        }
        //选择全部客户
        if (dto.getHasAllCustomer()) {
            return result;
        }
        //客户id查询条件
        if (ListUtils.isNotEmpty(dto.getCustomerIds())) {
            result = result.stream().filter(customer -> dto.getCustomerIds().contains(customer.getExtId())).collect(Collectors.toList());
        }

        //群聊查询条件
        if (ListUtils.isNotEmpty(dto.getChatIds())) {
            List<WxGroupChatMember> list = chatMemberService.list(new QueryWrapper<WxGroupChatMember>().lambda()
                    .in(WxGroupChatMember::getExtChatId, dto.getChatIds()));
            if (ListUtils.isEmpty(list)) {
                return new ArrayList<>();
            }
            //获取客户在我们系统的id
            List<String> customerExtIds = list.stream().map(WxGroupChatMember::getUserId).collect(Collectors.toList());
            result = list(new QueryWrapper<WxCustomer>().lambda()
                    .in(WxCustomer::getExtId, result.stream().map(WxCustomer::getExtId).collect(Collectors.toList()))
                    .in(WxCustomer::getExtId, customerExtIds));
            if (ListUtils.isEmpty(result)) {
                return new ArrayList<>();
            }
        }
        //性别
        if (dto.getSex() != null) {
            result = list(new QueryWrapper<WxCustomer>().lambda()
                    .in(WxCustomer::getExtId, result.stream().map(WxCustomer::getExtId).collect(Collectors.toList()))
                    .eq(WxCustomer::getGender, dto.getSex()));
            if (ListUtils.isEmpty(result)) {
                return new ArrayList<>();
            }
        }
        //满足标签查询条件
        if (ListUtils.isNotEmpty(dto.getChooseTags()) && dto.getChooseTagType() != null) {

            LambdaQueryWrapper<WxCustomerStaffTag> queryWrapper = new QueryWrapper<WxCustomerStaffTag>()
                    .lambda().eq(WxCustomerStaffTag::getExtCorpId, dto.getExtCorpId());
            //满足其一
            if (WxMsgTemplate.CHOOSE_TYPE_ANY.equals(dto.getChooseTagType())) {
                queryWrapper.in(WxCustomerStaffTag::getExtTagId, dto.getChooseTags());
            } else if (WxMsgTemplate.CHOOSE_TYPE_ALL.equals(dto.getChooseTagType())) {
                //全满足
                List<WxCustomerStaffTag> allCustomerStaffTags = staffTagService.list(new QueryWrapper<WxCustomerStaffTag>()
                        .lambda().eq(WxCustomerStaffTag::getExtCorpId, dto.getExtCorpId()));
                Map<String, List<String>> allCustomerTagMap = new HashMap<>();
                allCustomerStaffTags.forEach(e -> {
                    List<String> tagExtIds = allCustomerTagMap.computeIfAbsent(e.getExtCustomerId(),
                            k -> new ArrayList<>());
                    tagExtIds.add(e.getExtTagId());
                });

                //满足条件的extCustomerId
                List<String> customerExtIds = new ArrayList<>();
                allCustomerTagMap.forEach((extCustomerId, tagList) -> {
                    if (tagList.containsAll(dto.getChooseTags())) {
                        customerExtIds.add(extCustomerId);
                    }
                });

                if (ListUtils.isEmpty(customerExtIds)) {
                    return new ArrayList<>();
                }

                queryWrapper.in(WxCustomerStaffTag::getExtCustomerId, customerExtIds);
            }//没标签的就全查出来

            List<WxCustomerStaffTag> customerTagList = staffTagService.list(queryWrapper);
            //为空就可以返回了
            if (ListUtils.isEmpty(customerTagList)) {
                return new ArrayList<>();
            }
            List<String> customerExtIds = customerTagList.stream().map(WxCustomerStaffTag::getExtCustomerId).collect(Collectors.toList());
            //查出结果
            result = list(new QueryWrapper<WxCustomer>().lambda()
                    .in(WxCustomer::getExtId, result.stream().map(WxCustomer::getExtId).collect(Collectors.toList()))
                    .in(!WxMsgTemplate.CHOOSE_TYPE_NONE.equals(dto.getChooseTagType()), WxCustomer::getExtId, customerExtIds)
                    .notIn(WxMsgTemplate.CHOOSE_TYPE_NONE.equals(dto.getChooseTagType()), WxCustomer::getExtId, customerExtIds));
            if (ListUtils.isEmpty(result)) {
                return new ArrayList<>();
            }
        }
        //不满足标签查询条件
        if (ListUtils.isNotEmpty(dto.getExcludeTags())) {
            //先查出在标签里的客户
            List<WxCustomerStaffTag> customerTagList = staffTagService.list(
                    new QueryWrapper<WxCustomerStaffTag>().lambda()
                            .in(WxCustomerStaffTag::getExtTagId, dto.getExcludeTags()));

            List<String> customerExtIds = customerTagList.stream().map(WxCustomerStaffTag::getExtCustomerId).collect(Collectors.toList());
            //再查出满足条件的
            result = list(new QueryWrapper<WxCustomer>().lambda()
                    .in(WxCustomer::getExtId, result.stream().map(WxCustomer::getExtId).collect(Collectors.toList()))
                    .notIn(ListUtils.isNotEmpty(customerExtIds), WxCustomer::getExtId, customerExtIds));
            if (ListUtils.isEmpty(result)) {
                return new ArrayList<>();
            }
        }
        return result;
    }

    @Override
    public WxCustomerVO getDetails(String extCorpId, String extId) {
        WxCustomer customer = getOne(new LambdaQueryWrapper<WxCustomer>()
                .eq(WxCustomer::getExtCorpId, extCorpId)
                .eq(WxCustomer::getExtId, extId)
        );
        return translation(customer, true);
    }

    @Override
    public boolean countByCustomerId(String extCorpId, String extCustomerId) {

        return count(new QueryWrapper<WxCustomer>().lambda()
                .eq(WxCustomer::getExtCorpId, extCorpId)
                .eq(WxCustomer::getExtId, extCustomerId)) > 0;

    }

    @Override
    public WxCustomerVO getByIdAndStaffId(String extCorpId, String id, String staffId, String extId) {

        WxCustomer wxCustomer;
        if (StringUtils.isNotBlank(id)) {
            wxCustomer = checkExists(id);
        } else {
            wxCustomer = checkExists(extCorpId, extId);
        }

        Staff staff = staffService.checkExists(staffId);

        WxCustomerStaff customerStaff = customerStaffService.checkExists(extCorpId, staff.getExtId(), wxCustomer.getExtId());
        if (customerStaff == null) {
            throw new BaseException("暂无员工跟进");
        }

        WxCustomerVO vo = new WxCustomerVO();
        BeanUtils.copyProperties(wxCustomer, vo);
        if (StringUtils.isNotBlank(wxCustomer.getExtCreatorId())) {
            StaffVO staffVO = staffService.translation(staff);
            vo.setExtCreatorAvatar(staffVO.getAvatarUrl()).setExtCreatorName(staffVO.getName()).setCreatorStaff(staffVO);
        }

        String addWay = customerStaff.getAddWay();
        vo.setAddWay(addWay)
                .setAddWayName(WxCustomerAddWayEnum.getName(addWay))
                .setRemark(customerStaff.getRemark())
                .setDescription(customerStaff.getDescription())
                .setRemarkCorpName(customerStaff.getRemarkCorpName())
                .setRemarkMobiles(customerStaff.getRemarkMobiles());

        List<WxCustomerStaff> customerStaffs = customerStaffService.list(new LambdaQueryWrapper<WxCustomerStaff>()
                .eq(WxCustomerStaff::getExtCorpId, wxCustomer.getExtCorpId())
                .eq(WxCustomerStaff::getExtCustomerId, wxCustomer.getExtId()));


        //设置员工客户详情
        vo.setCustomerInfo(customerInfoService.getOne(new LambdaQueryWrapper<WxCustomerInfo>()
                .eq(WxCustomerInfo::getExtCorpId, extCorpId)
                .eq(WxCustomerInfo::getExtCustomerId, wxCustomer.getExtId())
                .eq(WxCustomerInfo::getExtStaffId, staff.getExtId())));

        //关联群聊列表
        List<WxGroupChatMemberVO> groupChatMemberList = groupChatMemberService.queryList(new WxGroupChatMemberQueryDTO().setExtCorpId(wxCustomer.getExtCorpId())
                .setType(WxGroupChatMember.TYPE_EXTERNAL_CONTACT).setUserId(wxCustomer.getExtId()));
        List<String> groupExtIds = Optional.ofNullable(groupChatMemberList).orElse(new ArrayList<>()).stream().map(WxGroupChatMemberVO::getExtChatId).collect(Collectors.toList());
        if (ListUtils.isNotEmpty(groupExtIds)) {
            List<WxGroupChat> list = groupChatService.list(new LambdaQueryWrapper<WxGroupChat>().eq(WxGroupChat::getExtCorpId, wxCustomer.getExtCorpId()).in(WxGroupChat::getExtChatId, groupExtIds).orderByDesc(WxGroupChat::getCreateTime));
            vo.setGroupChatList(list);
        }

        List<StaffFollowVO> staffFollowVOS = new ArrayList<>();

        //跟进员工列表
        if (ListUtils.isNotEmpty(customerStaffs)) {
            List<String> extStaffIds = customerStaffs.stream().map(WxCustomerStaff::getExtStaffId).collect(Collectors.toList());
            if (ListUtils.isNotEmpty(extStaffIds)) {

                customerStaffs.forEach(entry -> {
                    Staff s = staffService.find(extCorpId, entry.getExtStaffId());
                    if (s == null) {
                        return;
                    }
                    StaffFollowVO staffFollowVO = new StaffFollowVO();
                    BeanUtils.copyProperties(s, staffFollowVO);
                    List<WxCustomerStaffTag> staffTags = customerStaffTagService.list(new LambdaQueryWrapper<WxCustomerStaffTag>()
                            .eq(WxCustomerStaffTag::getExtCorpId, extCorpId)
                            .eq(WxCustomerStaffTag::getExtCustomerId, entry.getExtCustomerId())
                            .eq(WxCustomerStaffTag::getExtStaffId, entry.getExtStaffId())
                    );
                    List<String> tagExtIds = Optional.ofNullable(staffTags).orElse(new ArrayList<>()).stream().map(WxCustomerStaffTag::getExtTagId).distinct().collect(Collectors.toList());
                    if (ListUtils.isNotEmpty(tagExtIds)) {
                        staffFollowVO.setTags(tagService.list(new LambdaQueryWrapper<WxTag>().eq(WxTag::getExtCorpId, extCorpId).in(WxTag::getExtId, tagExtIds)));
                    }
                    staffFollowVO.setCreatedAt(entry.getCreatedAt());
                    staffFollowVOS.add(staffFollowVO);
                    staffFollowVO.setAddWay(entry.getAddWay()).setAddWayName(WxCustomerAddWayEnum.getName(entry.getAddWay()));
                });
                vo.setFollowStaffList(staffFollowVOS);
            }
        }

        //设置所有的标签
        if (ListUtils.isNotEmpty(staffFollowVOS)) {
            List<WxTag> tags = new ArrayList<>();
            staffFollowVOS.stream().map(StaffFollowVO::getTags).filter(ListUtils::isNotEmpty).forEach(tags::addAll);
            Optional.of(tags).orElse(new ArrayList<>()).sort(Comparator.comparing(WxTag::getCreatedAt).reversed());
            vo.setTags(tags.stream().distinct().collect(Collectors.toList()));
        }

        //查询转移情况
        WxStaffTransferInfo staffTransferInfo = staffTransferInfoService.getOne(new LambdaQueryWrapper<WxStaffTransferInfo>()
                .eq(WxStaffTransferInfo::getExtCorpId, vo.getExtCorpId())
                .eq(WxStaffTransferInfo::getCustomerExtId, vo.getExtId())
                .orderByDesc(WxStaffTransferInfo::getCreateTime)
                .last("limit 1")
        );
        vo.setStaffTransferInfo(staffTransferInfo);

        List<BrJourneyStageCustomerVO> journeyStageCustomerList = journeyStageCustomerService.queryList(
                new BrJourneyStageCustomerQueryDTO()
                        .setExtCorpId(extCorpId)
                        .setCustomerId(vo.getId())
        );

        if (ListUtils.isNotEmpty(journeyStageCustomerList)) {
            List<String> journeyStageIds = journeyStageCustomerList.stream().map(BrJourneyStageCustomerVO::getJourneyStageId).collect(Collectors.toList());
            vo.setCustomerStageIdList(journeyStageIds);
            List<String> journeyIds = journeyStageCustomerList.stream().map(BrJourneyStageCustomerVO::getJourneyId).collect(Collectors.toList());
            List<WxCustomerJourneyVO> journeyList = new ArrayList<>();
            if (ListUtils.isNotEmpty(journeyIds)) {
                List<BrJourney> list = journeyService.list(new LambdaQueryWrapper<BrJourney>()
                        .eq(BrJourney::getExtCorpId, extCorpId)
                        .in(BrJourney::getId, journeyIds)
                        .orderByAsc(BrJourney::getSort));
                Optional.ofNullable(list).orElse(new ArrayList<>()).forEach(brJourney -> {
                    WxCustomerJourneyVO journeyVO = new WxCustomerJourneyVO();
                    BeanUtils.copyProperties(brJourney, journeyVO);
                    journeyList.add(journeyVO);
                    journeyVO.setJourneyStages(journeyStageService.list(new LambdaQueryWrapper<BrJourneyStage>()
                            .eq(BrJourneyStage::getExtCorpId, extCorpId)
                            .eq(BrJourneyStage::getJourneyId, brJourney.getId())
                            .orderByAsc(BrJourneyStage::getSort)));
                });
            }
            vo.setJourneyList(journeyList);
        }

        //查询协助人
        vo.setAssistStaffList(customerStaffAssistService.queryStaffAssistList(new WxCustomerStaffAssistQueryDTO()
                .setExtCorpId(vo.getExtCorpId())
                .setExtStaffId(staff.getExtId())
                .setExtCustomerId(extId)));
        return vo;
    }


    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public WxCustomer getByIdNewTr(String id) {
        return getById(id);
    }

    @Override
    public WxCustomerStatisticsVO getStatisticsInfo(WxCustomerStatisticsDTO dto) {
        String extCorpId = dto.getExtCorpId();
        int total = baseMapper.count(dto.getExtCorpId());
        WxCustomerStatisticsVO statisticsVO = new WxCustomerStatisticsVO().setTotal(total);

        List<WxCustomerStatisticsInfoVO> last30DaysStatisticsInfos = new ArrayList<>();
        List<WxCustomerStatisticsInfoVO> last7DaysStatisticsInfos = new ArrayList<>();
        statisticsVO.setLast7DaysStatisticsInfos(last7DaysStatisticsInfos)
                .setLast30DaysStatisticsInfos(last30DaysStatisticsInfos);

        for (int i = 0; i < 30; i++) {

            Date date = DateUtils.getDate(-i + 1);
            Date yesterday = DateUtils.getDate(-i);

            long lossTotal = OptionalLong.of(customerLossInfoService.count(new LambdaQueryWrapper<WxCustomerLossInfo>()
                    .eq(WxCustomerLossInfo::getExtCorpId, extCorpId)
                    .lt(WxCustomerLossInfo::getDeleteTime, date)
                    .ge(WxCustomerLossInfo::getDeleteTime, yesterday))
            ).orElse(0);

            long saveTotal = customerStaffService.count(extCorpId, yesterday, date, null);
            WxCustomerStatisticsInfoVO statisticsInfo = new WxCustomerStatisticsInfoVO().setDay(DateUtils.getDate(-i))
                    .setLossTotal(lossTotal)
                    .setSaveTotal(saveTotal);

            last30DaysStatisticsInfos.add(statisticsInfo);

            if (i < 7) {
                last7DaysStatisticsInfos.add(statisticsInfo);
            }

            if (i == 0) {
                statisticsVO.setTodayLossTotal(lossTotal).setTodaySaveTotal(saveTotal);
            }

        }

        last30DaysStatisticsInfos.sort(Comparator.comparing(WxCustomerStatisticsInfoVO::getDay));
        last7DaysStatisticsInfos.sort(Comparator.comparing(WxCustomerStatisticsInfoVO::getDay));

        return statisticsVO;
    }

    @Override
    public WxCustomerPullNewStatisticsVO getPullNewStatisticsInfo(WxCustomerPullNewStatisticsDTO dto) {
        List<WxCustomerPullNewStatisticsInfoVO> last30DaysStatisticsInfo = customerStaffService.getPullNewStatisticsInfo(dto.getExtCorpId(), dto.getTopNum(), DateUtils.getDate(-29), DateUtils.getDate(1));
        List<WxCustomerPullNewStatisticsInfoVO> last7DaysStatisticsInfo = customerStaffService.getPullNewStatisticsInfo(dto.getExtCorpId(), dto.getTopNum(), DateUtils.getDate(-6), DateUtils.getDate(1));
        return new WxCustomerPullNewStatisticsVO().setLast30DaysStatisticsInfos(last30DaysStatisticsInfo).setLast7DaysStatisticsInfos(last7DaysStatisticsInfo);
    }

    @Override
    public WxCustomerVO getDeleteInfo(String extCorpId, String id, String staffId, String extId) {
        WxCustomer wxCustomer;
        if (StringUtils.isNotBlank(id)) {
            wxCustomer = find(id);
        } else {
            wxCustomer = find(extCorpId, extId);
        }

        Staff staff = staffService.find(staffId);

        WxCustomerStaff customerStaff = customerStaffService.findHasDelete(extCorpId, staff.getExtId(), wxCustomer.getExtId());
        if (customerStaff == null) {
            throw new BaseException("暂无员工跟进");
        }

        WxCustomerVO vo = new WxCustomerVO();
        BeanUtils.copyProperties(wxCustomer, vo);
        if (StringUtils.isNotBlank(wxCustomer.getExtCreatorId())) {
            StaffVO staffVO = staffService.translation(staff);
            vo.setExtCreatorAvatar(staffVO.getAvatarUrl()).setExtCreatorName(staffVO.getName()).setCreatorStaff(staffVO);
        }

        String addWay = customerStaff.getAddWay();
        vo.setAddWay(addWay)
                .setAddWayName(WxCustomerAddWayEnum.getName(addWay))
                .setRemark(customerStaff.getRemark())
                .setDescription(customerStaff.getDescription())
                .setRemarkCorpName(customerStaff.getRemarkCorpName())
                .setRemarkMobiles(customerStaff.getRemarkMobiles());

        //设置员工客户详情
        vo.setCustomerInfo(customerInfoService.find(extCorpId, wxCustomer.getExtId(), staff.getExtId()));

        return vo;
    }

    @Override
    public RLock getCustomerSyncLock(String extCorpId, String extId) {
        return redissonClient.getLock(Constants.CUSTOMER_SYNC_LOCK_PRE + extCorpId + ":" + extId);
    }

    @Override
    public List<RLock> getCustomerSyncLock(String extCorpId) {
        //查出全部员工id
        List<Staff> list = staffService.list(new QueryWrapper<Staff>().lambda()
                .eq(Staff::getExtCorpId, extCorpId)
                .select(Staff::getExtId));
        List<String> staffExtIds = list.stream().map(Staff::getExtId).collect(Collectors.toList());

        //批量遍历同步数据（每次同步100个员工的客户数据）
        WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());

        Set<String> customerExtIds = new HashSet<>();
        ListUtils.subCollection(staffExtIds, 100).forEach(staffIds -> {

            //调用批量获取客户信息接口（每次最多只能获取100条数据，因此得递归分页获取所有的）
            WxCpExternalContactBatchInfo contactDetailBatch = null;
            try {
                contactDetailBatch = externalContactService.getContactDetailBatch(staffIds.toArray(new String[0]), null, 100);
                List<WxCpExternalContactBatchInfo.ExternalContactInfo> externalContactList = contactDetailBatch.getExternalContactList();
                getContactDetailBatch(externalContactService, externalContactList, staffIds, contactDetailBatch.getNextCursor());

                externalContactList.forEach(e -> customerExtIds.add(e.getExternalContact().getExternalUserId()));
            } catch (WxErrorException e) {
                log.error("获取客户信息失败！", e);
                throw BaseException.buildBaseException(e.getError(), "获取客户信息失败");
            }

        });

        //每个员工都上锁
        return customerExtIds.stream().map(e -> getCustomerSyncLock(extCorpId, e)).collect(Collectors.toList());
    }

    @Override
    public boolean trySyncLock(RLock lock) throws InterruptedException {
        boolean result = lock.tryLock(10, 30, TimeUnit.SECONDS);
        if (!result) {
            log.error("[{}]客户同步信息尝试获取锁失败", lock.getName());
        }
        return result;
    }

    @Override
    public void releaseSyncLock(RLock lock) {
        //判断要解锁的key是否被当前线程持有。
        if (lock.isLocked() && lock.isHeldByCurrentThread()) {
            lock.unlock();
        }
    }

    @Override
    public List<RLock> getCustomerSyncLock(String extCorpId, boolean needCache) {
        return null;
    }

    @Override
    public List<String> getAllExtId() {
        return list(new QueryWrapper<WxCustomer>().lambda().select(WxCustomer::getExtId))
                .stream().map(WxCustomer::getExtId).collect(Collectors.toList());
    }

    @Override
    public WxCustomerTodayStatisticsVO getTodayStatisticsInfo(WxCustomerTodayStatisticsDTO dto) {
        String extCorpId = dto.getExtCorpId();
        long total = 0l;
        LambdaQueryWrapper<WxCustomer> queryWrapper = new LambdaQueryWrapper<WxCustomer>().eq(WxCustomer::getExtCorpId, dto.getExtCorpId());
        if (Optional.ofNullable(dto.getIsPermission()).orElse(false) && !roleStaffService.isEnterpriseAdmin()) {
            List<String> extCustomerIds = Optional.ofNullable(customerStaffService.list(new LambdaQueryWrapper<WxCustomerStaff>()
                    .select(WxCustomerStaff::getExtCustomerId)
                    .eq(WxCustomerStaff::getExtCorpId, extCorpId)
                    .eq(WxCustomerStaff::getExtStaffId, JwtUtil.getExtUserId())
            )).orElse(new ArrayList<>()).stream().map(WxCustomerStaff::getExtCustomerId).collect(Collectors.toList());
            queryWrapper.in(WxCustomer::getExtId, extCustomerIds);
            if (ListUtils.isNotEmpty(extCustomerIds)) {
                total = count(queryWrapper.in(WxCustomer::getExtId, extCustomerIds));
            }
        } else {
            total = baseMapper.count(dto.getExtCorpId());
        }
        WxCustomerTodayStatisticsVO statisticsVO = new WxCustomerTodayStatisticsVO().setTotal(total);
        Date date = DateUtils.getDate(1);
        Date yesterday = DateUtils.getDate(0);
        long lossTotal = OptionalLong.of(customerLossInfoService.count(new LambdaQueryWrapper<WxCustomerLossInfo>()
                .eq(WxCustomerLossInfo::getExtCorpId, extCorpId)
                .eq(Optional.ofNullable(dto.getIsPermission()).orElse(false) && !roleStaffService.isEnterpriseAdmin(), WxCustomerLossInfo::getStaffId, JwtUtil.getUserId())
                .lt(WxCustomerLossInfo::getDeleteTime, date)
                .ge(WxCustomerLossInfo::getDeleteTime, yesterday))
        ).orElse(0);
        long saveTotal = customerStaffService.count(extCorpId, yesterday, date, Optional.ofNullable(dto.getIsPermission()).orElse(false) && !roleStaffService.isEnterpriseAdmin() ? JwtUtil.getExtUserId() : null);
        statisticsVO.setTodayLossTotal(lossTotal).setTodaySaveTotal(saveTotal);
        return statisticsVO;


    }

    @Override
    public WxCustomer getNoFriendCustomer(String extCorpId, UserInfoRes userInfoRes) {

        WxCustomer wxCustomer = getOne(new QueryWrapper<WxCustomer>().lambda()
                .eq(WxCustomer::getExtCorpId, extCorpId)
                .eq(WxCustomer::getHasFriend, false)
                .eq(WxCustomer::getUnionid, userInfoRes.getUnionid()), false);

        if (wxCustomer != null) {
            return wxCustomer;
        }

        wxCustomer = new WxCustomer()
                .setId(UUID.get32UUID())
                .setExtId(UUID.get32UUID())
                .setExtCorpId(extCorpId)
                .setName(userInfoRes.getNickname())
                .setGender(Integer.parseInt(userInfoRes.getSex()))
                .setAvatar(userInfoRes.getHeadimgurl())
                .setHasFriend(false)
                .setUpdatedAt(new Date())
                .setCreatedAt(new Date())
                .setIsDeletedStaff(false)
                .setHasDelete(false)
                .setUnionid(userInfoRes.getUnionid());

        save(wxCustomer);
        return wxCustomer;
    }

    @Override
    public IPage<WxCustomerVO> pageAssistList(WxCustomerAssistPageDTO dto) {
        String extUserId = JwtUtil.getExtUserId();
        dto.setLoginStaffExtId(extUserId).setIsEnterpriseAdmin(roleStaffService.isEnterpriseAdmin());
        return baseMapper.pageAssistList(new Page<>(dto.getPageNum(), dto.getPageSize()), dto).convert(customer -> translation(customer, extUserId));
    }

    @Override
    public void transferFail(WxStaffCustomerTransferFailDTO dto) {

        staffTransferInfoService.update(new LambdaUpdateWrapper<WxStaffTransferInfo>()
                .eq(WxStaffTransferInfo::getExtCorpId, dto.getExtCorpId())
                .eq(WxStaffTransferInfo::getCustomerExtId, dto.getCustomerExtId())
                .eq(WxStaffTransferInfo::getTakeoverStaffExtId, dto.getTakeoverStaffExtId())
                .eq(WxStaffTransferInfo::getType, WxStaffTransferInfo.TYPE_ON_JOB)
                .eq(WxStaffTransferInfo::getStatus, WxStaffTransferInfo.STATUS_WAITING_TAKE_OVER)
                .set(WxStaffTransferInfo::getStatus, dto.getStatus())
                .set(WxStaffTransferInfo::getTakeoverTime, new Date()));


        resignedStaffCustomerService.update(new LambdaUpdateWrapper<WxResignedStaffCustomer>()
                .eq(WxResignedStaffCustomer::getExtCorpId, dto.getExtCorpId())
                .eq(WxResignedStaffCustomer::getCustomerExtId, dto.getCustomerExtId())
                .eq(WxResignedStaffCustomer::getTakeoverStaffExtId, dto.getTakeoverStaffExtId())
                .eq(WxResignedStaffCustomer::getStatus, WxResignedStaffCustomer.STATUS_WAITING_TAKE_OVER)
                .set(WxResignedStaffCustomer::getStatus, dto.getStatus())
                .set(WxResignedStaffCustomer::getTakeoverTime, new Date()));

    }

    @Override
    public void handlerTransfer(String extCorpId, String staffExtId, String customerExtId) {
        WxStaffTransferInfo staffTransferInfo = staffTransferInfoService.getOne(new LambdaQueryWrapper<WxStaffTransferInfo>()
                .eq(WxStaffTransferInfo::getExtCorpId, extCorpId)
                .eq(WxStaffTransferInfo::getCustomerExtId, customerExtId)
                .eq(WxStaffTransferInfo::getTakeoverStaffExtId, staffExtId)
                .eq(WxStaffTransferInfo::getType, WxStaffTransferInfo.TYPE_ON_JOB)
                .eq(WxStaffTransferInfo::getStatus, WxStaffTransferInfo.STATUS_WAITING_TAKE_OVER));

        WxResignedStaffCustomer resignedStaffCustomer = resignedStaffCustomerService.getOne(new LambdaQueryWrapper<WxResignedStaffCustomer>()
                .eq(WxResignedStaffCustomer::getExtCorpId, extCorpId)
                .eq(WxResignedStaffCustomer::getCustomerExtId, customerExtId)
                .eq(WxResignedStaffCustomer::getTakeoverStaffExtId, staffExtId)
                .eq(WxResignedStaffCustomer::getStatus, WxResignedStaffCustomer.STATUS_WAITING_TAKE_OVER));

        String handoverStaffExtId = null;
        if (resignedStaffCustomer != null) {
            handoverStaffExtId = resignedStaffCustomer.getHandoverStaffExtId();
        } else if (staffTransferInfo != null) {
            handoverStaffExtId = staffTransferInfo.getHandoverStaffExtId();
        }

        //如果有继承，则把原有的标签，及详情修改
        if (StringUtils.isNotBlank(handoverStaffExtId)) {

            //获取原跟进人拥有的标签
            //设置所有的标签
            List<String> tagIds = Optional.ofNullable(customerStaffTagService.list(new LambdaQueryWrapper<WxCustomerStaffTag>()
                            .eq(WxCustomerStaffTag::getExtCorpId, extCorpId)
                            .eq(WxCustomerStaffTag::getExtStaffId, handoverStaffExtId)
                            .eq(WxCustomerStaffTag::getExtCustomerId, customerExtId))).orElse(new ArrayList<>())
                    .stream().map(WxCustomerStaffTag::getExtTagId).collect(Collectors.toList());
            if (ListUtils.isNotEmpty(tagIds)) {
                //开始打标签
                WxCpExternalContactServiceImpl externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
                try {
                    externalContactService.markTag(staffExtId, customerExtId, tagIds.toArray(new String[0]), new String[]{});
                } catch (WxErrorException e) {
                    log.info("处理离职继承/在职继承，打标异常：extCorpId：【{}】,  staffExtId：【{}】,  customerExtId：【{}】，handoverStaffExtId：【{}】" +
                            ",异常信息：【{}】", extCorpId, staffExtId, customerExtId, handoverStaffExtId, e);
                }
            }

            //更新客户详情
            WxCustomerInfo customerInfo = customerInfoService.getOne(new LambdaQueryWrapper<WxCustomerInfo>()
                    .eq(WxCustomerInfo::getExtCorpId, extCorpId)
                    .eq(WxCustomerInfo::getExtCustomerId, customerExtId)
                    .eq(WxCustomerInfo::getExtStaffId, handoverStaffExtId));
            if (customerInfo != null) {
                customerInfo.setExtStaffId(staffExtId)
                        .setId(UUID.get32UUID())
                        .setCreatedAt(new Date())
                        .setUpdatedAt(new Date())
                        .setExtCreatorId(staffExtId);
                customerInfoService.updateById(customerInfo);
            }

            //更新备注
            WxCustomerStaff customerStaff = customerStaffService.checkExists(extCorpId, handoverStaffExtId, customerExtId);
            if (customerStaff != null) {
                WxCpExternalContactService externalContactService = new WxCpExternalContactServiceImpl(WxCpConfiguration.getCustomerSecretWxCpService());
                WxCpUpdateRemarkRequest wxCpUpdateRemarkRequest = new WxCpUpdateRemarkRequest();
                BeanUtils.copyProperties(customerStaff, wxCpUpdateRemarkRequest);
                wxCpUpdateRemarkRequest.setUserId(staffExtId);
                wxCpUpdateRemarkRequest.setExternalUserId(customerExtId);
                try {
                    externalContactService.updateRemark(wxCpUpdateRemarkRequest);
                } catch (WxErrorException e) {
                    log.info("处理离职继承/在职继承，更新备注异常：extCorpId：【{}】,  staffExtId：【{}】,  customerExtId：【{}】，handoverStaffExtId：【{}】" +
                            ",异常信息：【{}】", extCorpId, staffExtId, customerExtId, handoverStaffExtId, e);
                }
            }

        }
    }


    private WxCustomerVO translation(WxCustomer wxCustomer, String extUserId) {
        WxCustomerVO translation = translation(wxCustomer);
        List<String> staffExtIds = Optional.ofNullable(translation.getAssistStaffList()).orElse(new ArrayList<>()).stream().map(Staff::getExtId).collect(Collectors.toList());
        if (roleStaffService.isEnterpriseAdmin()) {
            if (Objects.equals(translation.getExtCreatorId(), extUserId) || !staffExtIds.contains(extUserId)) {
                translation.setIsAssist(false);
            } else {
                translation.setIsAssist(true);
            }
        } else {
            translation.setIsAssist(!Objects.equals(translation.getExtCreatorId(), extUserId));
        }
        translation.setAssistStaffList(Optional.ofNullable(translation.getAssistStaffList())
                        .orElse(new ArrayList<>()).stream().filter(staff -> !Objects.equals(staff.getExtId(), extUserId)).collect(Collectors.toList()))
                .setIsAssist(!Objects.equals(translation.getExtCreatorId(), extUserId) && !roleStaffService.isEnterpriseAdmin());
        return translation;
    }
}
