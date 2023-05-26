package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.MediaTagSaveDTO;
import com.scrm.api.wx.cp.entity.MediaTag;
import com.scrm.api.wx.cp.vo.MediaTagVO;

/**
 * （素材库）企业微信标签管理 服务类
 * @author xxh
 * @since 2022-03-13
 */
public interface IMediaTagService extends IService<MediaTag> {

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-03-13
     * @param id 主键
     */
    MediaTagVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-03-13
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.MediaTag
     */
    MediaTag save(MediaTagSaveDTO dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-03-13
     * @param id （素材库）企业微信标签管理id
     * @return com.scrm.api.wx.cp.entity.MediaTag
     */
    MediaTag checkExists(String id);

}
