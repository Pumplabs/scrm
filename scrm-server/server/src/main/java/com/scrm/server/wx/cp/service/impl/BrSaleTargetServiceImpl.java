package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.BrSaleTargetQueryDTO;
import com.scrm.server.wx.cp.dto.BrSaleTargetSaveDTO;
import com.scrm.server.wx.cp.dto.BrSaleTargetUpdateDTO;
import com.scrm.server.wx.cp.entity.BrOrder;
import com.scrm.server.wx.cp.entity.BrSaleTarget;
import com.scrm.server.wx.cp.mapper.BrSaleTargetMapper;
import com.scrm.server.wx.cp.service.IBrOrderService;
import com.scrm.server.wx.cp.service.IBrSaleTargetService;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.vo.BrSaleTargetVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 销售目标 服务实现类
 *
 * @author xxh
 * @since 2022-07-20
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrSaleTargetServiceImpl extends ServiceImpl<BrSaleTargetMapper, BrSaleTarget> implements IBrSaleTargetService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IBrOrderService productOrderService;

    private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");

    @Override
    public List<BrSaleTargetVO> queryList(BrSaleTargetQueryDTO dto) {
        LambdaQueryWrapper<BrSaleTarget> wrapper = new QueryWrapper<BrSaleTarget>()
                .lambda().eq(BrSaleTarget::getExtCorpId, dto.getExtCorpId())
                .eq(StringUtils.isNotBlank(dto.getMonth()), BrSaleTarget::getMonth, dto.getMonth());
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public List<BrSaleTargetVO> findById(String id) {
        BrSaleTarget saleTarget = checkExists(id);
        LambdaQueryWrapper<BrSaleTarget> wrapper = new QueryWrapper<BrSaleTarget>()
                .lambda().eq(BrSaleTarget::getExtCorpId, saleTarget.getExtCorpId())
                .eq(BrSaleTarget::getStaffExtId, saleTarget.getStaffExtId());
        return list(wrapper).stream().sorted((o1, o2) -> {
                    Date d1 = null;
                    Date d2 = null;
                    try {
                        d1 = sdf.parse(o1.getMonth());
                        d2 = sdf.parse(o2.getMonth());
                    } catch (ParseException e) {
                        throw new RuntimeException(e);
                    }
                    return d2.compareTo(d1);
                })
                .map(this::translation).collect(Collectors.toList());
    }


    @Override
    public BrSaleTargetVO getStaffCurrentMonthSalesTarget() {
        String extStaffId = JwtUtil.getExtUserId();
        String extCorpId = JwtUtil.getExtCorpId();
        String currentMonth = null;
        currentMonth = sdf.format(new Date());
        log.debug(currentMonth);
        BrSaleTarget brSaleTarget = getOne(new QueryWrapper<BrSaleTarget>().lambda().eq(BrSaleTarget::getExtCorpId, extCorpId)
                .eq(BrSaleTarget::getStaffExtId, extStaffId).eq(BrSaleTarget::getMonth, currentMonth));
        //TODO 返回null不是最佳实践
        if (brSaleTarget == null) {
            return null;
        }
        return this.translation(brSaleTarget);
    }

    @Override
    public BrSaleTarget save(BrSaleTargetSaveDTO dto) {

        checkDate(null, dto.getExtCorpId(),
                dto.getMonth(), dto.getStaffExtId());

        //封装数据
        BrSaleTarget brSaleTarget = new BrSaleTarget();
        BeanUtils.copyProperties(dto, brSaleTarget);
        brSaleTarget.setId(UUID.get32UUID())
                .setCreatorExtId(JwtUtil.getExtUserId())
                .setCreatedAt(new Date())
                .setUpdatedAt(new Date());

        //入库
        save(brSaleTarget);

        return brSaleTarget;
    }

    private void checkDate(String id, String extCorpId,
                           String month, String staffExtId) {

        staffService.checkExists(staffExtId, extCorpId);

        //检查是否重复
        if (count(new QueryWrapper<BrSaleTarget>().lambda()
                .ne(StringUtils.isNotBlank(id), BrSaleTarget::getId, id)
                .eq(BrSaleTarget::getExtCorpId, extCorpId)
                .eq(BrSaleTarget::getMonth, month)
                .eq(BrSaleTarget::getStaffExtId, staffExtId)) > 0) {
            throw new BaseException("该员工该月已有销售目标！");
        }

        //检查月份是否是后面的月份
        String[] arr = month.split("-");
        Calendar now = Calendar.getInstance();
        if (Integer.parseInt(arr[0]) < now.get(Calendar.YEAR)) {
            throw new BaseException("不能选择以前的年份！");
        }

        if (Integer.parseInt(arr[0]) == now.get(Calendar.YEAR)
                && Integer.parseInt(arr[1]) < now.get(Calendar.MONTH) + 1) {
            throw new BaseException("不能选择以前的月份！");
        }
    }


    @Override
    public BrSaleTarget update(BrSaleTargetUpdateDTO dto) {

        checkDate(dto.getId(), dto.getExtCorpId(),
                dto.getMonth(), dto.getStaffExtId());

        //校验参数
        BrSaleTarget old = checkExists(dto.getId());

        //封装数据
        BrSaleTarget brSaleTarget = new BrSaleTarget();
        BeanUtils.copyProperties(dto, brSaleTarget);
        brSaleTarget.setUpdatedAt(new Date());

        //入库
        updateById(brSaleTarget);

        return brSaleTarget;
    }


    @Override
    public void delete(String id) {

        //校验参数
        BrSaleTarget brSaleTarget = checkExists(id);

        //删除
        removeById(id);

    }

    /**
     * 翻译
     *
     * @param brSaleTarget 实体
     * @return BrSaleTargetVO 结果集
     * @author xxh
     * @date 2022-07-20
     */
    private BrSaleTargetVO translation(BrSaleTarget brSaleTarget) {
        BrSaleTargetVO vo = new BrSaleTargetVO();
        BeanUtils.copyProperties(brSaleTarget, vo);

        vo.setCreator(staffService.find(brSaleTarget.getExtCorpId(), brSaleTarget.getCreatorExtId()));
        vo.setStaff(staffService.find(brSaleTarget.getExtCorpId(), brSaleTarget.getStaffExtId()));

        //查询状态是2和3的
        List<Integer> statusList = new ArrayList<>(2);
        statusList.add(BrOrder.STATUS_HAS_IDENTIFIED);
        statusList.add(BrOrder.STATUS_FINISHED);

        //获取起止时间
        Date targetMouth = null;
        try {
            targetMouth = sdf.parse(brSaleTarget.getMonth());
        } catch (ParseException e) {
            log.error("目标月份时间转换异常，[{}]", brSaleTarget.getMonth(), e);
            throw new BaseException("目标月份时间转换异常");
        }
        Calendar start = Calendar.getInstance();
        start.setTime(targetMouth);

        Calendar end = Calendar.getInstance();
        end.setTime(targetMouth);
        end.add(Calendar.MONTH, 1);

        List<BrOrder> orderList = productOrderService.list(new QueryWrapper<BrOrder>().lambda()
                .select(BrOrder::getOrderAmount)
                .eq(BrOrder::getExtCorpId, brSaleTarget.getExtCorpId())
                .eq(BrOrder::getManagerStaffExtId, brSaleTarget.getStaffExtId())
                .in(BrOrder::getStatus, statusList)
                .ge(BrOrder::getCreatedAt, start.getTime())
                .le(BrOrder::getCreatedAt, end.getTime())
                .orderByDesc(BrOrder::getCreatedAt));

        if (ListUtils.isEmpty(orderList)) {
            vo.setFinish(0d);
        } else {
            vo.setFinish(orderList.stream().mapToDouble((s) -> Double.parseDouble(s.getOrderAmount())).sum());
        }

        vo.setFinishPercent(String.format("%.2f", vo.getFinish() / (double) vo.getTarget() * 100));
        return vo;
    }

    public static void main(String[] args) throws ParseException {

       /* String s = "2022-07";
        Calendar instance = Calendar.getInstance();
        instance.setTime(new SimpleDateFormat("yyyy-MM").parse(s));

        System.out.println(instance.getTime());

        instance.add(Calendar.MONTH, 1);
        System.out.println(instance.getTime());*/

        Integer s = 8;
        int s1 = 8;
        System.out.println(s.equals(s1));
    }

    @Override
    public BrSaleTarget checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrSaleTarget byId = getById(id);
        if (byId == null) {
            throw new BaseException("销售目标不存在");
        }
        return byId;
    }
}
