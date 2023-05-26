package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.ContactWayGroupSaveDTO;
import com.scrm.api.wx.cp.dto.ContactWayGroupUpdateDTO;
import com.scrm.api.wx.cp.entity.ContactWayGroup;
import com.scrm.api.wx.cp.vo.ContactWayGroupRepeatVO;
import com.scrm.api.wx.cp.vo.ContactWayGroupVO;

import java.util.List;

/**
 * 渠道活码-分组信息 服务类
 * @author xxh
 * @since 2021-12-26
 */
public interface IContactWayGroupService extends IService<ContactWayGroup> {


    /**
     * 查询列表
     * @author xxh
     * @date 2021-12-26
     */
    List<ContactWayGroupVO> queryList(String extCorpId);


    /**
     * 新增
     * @author xxh
     * @date 2021-12-26
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.ContactWayGroup
     */
    ContactWayGroup save(ContactWayGroupSaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2021-12-26
      * @param dto 请求参数
      * @return com.scrm.api.wx.cp.entity.ContactWayGroup
      */
    ContactWayGroup update(ContactWayGroupUpdateDTO dto);


    /**
     * 删除
     * @author xxh
     * @date 2021-12-26
     * @param id 渠道活码-分组信息id
     */
    void delete(String id);


    /**
     * 校验是否存在
     * @author xxh
     * @date 2021-12-26
     * @param id 渠道活码-分组信息id
     * @return com.scrm.api.wx.cp.entity.ContactWayGroup
     */
    ContactWayGroup checkExists(String id);

    /**
     * 重名校验
     * @param dto
     * @return
     */
    Boolean checkRepeat(ContactWayGroupRepeatVO dto);
}
