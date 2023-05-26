package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.entity.WxGroupChatTagGroup;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.api.wx.cp.dto.WxGroupChatTagGroupPageDTO;
import com.scrm.api.wx.cp.dto.WxGroupChatTagGroupSaveDTO;
import com.scrm.api.wx.cp.dto.WxGroupChatTagGroupUpdateDTO;

import com.scrm.api.wx.cp.dto.WxGroupChatTagGroupQueryDTO;
import com.scrm.api.wx.cp.vo.WxGroupChatTagGroupVO;

import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;

import com.scrm.common.dto.BatchDTO;

/**
 * 客户群聊标签组 服务类
 * @author xxh
 * @since 2022-02-22
 */
public interface IWxGroupChatTagGroupService extends IService<WxGroupChatTagGroup> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-02-22
     * @param dto 请求参数
     */
    IPage<WxGroupChatTagGroupVO> pageList(WxGroupChatTagGroupPageDTO dto);

    /**
     * 查询列表
     * @author xxh
     * @date 2022-02-22
     * @param dto 请求参数
     */
    List<WxGroupChatTagGroupVO> queryList(WxGroupChatTagGroupQueryDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-02-22
     * @param id 主键
     */
    WxGroupChatTagGroupVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-02-22
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.WxGroupChatTagGroup
     */
    WxGroupChatTagGroup save(WxGroupChatTagGroupSaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2022-02-22
      * @param dto 请求参数
      * @return com.scrm.api.wx.cp.entity.WxGroupChatTagGroup
      */
    WxGroupChatTagGroup update(WxGroupChatTagGroupUpdateDTO dto);


    /**
     * 删除
     * @author xxh
     * @date 2022-02-22
     * @param id 客户群聊标签组id
     */
    void delete(String id);

    /**
     * 批量删除
     * @author xxh
     * @date 2022-02-22
     * @param dto 请求参数
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-02-22
     * @param id 客户群聊标签组id
     * @return com.scrm.api.wx.cp.entity.WxGroupChatTagGroup
     */
    WxGroupChatTagGroup checkExists(String id);

}
