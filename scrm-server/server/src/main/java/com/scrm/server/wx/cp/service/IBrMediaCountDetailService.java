package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.entity.BrMediaCountDetail;

/**
 * 素材统计表详情 服务类
 * @author xxh
 * @since 2022-05-17
 */
public interface IBrMediaCountDetailService extends IService<BrMediaCountDetail> {

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-05-17
     * @param id 素材统计表详情id
     * @return com.scrm.server.wx.cp.entity.BrMediaCountDetail
     */
    BrMediaCountDetail checkExists(String id);

}
