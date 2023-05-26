package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.MediaTagGroupPageDTO;
import com.scrm.api.wx.cp.dto.MediaTagGroupSaveDTO;
import com.scrm.api.wx.cp.dto.MediaTagGroupUpdateDTO;
import com.scrm.api.wx.cp.entity.MediaTagGroup;
import com.scrm.api.wx.cp.vo.MediaTagGroupVO;

/**
 * （素材库）企业微信标签组管理 服务类
 * @author xxh
 * @since 2022-03-13
 */
public interface IMediaTagGroupService extends IService<MediaTagGroup> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-03-13
     * @param dto 请求参数
     */
    IPage<MediaTagGroupVO> pageList(MediaTagGroupPageDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-03-13
     * @param id 主键
     */
    MediaTagGroupVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-03-13
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.MediaTagGroup
     */
    MediaTagGroup save(MediaTagGroupSaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2022-03-13
      * @param dto 请求参数
      * @return com.scrm.api.wx.cp.entity.MediaTagGroup
      */
    MediaTagGroup update(MediaTagGroupUpdateDTO dto);


    /**
     * 删除
     * @author xxh
     * @date 2022-03-13
     * @param id （素材库）企业微信标签组管理id
     */
    void delete(String id);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-03-13
     * @param id （素材库）企业微信标签组管理id
     * @return com.scrm.api.wx.cp.entity.MediaTagGroup
     */
    MediaTagGroup checkExists(String id);

}
