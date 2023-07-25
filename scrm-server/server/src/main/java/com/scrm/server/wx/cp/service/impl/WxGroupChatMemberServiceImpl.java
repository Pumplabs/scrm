package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.api.wx.cp.entity.WxGroupChat;
import com.scrm.api.wx.cp.entity.WxGroupChatMember;
import com.scrm.api.wx.cp.vo.WxGroupChatMemberExportVO;
import com.scrm.api.wx.cp.vo.WxGroupChatMemberVO;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.EasyPoiUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.mapper.WxGroupChatMemberMapper;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.service.IWxCustomerService;
import com.scrm.server.wx.cp.service.IWxGroupChatMemberService;
import com.scrm.server.wx.cp.service.IWxGroupChatService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 客户群聊成员 服务实现类
 *
 * @author xxh
 * @since 2022-01-19
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxGroupChatMemberServiceImpl extends ServiceImpl<WxGroupChatMemberMapper, WxGroupChatMember> implements IWxGroupChatMemberService {

    @Autowired
    private IWxGroupChatService groupChatService;


    @Autowired
    private IWxCustomerService customerService;

    @Autowired
    private IStaffService staffService;

    @Override
    public IPage<WxGroupChatMemberVO> pageList(WxGroupChatMemberPageDTO dto) {
        return baseMapper.pageList(new Page<>(dto.getPageNum(), dto.getPageSize()), dto).convert(this::translation);
    }


    @Override
    public List<WxGroupChatMemberVO> queryList(WxGroupChatMemberQueryDTO dto) {
        LambdaQueryWrapper<WxGroupChatMember> wrapper = new QueryWrapper<WxGroupChatMember>().lambda()
                .eq(WxGroupChatMember::getExtCorpId, dto.getExtCorpId())
                .eq(StringUtils.isNotBlank(dto.getUserId()), WxGroupChatMember::getUserId, dto.getUserId())
                .eq(StringUtils.isNotBlank(dto.getExtChatId()), WxGroupChatMember::getExtChatId, dto.getExtChatId())
                .eq(dto.getType() != null, WxGroupChatMember::getType, dto.getType())
                .eq(dto.getJoinScene() != null, WxGroupChatMember::getJoinScene, dto.getJoinScene())
                .ge(dto.getJoinTimeBegin() != null, WxGroupChatMember::getJoinTime, dto.getJoinTimeBegin())
                .le(dto.getJoinTimeEnd() != null, WxGroupChatMember::getJoinTime, dto.getJoinTimeEnd())
                .orderByDesc(WxGroupChatMember::getJoinTime);
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public WxGroupChatMemberVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public WxGroupChatMember save(WxGroupChatMemberSaveDTO dto) {

        //封装数据
        WxGroupChatMember wxGroupChatMember = new WxGroupChatMember();
        BeanUtils.copyProperties(dto, wxGroupChatMember);
        wxGroupChatMember.setId(UUID.get32UUID());

        //入库
        save(wxGroupChatMember);

        return wxGroupChatMember;
    }

    @Override
    public void delete(String id) {

        //校验参数
        WxGroupChatMember wxGroupChatMember = checkExists(id);

        //删除
        removeById(id);

    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {

        //校验参数
        List<WxGroupChatMember> wxGroupChatMemberList = new ArrayList<>();
        Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).forEach(id -> wxGroupChatMemberList.add(checkExists(id)));

        //删除
        removeByIds(dto.getIds());
    }


    /**
     * 翻译
     *
     * @param wxGroupChatMember 实体
     * @return WxGroupChatMemberVO 结果集
     * @author xxh
     * @date 2022-01-19
     */
    private WxGroupChatMemberVO translation(WxGroupChatMember wxGroupChatMember) {
        WxGroupChatMemberVO vo = new WxGroupChatMemberVO();
        BeanUtils.copyProperties(wxGroupChatMember, vo);
        if (StringUtils.isNotBlank(wxGroupChatMember.getExtCorpId()) &&
                Objects.equals(WxGroupChatMember.TYPE_EXTERNAL_CONTACT, wxGroupChatMember.getType())) {
            WxCustomer customer = customerService.checkExists(wxGroupChatMember.getExtCorpId(), wxGroupChatMember.getUserId());
            if (customer != null) {
                vo.setMemberExtCorpName(customer.getCorpName());
            }
        } else if (Objects.equals(WxGroupChatMember.TYPE_CORPORATE_MEMBER, wxGroupChatMember.getType())) {
            Staff staff = staffService.getOne(new LambdaQueryWrapper<Staff>()
                    .eq(Staff::getExtCorpId, wxGroupChatMember.getExtCorpId())
                    .eq(Staff::getExtId, wxGroupChatMember.getUserId())
            );
            if (staff != null) {
                vo.setStaffId(staff.getId()).setStaff(staff);
            }
        }
        return vo;
    }


    @Override
    public WxGroupChatMember checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        WxGroupChatMember byId = getById(id);
        if (byId == null) {
            throw new BaseException("客户群聊成员不存在");
        }
        return byId;
    }

    @Override
    public void exportList(WxGroupChatMemberExportDTO dto) {

        WxGroupChat groupChat = groupChatService.getOne(new LambdaQueryWrapper<WxGroupChat>().eq(WxGroupChat::getExtCorpId, dto.getExtCorpId()).eq(WxGroupChat::getExtChatId, dto.getExtChatId()));
        if (groupChat == null) {
            throw new BaseException("客户群聊不存在");
        }

        List<WxGroupChatMemberExportVO> exportList = Optional.ofNullable(baseMapper.queryList(dto)).orElse(new ArrayList<>()).stream()
                .map(vo -> new WxGroupChatMemberExportVO()
                        .setType(vo.getType())
//                        .setInvitorName(StringUtils.isBlank(vo.getInvitor()) ? "-" : "$userName=" + vo.getInvitor() + "$")
                        .setJoinScene(vo.getJoinScene())
                        .setJoinTime(new Date(vo.getJoinTime() * 1000))
                        .setMemberName(vo.getName())
                        .setUnionId(vo.getUnionId())).collect(Collectors.toList());

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String title = "%s客户群详情(导出时间: %s)";
        title = String.format(title, groupChat.getName(), dateFormat.format(new Date()));
        EasyPoiUtils.export("客户群详情", title, null, WxGroupChatMemberExportVO.class, exportList);
    }

    @Override
    public List<String> queryTodayQuitIds(String extCorpId, String chatId) {
        return baseMapper.queryTodayQuitIds(extCorpId, chatId);
    }

    @Override
    public List<String> queryTodayQuitExtIds(String extCorpId, String chatId) {
        return baseMapper.queryTodayQuitExtIds(extCorpId, chatId);
    }

    @Override
    public List<WxGroupChatMember> listByCondition(JoinWayConditionDTO conditionDTO) {
        return baseMapper.listByCondition(conditionDTO);
    }
}
