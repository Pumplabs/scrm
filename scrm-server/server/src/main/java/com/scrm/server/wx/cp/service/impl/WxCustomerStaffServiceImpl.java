package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.entity.WxCustomerStaff;
import com.scrm.api.wx.cp.vo.ContactWayCountParamsVO;
import com.scrm.api.wx.cp.vo.WxCustomerPullNewStatisticsInfoVO;
import com.scrm.api.wx.cp.vo.WxCustomerStaffVO;
import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.mapper.WxCustomerStaffMapper;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.service.IWxCustomerService;
import com.scrm.server.wx.cp.service.IWxCustomerStaffService;
import com.scrm.server.wx.cp.vo.WxCustomerStaffCountVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * 企业微信客户-员工关联表 服务实现类
 *
 * @author xxh
 * @since 2021-12-22
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxCustomerStaffServiceImpl extends ServiceImpl<WxCustomerStaffMapper, WxCustomerStaff> implements IWxCustomerStaffService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IWxCustomerService customerService;

    @Override
    public void delete(String id) {

        //校验参数
        WxCustomerStaff wxCustomerStaff = getById(id);

        //删除
        removeById(id);

    }


    @Override
    public void batchDelete(BatchDTO<String> dto) {

        //校验参数
        List<WxCustomerStaff> wxCustomerStaffList = new ArrayList<>();
        Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).forEach(id -> wxCustomerStaffList.add(getById(id)));

        //删除
        removeByIds(dto.getIds());
    }


    @Override
    public WxCustomerStaff checkExists(String extCorpId, String extStaffId, String extCustomerId) {
        return getOne(new LambdaQueryWrapper<WxCustomerStaff>()
                .eq(WxCustomerStaff::getExtCorpId, extCorpId)
                .eq(WxCustomerStaff::getExtStaffId, extStaffId)
                .eq(WxCustomerStaff::getExtCustomerId, extCustomerId)
        );
    }

    @Override
    public WxCustomerStaff findHasDelete(String extCorpId, String extStaffId, String extCustomerId) {
        return baseMapper.findHasDelete(extCorpId,extStaffId,extCustomerId);
    }

    @Override
    public WxCustomerStaff findHasDelete(String id) {
        return baseMapper.findById(id);
    }

    @Override
    public List<WxCustomerStaffCountVO> countGroupByStaffExtId(String extCorpId) {
        return baseMapper.countGroupByStaffExtId(extCorpId);
    }

    @Override
    public List<WxCustomerStaff> listByCondition(ContactWayCountParamsVO paramsVO) {
        return baseMapper.listByCondition(paramsVO);
    }

    @Override
    public Integer countByDate(String extCorpId, String extStaffId, String state, Date date) {
        return baseMapper.countByDate(extCorpId, extStaffId, state, date);
    }

    @Override
    public WxCustomerStaffVO find(String exrCorpId, String customerId, String extStaffId) {

        return translation(
                getOne(new QueryWrapper<WxCustomerStaff>().lambda()
                .eq(WxCustomerStaff::getExtCorpId, exrCorpId)
                .eq(WxCustomerStaff::getCustomerId, customerId)
                .eq(WxCustomerStaff::getExtStaffId, extStaffId))
        );
    }



    @Override
    public List<WxCustomerPullNewStatisticsInfoVO> getPullNewStatisticsInfo(String extCorpId, Integer topNum, Date beginDate, Date endDate) {
        return baseMapper.getPullNewStatisticsInfo(extCorpId,topNum,beginDate,endDate);
    }

    @Override
    public long count(String extCorpId, Date begin, Date end, String staffExtId) {
        return baseMapper.countByExtCorpId(extCorpId,begin,end,staffExtId);
    }

    private WxCustomerStaffVO translation(WxCustomerStaff wxCustomerStaff) {
        WxCustomerStaffVO vo = new WxCustomerStaffVO();
        BeanUtils.copyProperties(wxCustomerStaff, vo);

        vo.setStaff(staffService.checkExists(vo.getExtStaffId(), vo.getExtCorpId()));
        vo.setWxCustomer(customerService.checkExists(vo.getCustomerId()));

        return vo;
    }


}
