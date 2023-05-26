package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.dto.BrMediaSayGroupQueryDTO;
import com.scrm.server.wx.cp.dto.BrMediaSayGroupSaveDTO;
import com.scrm.server.wx.cp.dto.BrMediaSayGroupUpdateDTO;
import com.scrm.server.wx.cp.entity.BrMediaSay;
import com.scrm.server.wx.cp.entity.BrMediaSayGroup;
import com.scrm.server.wx.cp.mapper.BrMediaSayGroupMapper;
import com.scrm.server.wx.cp.service.IBrMediaSayGroupService;
import com.scrm.server.wx.cp.service.IBrMediaSayService;
import com.scrm.server.wx.cp.vo.BrMediaSayGroupVO;
import lombok.extern.slf4j.Slf4j;
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
 * （素材库）企业微信话术组管理 服务实现类
 * @author xxh
 * @since 2022-05-10
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrMediaSayGroupServiceImpl extends ServiceImpl<BrMediaSayGroupMapper, BrMediaSayGroup> implements IBrMediaSayGroupService {

    @Autowired
    private IBrMediaSayService sayService;

    @Override
    public List<BrMediaSayGroupVO> queryList(BrMediaSayGroupQueryDTO dto){

        checkDefault(dto.getExtCorpId(), dto.getHasPerson());

      LambdaQueryWrapper<BrMediaSayGroup> wrapper = new QueryWrapper<BrMediaSayGroup>()
        .lambda().eq(BrMediaSayGroup::getExtCorpId, dto.getExtCorpId())
                .eq(BrMediaSayGroup::getHasPerson, dto.getHasPerson())
                .eq(dto.getHasPerson(), BrMediaSayGroup::getCreatorExtId, JwtUtil.getExtUserId())
                .orderByDesc(BrMediaSayGroup::getHasDefault, BrMediaSayGroup::getCreatedAt);
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }

    /**
     * 检查是否有默认分组
     */
    private void checkDefault(String extCorpId, boolean hasPerson) {
        if (count(new QueryWrapper<BrMediaSayGroup>().lambda()
                .eq(BrMediaSayGroup::getExtCorpId, extCorpId)
                .eq(BrMediaSayGroup::getHasDefault, true)
                .eq(BrMediaSayGroup::getHasPerson, hasPerson)
                .eq(hasPerson, BrMediaSayGroup::getCreatorExtId, JwtUtil.getExtUserId())) == 0) {

            BrMediaSayGroup mediaSayGroup = new BrMediaSayGroup();
            mediaSayGroup.setId(UUID.get32UUID())
                    .setExtCorpId(extCorpId)
                    .setHasDefault(true)
                    .setHasPerson(hasPerson)
                    .setName("默认分组")
                    .setCreatorExtId(JwtUtil.getExtUserId())
                    .setCreatedAt(new Date())
                    .setUpdatedAt(new Date());

            save(mediaSayGroup);
        }

    }

    @Override
    public BrMediaSayGroup save(BrMediaSayGroupSaveDTO dto){

        //封装数据
        BrMediaSayGroup brMediaSayGroup = new BrMediaSayGroup();
        BeanUtils.copyProperties(dto,brMediaSayGroup);
        brMediaSayGroup.setId(UUID.get32UUID())
                .setCreatedAt(new Date())
                .setUpdatedAt(new Date())
                .setCreatorExtId(JwtUtil.getExtUserId())
                .setHasDefault(false);

        checkNameRepeat(null, dto.getExtCorpId(), dto.getHasPerson(), brMediaSayGroup.getName());

        //入库
        save(brMediaSayGroup);

        return brMediaSayGroup;
    }

    private void checkNameRepeat(String id, String extCorpId, Boolean hasPerson, String name){
        if (count(new QueryWrapper<BrMediaSayGroup>().lambda()
                .ne(StringUtils.isNotBlank(id), BrMediaSayGroup::getId, id)
                .eq(BrMediaSayGroup::getExtCorpId, extCorpId)
                .eq(BrMediaSayGroup::getHasPerson, hasPerson)
                .eq(BrMediaSayGroup::getName, name)) > 0) {
            throw new BaseException("该分组名已被使用！");
        }
    }

    @Override
    public BrMediaSayGroup update(BrMediaSayGroupUpdateDTO dto){

        //校验参数
        BrMediaSayGroup old = checkExists(dto.getId());

        //封装数据
        BrMediaSayGroup brMediaSayGroup = new BrMediaSayGroup();
        BeanUtils.copyProperties(old, brMediaSayGroup);
        BeanUtils.copyProperties(dto, brMediaSayGroup);

        brMediaSayGroup.setUpdatedAt(new Date());

        checkNameRepeat(brMediaSayGroup.getId(), brMediaSayGroup.getExtCorpId(), brMediaSayGroup.getHasPerson(), brMediaSayGroup.getName());
        //入库
        updateById(brMediaSayGroup);

        return brMediaSayGroup;
    }


    @Override
    public void delete(String id){

        //校验参数
        BrMediaSayGroup brMediaSayGroup = checkExists(id);

        if (brMediaSayGroup.getHasDefault()) {
            throw new BaseException("默认分组不允许删除！");
        }

        if (sayService.count(new QueryWrapper<BrMediaSay>().lambda()
                .eq(BrMediaSay::getGroupId, id)) > 0) {
            throw new BaseException("该分组存在话术，请先删除分组下的话术");
        }
        //删除
        removeById(id);

    }

    /**
     * 翻译
     * @param brMediaSayGroup 实体
     * @return BrMediaSayGroupVO 结果集
     * @author xxh
     * @date 2022-05-10
     */
    private BrMediaSayGroupVO translation(BrMediaSayGroup brMediaSayGroup){
        BrMediaSayGroupVO vo = new BrMediaSayGroupVO();
        BeanUtils.copyProperties(brMediaSayGroup, vo);

        long count = sayService.count(new QueryWrapper<BrMediaSay>().lambda()
                .eq(BrMediaSay::getExtCorpId, brMediaSayGroup.getExtCorpId())
                .eq(BrMediaSay::getGroupId, brMediaSayGroup.getId()));

        vo.setNum((int) count);
        return vo;
    }


    @Override
    public BrMediaSayGroup checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrMediaSayGroup byId = getById(id);
        if (byId == null) {
            throw new BaseException("（素材库）企业微信话术组管理不存在");
        }
        return byId;
    }
}
