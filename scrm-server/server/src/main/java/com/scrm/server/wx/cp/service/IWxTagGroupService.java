package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.entity.WxTagGroup;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.api.wx.cp.dto.WxTagGroupPageDTO;
import com.scrm.api.wx.cp.dto.WxTagGroupSaveDTO;
import com.scrm.api.wx.cp.dto.WxTagGroupUpdateDTO;

import com.scrm.api.wx.cp.dto.WxTagGroupQueryDTO;
import com.scrm.api.wx.cp.vo.WxTagGroupVO;

import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.List;

import com.scrm.common.dto.BatchDTO;
import me.chanjar.weixin.common.error.WxErrorException;

/**
 * 企业微信标签组管理 服务类
 *
 * @author xxh
 * @since 2021-12-29
 */
public interface IWxTagGroupService extends IService<WxTagGroup> {


    /**
     * 分页查询
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2021-12-29
     */
    IPage<WxTagGroupVO> pageList(WxTagGroupPageDTO dto);

    /**
     * 查询列表
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2021-12-29
     */
    List<WxTagGroupVO> queryList(WxTagGroupQueryDTO dto);

    /**
     * 根据id查询
     *
     * @param id 主键
     * @author xxh
     * @date 2021-12-29
     */
    WxTagGroupVO findById(String id);


    /**
     * 新增
     *
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.WxTagGroup
     * @author xxh
     * @date 2021-12-29
     */
    WxTagGroupVO save(WxTagGroupSaveDTO dto) throws WxErrorException;

    /**
     * 修改
     *
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.WxTagGroup
     * @author xxh
     * @date 2021-12-29
     */
    WxTagGroup update(WxTagGroupUpdateDTO dto) throws WxErrorException;


    /**
     * 删除
     *
     * @param id 企业微信标签组管理id
     * @author xxh
     * @date 2021-12-29
     */
    void delete(String id) throws WxErrorException;

    /**
     * 删除
     *
     * @param id               企业微信标签组管理id
     * @param needRemoteDelete 是否需要调用企微接口远程删除
     * @author xxh
     * @date 2021-12-29
     */
    void delete(String id, boolean needRemoteDelete) throws WxErrorException;

    /**
     * 批量删除(未调用微信接口删除)
     *
     * @param dto 请求参数
     * @return void
     * @author xuxh
     * @date 2022/1/5 18:32
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     *
     * @param id 企业微信标签组管理id
     * @return com.scrm.api.wx.cp.entity.WxTagGroup
     * @author xxh
     * @date 2021-12-29
     */
    WxTagGroup checkExists(String id);

    /**
     * 同步数据
     *
     * @param extCorpId 企业ID
     * @return 是否成功
     */
    Boolean sync(String extCorpId) throws WxErrorException;

    /**
     * 同步数据
     *
     * @param extCorpId 企业ID
     * @param extId     企业微信标签ID
     * @param tagType   标签类型
     * @return 是否成功
     */
    Boolean sync(String extCorpId, String extId, String tagType) throws WxErrorException;

}
