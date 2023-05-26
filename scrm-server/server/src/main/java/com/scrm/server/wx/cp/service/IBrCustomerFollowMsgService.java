package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.dto.BrCustomerFollowMsgPageDTO;
import com.scrm.server.wx.cp.entity.BrCustomerFollowMsg;
import com.scrm.server.wx.cp.vo.BrCustomerFollowMsgVO;

/**
 * 客户跟进的消息 服务类
 * @author xxh
 * @since 2022-05-19
 */
public interface IBrCustomerFollowMsgService extends IService<BrCustomerFollowMsg> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-05-19
     * @param dto 请求参数
     */
    IPage<BrCustomerFollowMsgVO> pageList(BrCustomerFollowMsgPageDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-05-19
     * @param id 主键
     */
    BrCustomerFollowMsgVO findById(String id);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-05-19
     * @param id 客户跟进的消息id
     * @return com.scrm.server.wx.cp.entity.BrCustomerFollowMsg
     */
    BrCustomerFollowMsg checkExists(String id);

    /**
     * 读消息
     * @param extCorpId
     * @param id
     */
    void readMsg(String extCorpId, String id);

    /**
     * 根据跟进id读消息
     * @param extCorpId
     * @param followId
     */
    void readMsgByFollow(String extCorpId, String followId);
}
