package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.common.exception.BaseException;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.ListUtils;
import com.scrm.common.util.UUID;
import com.scrm.api.wx.cp.dto.ContactWayGroupSaveDTO;
import com.scrm.api.wx.cp.dto.ContactWayGroupUpdateDTO;
import com.scrm.api.wx.cp.entity.ContactWay;
import com.scrm.api.wx.cp.entity.ContactWayGroup;
import com.scrm.server.wx.cp.mapper.ContactWayGroupMapper;
import com.scrm.server.wx.cp.service.IContactWayGroupService;
import com.scrm.server.wx.cp.service.IContactWayService;
import com.scrm.api.wx.cp.vo.ContactWayGroupRepeatVO;
import com.scrm.api.wx.cp.vo.ContactWayGroupVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 渠道活码-分组信息 服务实现类
 * @author xxh
 * @since 2021-12-26
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class ContactWayGroupServiceImpl extends ServiceImpl<ContactWayGroupMapper, ContactWayGroup> implements IContactWayGroupService {

    @Autowired
    private IContactWayService contactWayService;

    @Override
    public List<ContactWayGroupVO> queryList(String extCorpId){
        LambdaQueryWrapper<ContactWayGroup> wrapper = new QueryWrapper<ContactWayGroup>().lambda()
                .eq(ContactWayGroup::getExtCorpId, extCorpId)
                .orderByAsc(ContactWayGroup::getCreatedAt);

        List<ContactWayGroup> list = list(wrapper);

        if (ListUtils.isEmpty(list)) {
            ContactWayGroup defaultGroup = new ContactWayGroup()
                    .setId(UUID.get16UUID())
                    .setIsDefault(true)
                    .setCreatedAt(new Date())
                    .setUpdatedAt(new Date())
                    .setExtCorpId(extCorpId)
                    .setName("默认分组");
            
            save(defaultGroup);
            return queryList(extCorpId);
        }

        return list.stream().map(this::translation).collect(Collectors.toList());
    }




    @Override
    public ContactWayGroup save(ContactWayGroupSaveDTO dto){

        ContactWayGroupRepeatVO checkRepeatVO = new ContactWayGroupRepeatVO();
        BeanUtils.copyProperties(dto, checkRepeatVO);

        if (checkRepeat(checkRepeatVO)) {
            throw new BaseException("该分组名已被使用");
        }

        //封装数据
        ContactWayGroup contactWayGroup = new ContactWayGroup();
        BeanUtils.copyProperties(dto,contactWayGroup);
        contactWayGroup.setId(UUID.get32UUID());
        contactWayGroup.setExtCreatorId(JwtUtil.getUserId());
        contactWayGroup.setIsDefault(false);
        contactWayGroup.setCreatedAt(new Date());
        contactWayGroup.setUpdatedAt(new Date());

        //入库
        save(contactWayGroup);

        return contactWayGroup;
    }


    @Override
    public ContactWayGroup update(ContactWayGroupUpdateDTO dto){

        //校验参数
        ContactWayGroup old = checkExists(dto.getId());

        old.setName(dto.getName());
        old.setUpdatedAt(new Date());

        ContactWayGroupRepeatVO checkRepeatVO = new ContactWayGroupRepeatVO();
        BeanUtils.copyProperties(dto, checkRepeatVO);

        if (checkRepeat(checkRepeatVO)) {
            throw new BaseException("该分组名已被使用");
        }

        updateById(old);
        return old;
    }


    @Override
    public void delete(String id){

        //校验参数
        ContactWayGroup contactWayGroup = checkExists(id);

        removeById(id);

    }

    /**
     * 翻译
     * @param contactWayGroup 实体
     * @return ContactWayGroupVO 结果集
     * @author xxh
     * @date 2021-12-26
     */
    private ContactWayGroupVO translation(ContactWayGroup contactWayGroup){
        ContactWayGroupVO vo = new ContactWayGroupVO();
        BeanUtils.copyProperties(contactWayGroup, vo);

        vo.setCount((int) contactWayService.count(new QueryWrapper<ContactWay>().lambda().eq(ContactWay::getGroupId, vo.getId())));
        return vo;
    }


    @Override
    public ContactWayGroup checkExists(String id){
        if (StringUtils.isBlank(id)) {
            return null;
        }
        ContactWayGroup byId = getById(id);
        if (byId == null) {
            throw new BaseException("渠道活码-分组信息不存在");
        }
        return byId;
    }

    @Override
    public Boolean checkRepeat(ContactWayGroupRepeatVO dto) {

        return isNameRepeat(dto.getId(), dto.getName(), dto.getExtCorpId(), dto.getExtCreatorId());

    }

    private Boolean isNameRepeat(String id, String name, String extCorpId, String extCreatorId){

        LambdaQueryWrapper<ContactWayGroup> query = new QueryWrapper<ContactWayGroup>().lambda()
                .ne(id != null, ContactWayGroup::getId, id)
                .eq(ContactWayGroup::getName, name)
                .eq(ContactWayGroup::getExtCorpId, extCorpId)
                .eq(ContactWayGroup::getExtCreatorId, extCreatorId);

        return count(query) > 0;

    }
}
