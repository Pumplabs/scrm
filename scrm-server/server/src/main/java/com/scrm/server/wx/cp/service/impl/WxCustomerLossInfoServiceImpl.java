package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.scrm.api.wx.cp.entity.*;
import com.scrm.api.wx.cp.enums.SysSwitchCodeEnum;
import com.scrm.api.wx.cp.enums.WxCustomerAddWayEnum;
import com.scrm.api.wx.cp.vo.*;
import com.scrm.common.constant.Constants;
import com.scrm.common.util.DateUtils;
import com.scrm.common.util.ListUtils;
import com.scrm.server.wx.cp.dto.BrJourneyStageCustomerQueryDTO;
import com.scrm.server.wx.cp.entity.WxResignedStaffCustomer;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.utils.WxMsgUtils;
import com.scrm.server.wx.cp.vo.BrJourneyStageCustomerVO;
import lombok.extern.slf4j.Slf4j;
import com.scrm.server.wx.cp.mapper.WxCustomerLossInfoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.scrm.api.wx.cp.dto.WxCustomerLossInfoPageDTO;
import com.scrm.api.wx.cp.dto.WxCustomerLossInfoSaveDTO;
import com.scrm.api.wx.cp.dto.WxCustomerLossInfoUpdateDTO;
import com.scrm.server.wx.cp.vo.WxCustomerLossInfoVO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.scrm.common.util.UUID;
import com.scrm.common.exception.BaseException;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 客户流失情况信息 服务实现类
 *
 * @author xxh
 * @since 2022-03-26
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxCustomerLossInfoServiceImpl extends ServiceImpl<WxCustomerLossInfoMapper, WxCustomerLossInfo> implements IWxCustomerLossInfoService {


    @Autowired
    private IStaffService staffService;

    @Autowired
    private ISysRoleService roleService;

    @Autowired
    private IWxCustomerService customerService;

    @Autowired
    private IWxCustomerStaffService customerStaffService;

    @Autowired
    private IWxCustomerStaffTagService customerStaffTagService;

    @Autowired
    private IWxCustomerInfoService customerInfoService;

    @Autowired
    private IWxTagService tagService;
    @Autowired
    private ISysSwitchService switchService;

    @Autowired
    private IBrJourneyService journeyService;

    @Autowired
    private IBrJourneyStageService journeyStageService;

    @Autowired
    private IBrJourneyStageCustomerService journeyStageCustomerService;

    @Autowired
    private IWxStaffTransferInfoService staffTransferInfoService;

    @Autowired
    private IWxResignedStaffCustomerService resignedStaffCustomerService;


    @Override
    public IPage<WxCustomerLossInfoVO> pageList(WxCustomerLossInfoPageDTO dto) {
        LambdaQueryWrapper<WxCustomerLossInfo> wrapper = new QueryWrapper<WxCustomerLossInfo>().lambda().eq(WxCustomerLossInfo::getExtCorpId, dto.getExtCorpId()).eq(dto.getType() != 0, WxCustomerLossInfo::getType, dto.getType()).orderByDesc(WxCustomerLossInfo::getDeleteTime);
        IPage<WxCustomerLossInfo> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public WxCustomerLossInfoVO findById(String id) {
        return translation(checkExists(id), true);
    }


    @Override
    public WxCustomerLossInfo save(WxCustomerLossInfoSaveDTO dto) {

        //封装数据
        WxCustomerLossInfo wxCustomerLossInfo = new WxCustomerLossInfo();
        BeanUtils.copyProperties(dto, wxCustomerLossInfo);
        wxCustomerLossInfo.setId(UUID.get32UUID());

        //查看是否为在职转接/离职交接，如果是就不新增流失记录
        boolean isOnJobTransfer = staffTransferInfoService.count(new LambdaQueryWrapper<WxStaffTransferInfo>()
                .eq(WxStaffTransferInfo::getExtCorpId, dto.getExtCorpId())
                .eq(WxStaffTransferInfo::getCustomerExtId, dto.getExtCustomerId())
                .eq(WxStaffTransferInfo::getHandoverStaffExtId, dto.getStaffExtId())
                .eq(WxStaffTransferInfo::getType, WxStaffTransferInfo.TYPE_ON_JOB)
                .eq(WxStaffTransferInfo::getStatus, WxStaffTransferInfo.STATUS_WAITING_TAKE_OVER)) > 0;

        boolean isHandover = resignedStaffCustomerService.count(new LambdaQueryWrapper<WxResignedStaffCustomer>()
                .eq(WxResignedStaffCustomer::getExtCorpId, dto.getExtCorpId())
                .eq(WxResignedStaffCustomer::getCustomerExtId, dto.getExtCustomerId())
                .eq(WxResignedStaffCustomer::getHandoverStaffExtId, dto.getStaffExtId())
                .eq(WxResignedStaffCustomer::getStatus, WxResignedStaffCustomer.STATUS_WAITING_TAKE_OVER)) > 0;

        if (isOnJobTransfer) {
            staffTransferInfoService.update(new LambdaUpdateWrapper<WxStaffTransferInfo>()
                    .eq(WxStaffTransferInfo::getExtCorpId, dto.getExtCorpId())
                    .eq(WxStaffTransferInfo::getCustomerExtId, dto.getExtCustomerId())
                    .eq(WxStaffTransferInfo::getHandoverStaffExtId, dto.getStaffExtId())
                    .eq(WxStaffTransferInfo::getType, WxStaffTransferInfo.TYPE_ON_JOB)
                    .eq(WxStaffTransferInfo::getStatus, WxStaffTransferInfo.STATUS_WAITING_TAKE_OVER)
                    .set(WxStaffTransferInfo::getStatus, WxStaffTransferInfo.STATUS_TAKE_OVER)
                    .set(WxStaffTransferInfo::getTakeoverTime, new Date()));
        }

        if (isHandover) {
            resignedStaffCustomerService.update(new LambdaUpdateWrapper<WxResignedStaffCustomer>()
                    .eq(WxResignedStaffCustomer::getExtCorpId, dto.getExtCorpId())
                    .eq(WxResignedStaffCustomer::getCustomerExtId, dto.getExtCustomerId())
                    .eq(WxResignedStaffCustomer::getHandoverStaffExtId, dto.getStaffExtId())
                    .eq(WxResignedStaffCustomer::getStatus, WxResignedStaffCustomer.STATUS_WAITING_TAKE_OVER)
                    .set(WxResignedStaffCustomer::getStatus, WxResignedStaffCustomer.STATUS_TAKE_OVER)
                    .set(WxResignedStaffCustomer::getTakeoverTime, new Date()));
        }

        //如果离职继承或者在职转接则不用加流水记录
        if (isOnJobTransfer || isHandover || Optional.ofNullable(dto.getDeleteByTransfer()).orElse(false)) {
            return null;
        }

        //入库
        save(wxCustomerLossInfo);

        //发送消息
        if (Objects.equals(dto.getType(), WxCustomerLossInfo.TYPE_CUSTOMER_DELETE_STAFF)) {
            //查询开关情况（当客户删除员工时，通知被删除员工）
            SysSwitch sysSwitch = switchService.getByCode(dto.getExtCorpId(), SysSwitchCodeEnum.NOTIFY_ADMIN.getValue());
            if (SysSwitch.STATUS_OPEN.equals(sysSwitch.getStatus())) {
                WxCustomer wxCustomer = customerService.find(dto.getCustomerId());
                Staff staff = staffService.find(dto.getStaffId());
                String message = String.format("客户【%s】已将你删除好友", wxCustomer.getName());
                WxMsgUtils.sendMessage(dto.getExtCorpId(), message, Collections.singletonList(staff.getExtId()));
            }

        } else if (Objects.equals(dto.getType(), WxCustomerLossInfo.TYPE_STAFF_DELETE_CUSTOMER)) {
            //查询开关情况（当员工删除客户时，通知管理员）//TODO 由于目前没有角色管理，则发送给每个员工
            SysSwitch sysSwitch = switchService.getByCode(dto.getExtCorpId(), SysSwitchCodeEnum.NOTIFY_EMPLOYEES.getValue());
            if (SysSwitch.STATUS_OPEN.equals(sysSwitch.getStatus())) {
                WxCustomer wxCustomer = customerService.find(dto.getCustomerId());
                Staff staff = staffService.find(dto.getStaffId());
                String message = String.format("员工【%s】删除了客户【%s】，请关注！", staff.getName(), wxCustomer.getName());
                List<String> enterpriseAdminExtIds = roleService.getExtStaffIdsByRoleKey(dto.getExtCorpId(), Constants.SYS_ROLE_KEY_ENTERPRISE_ADMIN);
                if (ListUtils.isNotEmpty(enterpriseAdminExtIds)) {
                    WxMsgUtils.sendMessage(dto.getExtCorpId(), message, enterpriseAdminExtIds);
                }
            }

        }

        return wxCustomerLossInfo;
    }


    @Override
    public WxCustomerLossInfo update(WxCustomerLossInfoUpdateDTO dto) {

        //校验参数
        WxCustomerLossInfo old = checkExists(dto.getId());

        //封装数据
        WxCustomerLossInfo wxCustomerLossInfo = new WxCustomerLossInfo();
        BeanUtils.copyProperties(dto, wxCustomerLossInfo);
        //入库
        updateById(wxCustomerLossInfo);

        return wxCustomerLossInfo;
    }


    private WxCustomerLossInfoVO translation(WxCustomerLossInfo wxCustomerLossInfo) {
        return translation(wxCustomerLossInfo, false);
    }

    /**
     * 翻译
     *
     * @param wxCustomerLossInfo 实体
     * @return WxCustomerLossInfoVO 结果集
     * @author xxh
     * @date 2022-03-26
     */
    private WxCustomerLossInfoVO translation(WxCustomerLossInfo wxCustomerLossInfo, boolean hasDetail) {
        WxCustomerLossInfoVO vo = new WxCustomerLossInfoVO();
        BeanUtils.copyProperties(wxCustomerLossInfo, vo);
        WxCustomer wxCustomer = customerService.find(wxCustomerLossInfo.getCustomerId());
        WxCustomerVO wxCustomerVO = new WxCustomerVO();
        if (wxCustomer != null) {
            BeanUtils.copyProperties(wxCustomer, wxCustomerVO);

            //设置客户标签
            if (ListUtils.isNotEmpty(wxCustomerLossInfo.getTagExtIds())) {
                wxCustomerVO.setTags(tagService.list(new LambdaUpdateWrapper<WxTag>()
                        .eq(WxTag::getExtCorpId, wxCustomerLossInfo.getExtCorpId())
                        .in(WxTag::getExtId, wxCustomerLossInfo.getTagExtIds())));
            }

            //客户详情
            if (StringUtils.isNotBlank(wxCustomerLossInfo.getCustomerStaffId())) {
                WxCustomerStaff customerStaff = customerStaffService.findHasDelete(wxCustomerLossInfo.getCustomerStaffId());
                String addWay = customerStaff.getAddWay();
                StaffVO staffVO = staffService.translation(staffService.find(wxCustomerLossInfo.getStaffId()));
                wxCustomerVO.setAddWay(addWay)
                        .setAddWayName(WxCustomerAddWayEnum.getName(addWay))
                        .setRemark(customerStaff.getRemark())
                        .setDescription(customerStaff.getDescription())
                        .setRemarkCorpName(customerStaff.getRemarkCorpName())
                        .setRemarkMobiles(customerStaff.getRemarkMobiles())
                        .setCustomerInfo(customerInfoService.find(wxCustomerLossInfo.getExtCorpId(), customerStaff.getExtCustomerId(), customerStaff.getExtStaffId()))
                        .setExtCreatorAvatar(staffVO.getAvatarUrl()).setExtCreatorName(staffVO.getName()).setCreatorStaff(staffVO);

            }

            if (hasDetail) {
                //如果客户已经被删除了，就使用删除的时候的旅程, 如果客户还在使用真实的客户旅程
                if (Optional.ofNullable(wxCustomer.getHasDelete()).orElse(false) && ListUtils.isNotEmpty(wxCustomerLossInfo.getJourneyStageIds())) {
                    List<String> journeyStageIds = wxCustomerLossInfo.getJourneyStageIds();
                    wxCustomerVO.setCustomerStageIdList(journeyStageIds);
                    List<String> journeyIds = Optional.ofNullable(journeyStageService.listByIds(journeyStageIds)).orElse(new ArrayList<>()).stream().map(BrJourneyStage::getJourneyId).collect(Collectors.toList());
                    List<WxCustomerJourneyVO> journeyList = new ArrayList<>();
                    if (ListUtils.isNotEmpty(journeyIds)) {
                        List<BrJourney> list = journeyService.list(new LambdaQueryWrapper<BrJourney>()
                                .eq(BrJourney::getExtCorpId, wxCustomerLossInfo.getExtCorpId())
                                .in(BrJourney::getId, journeyIds)
                                .orderByAsc(BrJourney::getSort));
                        Optional.ofNullable(list).orElse(new ArrayList<>()).forEach(brJourney -> {
                            WxCustomerJourneyVO journeyVO = new WxCustomerJourneyVO();
                            BeanUtils.copyProperties(brJourney, journeyVO);
                            journeyList.add(journeyVO);
                            journeyVO.setJourneyStages(journeyStageService.list(new LambdaQueryWrapper<BrJourneyStage>()
                                    .eq(BrJourneyStage::getExtCorpId, wxCustomerLossInfo.getExtCorpId())
                                    .eq(BrJourneyStage::getJourneyId, brJourney.getId())
                                    .orderByAsc(BrJourneyStage::getSort)));
                        });
                    }
                    wxCustomerVO.setJourneyList(journeyList);
                } else if (!Optional.ofNullable(wxCustomer.getHasDelete()).orElse(false)) {
                    List<BrJourneyStageCustomerVO> journeyStageCustomerList = journeyStageCustomerService.queryList(
                            new BrJourneyStageCustomerQueryDTO()
                                    .setExtCorpId(wxCustomerLossInfo.getExtCorpId())
                                    .setCustomerId(wxCustomerVO.getId())
                    );
                    if (ListUtils.isNotEmpty(journeyStageCustomerList)) {
                        wxCustomerVO.setCustomerStageIdList(journeyStageCustomerList.stream().map(BrJourneyStageCustomerVO::getJourneyStageId).collect(Collectors.toList()));
                        List<String> journeyIds = journeyStageCustomerList.stream().map(BrJourneyStageCustomerVO::getJourneyId).collect(Collectors.toList());
                        List<WxCustomerJourneyVO> journeyList = new ArrayList<>();
                        if (ListUtils.isNotEmpty(journeyIds)) {
                            List<BrJourney> list = journeyService.list(new LambdaQueryWrapper<BrJourney>()
                                    .eq(BrJourney::getExtCorpId, wxCustomerLossInfo.getExtCorpId())
                                    .in(BrJourney::getId, journeyIds)
                                    .orderByAsc(BrJourney::getSort));
                            Optional.ofNullable(list).orElse(new ArrayList<>()).forEach(brJourney -> {
                                WxCustomerJourneyVO journeyVO = new WxCustomerJourneyVO();
                                BeanUtils.copyProperties(brJourney, journeyVO);
                                journeyList.add(journeyVO);
                                journeyVO.setJourneyStages(journeyStageService.list(new LambdaQueryWrapper<BrJourneyStage>()
                                        .eq(BrJourneyStage::getExtCorpId, wxCustomerLossInfo.getExtCorpId())
                                        .eq(BrJourneyStage::getJourneyId, brJourney.getId())
                                        .orderByAsc(BrJourneyStage::getSort)));
                            });
                        }
                        wxCustomerVO.setJourneyList(journeyList);
                    }
                }

                //跟进员工列表
                List<WxCustomerStaff> customerStaffs = customerStaffService.list(new LambdaQueryWrapper<WxCustomerStaff>()
                        .eq(WxCustomerStaff::getExtCorpId, wxCustomer.getExtCorpId())
                        .eq(WxCustomerStaff::getExtCustomerId, wxCustomer.getExtId()));
                List<StaffFollowVO> staffFollowVOS = new ArrayList<>();
                if (ListUtils.isNotEmpty(customerStaffs)) {
                    List<String> extStaffIds = customerStaffs.stream().map(WxCustomerStaff::getExtStaffId).collect(Collectors.toList());
                    if (ListUtils.isNotEmpty(extStaffIds)) {
                        customerStaffs.forEach(entry -> {
                            Staff s = staffService.find(wxCustomerLossInfo.getExtCorpId(), entry.getExtStaffId());
                            StaffFollowVO staffFollowVO = new StaffFollowVO();
                            BeanUtils.copyProperties(s, staffFollowVO);
                            List<WxCustomerStaffTag> staffTags = customerStaffTagService.list(new LambdaQueryWrapper<WxCustomerStaffTag>()
                                    .eq(WxCustomerStaffTag::getExtCorpId, wxCustomerLossInfo.getExtCorpId())
                                    .eq(WxCustomerStaffTag::getExtCustomerId, entry.getExtCustomerId())
                                    .eq(WxCustomerStaffTag::getExtStaffId, entry.getExtStaffId())
                            );
                            List<String> tagExtIds = Optional.ofNullable(staffTags).orElse(new ArrayList<>()).stream().map(WxCustomerStaffTag::getExtTagId).distinct().collect(Collectors.toList());
                            if (ListUtils.isNotEmpty(tagExtIds)) {
                                staffFollowVO.setTags(tagService.list(new LambdaQueryWrapper<WxTag>().eq(WxTag::getExtCorpId, wxCustomerLossInfo.getExtCorpId()).in(WxTag::getExtId, tagExtIds)));
                            }
                            staffFollowVO.setCreatedAt(entry.getCreatedAt());
                            staffFollowVOS.add(staffFollowVO);
                            staffFollowVO.setAddWay(entry.getAddWay()).setAddWayName(WxCustomerAddWayEnum.getName(entry.getAddWay()));
                        });
                        wxCustomerVO.setFollowStaffList(staffFollowVOS);
                    }
                }
            }

        }
        vo.setStaff(staffService.translation(staffService.find(wxCustomerLossInfo.getStaffId()))).setCustomer(wxCustomerVO);
        return vo;
    }


    @Override
    public WxCustomerLossInfo checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        WxCustomerLossInfo byId = getById(id);
        if (byId == null) {
            throw new BaseException("客户流失情况信息不存在");
        }
        return byId;
    }

    @Override
    public WxCustomerLossStatisticsVO getStatistics(String extCorpId) {


        long last30DayTotal = OptionalLong.of(count(new LambdaQueryWrapper<WxCustomerLossInfo>().eq(WxCustomerLossInfo::getExtCorpId, extCorpId).ge(WxCustomerLossInfo::getDeleteTime, DateUtils.getDate(-30)).lt(WxCustomerLossInfo::getDeleteTime, DateUtils.getDate(1)))).orElse(0);

        long last7DayTotal = OptionalLong.of(count(new LambdaQueryWrapper<WxCustomerLossInfo>().eq(WxCustomerLossInfo::getExtCorpId, extCorpId).ge(WxCustomerLossInfo::getDeleteTime, DateUtils.getDate(-7)).lt(WxCustomerLossInfo::getDeleteTime, DateUtils.getDate(1)))).orElse(0);

        long todayTotal = OptionalLong.of(count(new LambdaQueryWrapper<WxCustomerLossInfo>().eq(WxCustomerLossInfo::getExtCorpId, extCorpId).ge(WxCustomerLossInfo::getDeleteTime, DateUtils.getDate(0)).lt(WxCustomerLossInfo::getDeleteTime, DateUtils.getDate(1)))).orElse(0);

        return new WxCustomerLossStatisticsVO().setTotal(OptionalLong.of(count(new LambdaQueryWrapper<WxCustomerLossInfo>().eq(WxCustomerLossInfo::getExtCorpId, extCorpId))).orElse(0)).setLast7DayTotal(last7DayTotal).setLast30DayTotal(last30DayTotal).setTodayTotal(todayTotal);
    }

    @Override
    public boolean checkExists(String extCorpId, String extCustomerId) {
        return count(new QueryWrapper<WxCustomerLossInfo>().lambda().eq(WxCustomerLossInfo::getExtCorpId, extCorpId).eq(WxCustomerLossInfo::getExtCustomerId, extCustomerId)) > 0;
    }
}
