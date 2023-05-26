package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.dto.BrMediaSayGroupQueryDTO;
import com.scrm.server.wx.cp.dto.BrMediaSayGroupSaveDTO;
import com.scrm.server.wx.cp.dto.BrMediaSayGroupUpdateDTO;
import com.scrm.server.wx.cp.entity.BrMediaSayGroup;
import com.scrm.server.wx.cp.vo.BrMediaSayGroupVO;

import java.util.List;

/**
 * （素材库）企业微信话术组管理 服务类
 * @author xxh
 * @since 2022-05-10
 */
public interface IBrMediaSayGroupService extends IService<BrMediaSayGroup> {

    /**
     * 查询列表
     * @author xxh
     * @date 2022-05-10
     * @param dto 请求参数
     */
    List<BrMediaSayGroupVO> queryList(BrMediaSayGroupQueryDTO dto);

    /**
     * 新增
     * @author xxh
     * @date 2022-05-10
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrMediaSayGroup
     */
    BrMediaSayGroup save(BrMediaSayGroupSaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2022-05-10
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.BrMediaSayGroup
      */
    BrMediaSayGroup update(BrMediaSayGroupUpdateDTO dto);


    /**
     * 删除
     * @author xxh
     * @date 2022-05-10
     * @param id （素材库）企业微信话术组管理id
     */
    void delete(String id);


    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-05-10
     * @param id （素材库）企业微信话术组管理id
     * @return com.scrm.server.wx.cp.entity.BrMediaSayGroup
     */
    BrMediaSayGroup checkExists(String id);

}
