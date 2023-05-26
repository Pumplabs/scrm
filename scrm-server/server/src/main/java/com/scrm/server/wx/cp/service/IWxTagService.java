package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.common.dto.BatchDTO;
import com.scrm.api.wx.cp.dto.WxTagDTO;
import com.scrm.api.wx.cp.dto.WxTagPageDTO;
import com.scrm.api.wx.cp.dto.WxTagQueryDTO;
import com.scrm.api.wx.cp.entity.WxTag;
import com.scrm.api.wx.cp.vo.WxTagVO;
import me.chanjar.weixin.common.error.WxErrorException;

import java.util.List;

/**
 * 企业微信标签管理 服务类
 * @author xxh
 * @since 2021-12-29
 */
public interface IWxTagService extends IService<WxTag> {


    /**
     * 分页查询
     * @author xxh
     * @date 2021-12-29
     * @param dto 请求参数
     */
    IPage<WxTagVO> pageList(WxTagPageDTO dto);

    /**
     * 查询列表
     * @author xxh
     * @date 2021-12-29
     * @param dto 请求参数
     */
    List<WxTagVO> queryList(WxTagQueryDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2021-12-29
     * @param id 主键
     */
    WxTagVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2021-12-29
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.WxTag
     */
    WxTag save(WxTagDTO dto) throws WxErrorException;

    /**
     * 删除
     * @author xxh
     * @date 2021-12-29
     * @param id 企业微信标签管理id
     */
    void delete(String id) throws WxErrorException;

    /**
     * 删除
     * @author xxh
     * @date 2021-12-29
     * @param id 企业微信标签管理id
     * @param needRemoteDelete 是否需要调用企微接口远程删除
     */
    void delete(String id, boolean needRemoteDelete) throws WxErrorException;

    /**
     * 批量删除(删除关联，未调微信接口删除标签)
     * @author xxh
     * @date 2021-12-29
     * @param dto 请求参数
     */
    List<String> batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2021-12-29
     * @param id 企业微信标签管理id
     * @return com.scrm.api.wx.cp.entity.WxTag
     */
    WxTag checkExists(String id);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2021-12-29
     * @param id 企业微信标签管理id
     * @return com.scrm.api.wx.cp.entity.WxTag
     */
    WxTag checkExists(String extCorpId, String extId);

    /**
     * 根据id批量查询标签名称
     * @param ids
     * @return
     */
    List<String> getNameByIds(List<String> ids);

}
