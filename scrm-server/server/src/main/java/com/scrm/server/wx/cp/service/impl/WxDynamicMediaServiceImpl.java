package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.api.wx.cp.dto.CustomerDynamicInfoDTO;
import com.scrm.api.wx.cp.dto.WxCustomerTagSaveOrUpdateDTO;
import com.scrm.api.wx.cp.dto.WxDynamicMediaSaveDTO;
import com.scrm.api.wx.cp.dto.WxDynamicMediaUpdateDTO;
import com.scrm.api.wx.cp.entity.MediaInfo;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.api.wx.cp.entity.WxDynamicMedia;
import com.scrm.api.wx.cp.enums.BrCustomerDynamicModelEnum;
import com.scrm.api.wx.cp.enums.BrCustomerDynamicTypeEnum;
import com.scrm.api.wx.cp.enums.MediaTypeEnum;
import com.scrm.common.config.ScrmConfig;
import com.scrm.common.constant.Constants;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.BrLookRemarkDTO;
import com.scrm.server.wx.cp.dto.BrMediaCountQueryDTO;
import com.scrm.server.wx.cp.dto.DynamicMediaCountDTO;
import com.scrm.server.wx.cp.dto.WxDynamicMediaVO;
import com.scrm.server.wx.cp.mapper.WxDynamicMediaMapper;
import com.scrm.server.wx.cp.service.*;
import com.scrm.server.wx.cp.utils.WxMsgUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Date;
import java.util.List;

/**
 * 客户查看素材的动态 服务实现类
 * @author xxh
 * @since 2022-03-16
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class WxDynamicMediaServiceImpl extends ServiceImpl<WxDynamicMediaMapper, WxDynamicMedia> implements IWxDynamicMediaService {

    @Autowired
    private IWxCustomerService customerService;

    @Autowired
    private IStaffService staffService;

    @Autowired
    private IMediaInfoService mediaInfoService;

    @Autowired
    private IBrCustomerDynamicService brCustomerDynamicService;

    String contentFormat = "客户动态提醒\n" +
            "%tF %tT\n" +
            "%s查看%s[%s]\n" +
            "<a href=\"%s\">立即前往</a>";

    @Override
    public WxDynamicMedia save(WxDynamicMediaSaveDTO dto){

        //获取客户id
        WxCustomer customer = customerService.getOne(new QueryWrapper<WxCustomer>().lambda()
                .eq(WxCustomer::getExtCorpId, dto.getCorpId())
                .eq(WxCustomer::getExtId, dto.getCustomerExtId()));

        //拿轨迹素材
        MediaInfo mediaInfo = mediaInfoService.checkExists(dto.getMediaInfoId());

        //封装数据
        WxDynamicMedia wxDynamicMedia = new WxDynamicMedia();
        BeanUtils.copyProperties(dto,wxDynamicMedia);
        wxDynamicMedia.setId(UUID.get32UUID())
                .setExtCorpId(dto.getCorpId())
                .setExtCustomerId(dto.getCustomerExtId()).setTime(0)
                .setCreatedAt(new Date()).setUpdatedAt(new Date());

        //入库
        save(wxDynamicMedia);

        //客户动态
        CustomerDynamicInfoDTO infoDTO = new CustomerDynamicInfoDTO()
                .setMediaInfo(mediaInfo)
                .setDynamicMediaId(wxDynamicMedia.getId());
        brCustomerDynamicService.save(BrCustomerDynamicModelEnum.TRACK_MATERIAL.getCode(),
                BrCustomerDynamicTypeEnum.CHECK.getCode(),
                dto.getCorpId(), null, dto.getCustomerExtId(), infoDTO);

        //打标签
        if (customer.getHasFriend() && ListUtils.isNotEmpty(mediaInfo.getWxTagList())) {
            WxCustomerTagSaveOrUpdateDTO tagSaveOrUpdateDTO = new WxCustomerTagSaveOrUpdateDTO();
            tagSaveOrUpdateDTO.setAddTags(mediaInfo.getWxTagList());
            tagSaveOrUpdateDTO.setId(customerService.checkExists(dto.getCorpId(), dto.getCustomerExtId()).getId());
            tagSaveOrUpdateDTO.setStaffId(staffService.checkExists(dto.getExtStaffId(), dto.getCorpId()).getId());
            tagSaveOrUpdateDTO.setExtCorpId(customer.getExtCorpId());
            tagSaveOrUpdateDTO.setOrigin(Constants.DYNAMIC_TAG_TYPE_MEDIA);
            tagSaveOrUpdateDTO.setOperatorExtId(dto.getExtStaffId());

            customerService.queueEditTag(tagSaveOrUpdateDTO);

        }

        //发送应用消息
        if (mediaInfo.getHasInform() != null && mediaInfo.getHasInform()) {
            String urlSb = ScrmConfig.getCustomerDetailUrl() + "?" +
                    "customerId=" + customer.getId() +
                    "&extCustomerId=" + customer.getExtId() +
                    "&extCorpId=" + customer.getExtCorpId();
            //获取消息内容
            String content = String.format(contentFormat,
                    new Date(), new Date(), customer.getName(),
                    MediaTypeEnum.getNameByCode(mediaInfo.getType()),
                    mediaInfo.getTitle(), urlSb);

            //发送
            WxMsgUtils.sendMessage(dto.getCorpId(), content, Collections.singletonList(dto.getExtStaffId()));
        }

        return wxDynamicMedia;
    }


    @Override
    public WxDynamicMedia updateTime(WxDynamicMediaUpdateDTO dto){

        //校验参数
        WxDynamicMedia old = checkExists(dto.getId());

        old.setTime(dto.getTime());

        //入库
        updateById(old);

        return old;
    }

    @Override
    public WxDynamicMedia checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        WxDynamicMedia byId = getById(id);
        if (byId == null) {
            throw new BaseException("客户查看素材的动态不存在");
        }
        return byId;
    }

    @Override
    public List<DynamicMediaCountDTO> countByMediaId(BrMediaCountQueryDTO dto) {
        return baseMapper.countByMediaId(dto);
    }

    @Override
    public IPage<WxDynamicMediaVO> listLookRemark(BrLookRemarkDTO dto) {
        LambdaQueryWrapper<WxDynamicMedia> wrapper = new QueryWrapper<WxDynamicMedia>().lambda()
                .eq(WxDynamicMedia::getExtCorpId, dto.getExtCorpId())
                .eq(WxDynamicMedia::getMediaInfoId, dto.getId())
                .orderByDesc(WxDynamicMedia::getCreatedAt);


        IPage<WxDynamicMedia> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }

    /**
     * 翻译
     *
     * @param wxDynamicMedia 实体
     * @return WxDynamicMediaVO 结果集
     * @author xxh
     * @date 2022-05-19
     */
    private WxDynamicMediaVO translation(WxDynamicMedia wxDynamicMedia) {
        WxDynamicMediaVO vo = new WxDynamicMediaVO();
        BeanUtils.copyProperties(wxDynamicMedia, vo);

        vo.setStaff(staffService.find(vo.getExtCorpId(), vo.getExtStaffId()));
        vo.setWxCustomer(customerService.checkExistsWithNoFriend(vo.getExtCorpId(), vo.getExtCustomerId()));
        vo.setMediaInfo(mediaInfoService.checkExists(wxDynamicMedia.getMediaInfoId()));
        
        return vo;
    }
}
