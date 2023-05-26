package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.common.dto.BatchDTO;
import com.scrm.api.wx.cp.dto.MediaInfoPageDTO;
import com.scrm.api.wx.cp.dto.MediaInfoSaveDTO;
import com.scrm.api.wx.cp.dto.MediaInfoUpdateDTO;
import com.scrm.api.wx.cp.entity.MediaInfo;
import com.scrm.api.wx.cp.vo.MediaInfoVO;

/**
 * 素材管理 服务类
 * @author xxh
 * @since 2022-03-14
 */
public interface IMediaInfoService extends IService<MediaInfo> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-03-14
     * @param dto 请求参数
     */
    IPage<MediaInfoVO> pageList(MediaInfoPageDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-03-14
     * @param id 主键
     */
    MediaInfoVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-03-14
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.MediaInfo
     */
    MediaInfo save(MediaInfoSaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2022-03-14
      * @param dto 请求参数
      * @return com.scrm.api.wx.cp.entity.MediaInfo
      */
    MediaInfo update(MediaInfoUpdateDTO dto);

    /**
     * 批量删除
     * @author xxh
     * @date 2022-03-14
     * @param dto 请求参数
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-03-14
     * @param id 素材管理id
     * @return com.scrm.api.wx.cp.entity.MediaInfo
     */
    MediaInfo checkExists(String id);

}
