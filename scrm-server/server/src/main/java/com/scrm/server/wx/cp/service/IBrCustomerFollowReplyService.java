package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.dto.BrCustomerFollowReplyQueryDTO;
import com.scrm.server.wx.cp.dto.BrCustomerFollowReplySaveDTO;
import com.scrm.server.wx.cp.entity.BrCustomerFollowReply;
import com.scrm.server.wx.cp.vo.BrCustomerFollowReplyVO;

import java.util.List;

/**
 * 客户跟进回复表 服务类
 * @author xxh
 * @since 2022-05-19
 */
public interface IBrCustomerFollowReplyService extends IService<BrCustomerFollowReply> {

    /**
     * 查询列表
     * @author xxh
     * @date 2022-05-19
     * @param dto 请求参数
     */
    List<BrCustomerFollowReplyVO> queryList(BrCustomerFollowReplyQueryDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-05-19
     * @param id 主键
     */
    BrCustomerFollowReplyVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-05-19
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrCustomerFollowReply
     */
    BrCustomerFollowReply save(BrCustomerFollowReplySaveDTO dto);

    /**
     * 删除
     * @author xxh
     * @date 2022-05-19
     * @param id 客户跟进回复表id
     */
    void delete(String id);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-05-19
     * @param id 客户跟进回复表id
     * @return com.scrm.server.wx.cp.entity.BrCustomerFollowReply
     */
    BrCustomerFollowReply checkExists(String id);

}
