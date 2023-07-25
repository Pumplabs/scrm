package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.CustomerDynamicInfoDTO;
import com.scrm.api.wx.cp.entity.WxDynamicMedia;
import com.scrm.api.wx.cp.enums.BrCustomerDynamicModelEnum;
import com.scrm.api.wx.cp.enums.BrCustomerDynamicTypeEnum;
import com.scrm.common.dto.BatchDTO;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.BrCustomerDynamicPageDTO;
import com.scrm.server.wx.cp.dto.BrCustomerDynamicQueryDTO;
import com.scrm.server.wx.cp.dto.BrCustomerDynamicSaveDTO;
import com.scrm.server.wx.cp.entity.BrCustomerDynamic;
import com.scrm.server.wx.cp.mapper.BrCustomerDynamicMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.vo.BrCustomerDynamicVO;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.cp.constant.WxCpConsts;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 客户动态 服务实现类
 * @author xxh
 * @since 2022-05-12
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrCustomerDynamicServiceImpl extends ServiceImpl<BrCustomerDynamicMapper, BrCustomerDynamic> implements IBrCustomerDynamicService {

    @Autowired
    private IMediaInfoService mediaInfoService;

    @Autowired
    private IWxDynamicMediaService dynamicMediaService;

    @Autowired
    private IWxCustomerService customerService;
    
    @Autowired
    private IBrCustomerFollowService customerFollowService;

    @Override
    public IPage<BrCustomerDynamicVO> pageList(BrCustomerDynamicPageDTO dto) {
        List<String> allExtId = customerService.getAllExtId();
        if (ListUtils.isEmpty(allExtId)) {
            return new Page<>();
        }
        LambdaQueryWrapper<BrCustomerDynamic> wrapper = new LambdaQueryWrapper<BrCustomerDynamic>()
                .eq(BrCustomerDynamic::getExtCorpId, dto.getExtCorpId())
                .in(BrCustomerDynamic::getExtCustomerId, allExtId)
                .eq(StringUtils.isNotBlank(dto.getExtCustomerId()), BrCustomerDynamic::getExtCustomerId, dto.getExtCustomerId())
                .orderByDesc(BrCustomerDynamic::getCreatedAt);
        IPage<BrCustomerDynamic> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<BrCustomerDynamicVO> queryList(BrCustomerDynamicQueryDTO dto) {
        List<String> allExtId = customerService.getAllExtId();
        LambdaQueryWrapper<BrCustomerDynamic> wrapper = new QueryWrapper<BrCustomerDynamic>()
                .lambda().eq(BrCustomerDynamic::getExtCorpId, dto.getExtCorpId())
                .in(BrCustomerDynamic::getExtCustomerId, allExtId)
                .orderByDesc(BrCustomerDynamic::getCreatedAt);
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public BrCustomerDynamicVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public BrCustomerDynamic save(BrCustomerDynamicSaveDTO dto) {

        //封装数据
        BrCustomerDynamic brCustomerDynamic = new BrCustomerDynamic();
        BeanUtils.copyProperties(dto, brCustomerDynamic);
        brCustomerDynamic.setId(UUID.get32UUID());
        brCustomerDynamic.setCreatedAt(new Date());

        //入库
        save(brCustomerDynamic);

        return brCustomerDynamic;
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
        Optional.ofNullable(dto.getIds()).orElse(new ArrayList<>()).forEach(this::checkExists);

        //删除
        removeByIds(dto.getIds());
    }


    /**
     * 翻译
     *
     * @param brCustomerDynamic 实体
     * @return BrCustomerDynamicVO 结果集
     * @author xxh
     * @date 2022-05-12
     */
    private BrCustomerDynamicVO translation(BrCustomerDynamic brCustomerDynamic) {
        BrCustomerDynamicVO vo = new BrCustomerDynamicVO();
        BeanUtils.copyProperties(brCustomerDynamic, vo);

        vo.setWxCustomer(customerService.checkExists(vo.getExtCorpId(), vo.getExtCustomerId()));
        if (BrCustomerDynamicTypeEnum.CHECK.getCode().equals(brCustomerDynamic.getType())) {

            WxDynamicMedia one = dynamicMediaService.getById(vo.getInfo().getDynamicMediaId());
            if (one != null) {
                vo.setMediaSeconds(one.getTime());
            }
        }
        
        return vo;
    }


    @Override
    public BrCustomerDynamic checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrCustomerDynamic byId = getById(id);
        if (byId == null) {
            throw new BaseException("客户动态不存在");
        }
        return byId;
    }

    @Override
    public void saveByQueue(String changType, String extCorpId, String extStaffId, String extCustomerId, CustomerDynamicInfoDTO info) {
        BrCustomerDynamic dynamic =  new BrCustomerDynamic()
                .setId(UUID.get32UUID())
                .setExtCorpId(extCorpId)
                .setInfo(info)
                .setCreatedAt(new Date())
                .setUpdatedAt(new Date())
                .setExtStaffId(extStaffId)
                .setExtCustomerId(extCustomerId);

        switch (changType){
            case WxCpConsts.ExternalContactChangeType.DEL_FOLLOW_USER:
                dynamic.setModel(BrCustomerDynamicModelEnum.CUSTOMER_MANAGEMENT.getCode());
                dynamic.setType(BrCustomerDynamicTypeEnum.CUSTOMER_DELETE.getCode());
                break;
            case WxCpConsts.ExternalContactChangeType.DEL_EXTERNAL_CONTACT:
                dynamic.setModel(BrCustomerDynamicModelEnum.CUSTOMER_MANAGEMENT.getCode());
                dynamic.setType(BrCustomerDynamicTypeEnum.DELETE_CUSTOMER.getCode());
                break;
            case WxCpConsts.ExternalContactChangeType.ADD_HALF_EXTERNAL_CONTACT:
            case WxCpConsts.ExternalContactChangeType.ADD_EXTERNAL_CONTACT:
                dynamic.setModel(BrCustomerDynamicModelEnum.CUSTOMER_MANAGEMENT.getCode());
                dynamic.setType(BrCustomerDynamicTypeEnum.CUSTOMER_ADD_STAFF.getCode());
                break;

        }
        save(dynamic);
    }

    @Override
    public void save(Integer model, Integer type, String extCorpId, String extStaffId, String extCustomerId, CustomerDynamicInfoDTO info) {
        BrCustomerDynamic dynamic =  new BrCustomerDynamic()
                .setId(UUID.get32UUID())
                .setModel(model)
                .setType(type)
                .setInfo(info)
                .setExtCorpId(extCorpId)
                .setCreatedAt(new Date())
                .setUpdatedAt(new Date())
                .setExtStaffId(extStaffId)
                .setExtCustomerId(extCustomerId);

        save(dynamic);
    }
}
