package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.WxDynamicMediaSaveDTO;
import com.scrm.api.wx.cp.dto.WxDynamicMediaUpdateDTO;
import com.scrm.api.wx.cp.entity.WxDynamicMedia;
import com.scrm.server.wx.cp.dto.BrLookRemarkDTO;
import com.scrm.server.wx.cp.dto.BrMediaCountQueryDTO;
import com.scrm.server.wx.cp.dto.DynamicMediaCountDTO;
import com.scrm.server.wx.cp.dto.WxDynamicMediaVO;

import java.util.List;

/**
 * 客户查看素材的动态 服务类
 * @author xxh
 * @since 2022-03-16
 */
public interface IWxDynamicMediaService extends IService<WxDynamicMedia> {

    /**
     * 新增
     * @author xxh
     * @date 2022-03-16
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.WxDynamicMedia
     */
    WxDynamicMedia save(WxDynamicMediaSaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2022-03-16
      * @param dto 请求参数
      * @return com.scrm.api.wx.cp.entity.WxDynamicMedia
      */
    WxDynamicMedia updateTime(WxDynamicMediaUpdateDTO dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-03-16
     * @param id 客户查看素材的动态id
     * @return com.scrm.api.wx.cp.entity.WxDynamicMedia
     */
    WxDynamicMedia checkExists(String id);

    /**
     * 根据素材统计
     * @param dto
     * @return
     */
    List<DynamicMediaCountDTO> countByMediaId(BrMediaCountQueryDTO dto);

    /**
     * 根据素材查看动态数据
     * @param dto
     * @return
     */
    IPage<WxDynamicMediaVO> listLookRemark(BrLookRemarkDTO dto);
}
