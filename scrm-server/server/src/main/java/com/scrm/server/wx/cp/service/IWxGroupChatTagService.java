package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.entity.WxGroupChatTag;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.api.wx.cp.dto.WxGroupChatTagPageDTO;
import com.scrm.api.wx.cp.dto.WxGroupChatTagSaveDTO;

import com.scrm.api.wx.cp.dto.WxGroupChatTagQueryDTO;
import com.scrm.api.wx.cp.vo.WxGroupChatTagVO;

import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.common.dto.BatchDTO;

/**
 * 客户群聊标签 服务类
 * @author xxh
 * @since 2022-02-22
 */
public interface IWxGroupChatTagService extends IService<WxGroupChatTag> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-02-22
     * @param dto 请求参数
     */
    IPage<WxGroupChatTagVO> pageList(WxGroupChatTagPageDTO dto);

    /**
     * 查询列表
     * @author xxh
     * @date 2022-02-22
     * @param dto 请求参数
     */
    List<WxGroupChatTagVO> queryList(WxGroupChatTagQueryDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-02-22
     * @param id 主键
     */
    WxGroupChatTagVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-02-22
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.WxGroupChatTag
     */
    WxGroupChatTag save(WxGroupChatTagSaveDTO dto);

    /**
     * 修改
     * @author xxh
     * @date 2022-02-22
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.WxGroupChatTag
     */
    WxGroupChatTag saveOrUpdate(WxGroupChatTagUpdateDTO dto);

    /**
     * 删除
     * @author xxh
     * @date 2022-02-22
     * @param id 客户群聊标签id
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
     * @param id 客户群聊标签id
     * @return com.scrm.api.wx.cp.entity.WxGroupChatTag
     */
    WxGroupChatTag checkExists(String id);

    /**
     * 批量打标
     * @author xuxh
     * @date 2022/2/23 17:04
     * @param dto 请求参数
     */
    void batchMarking(WxGroupChatTagBatchMarkingDTO dto);
}
