package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.dto.*;
import com.scrm.server.wx.cp.entity.BrGroupChatWelcome;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.vo.BrGroupChatWelcomeVO;
import com.scrm.api.wx.cp.dto.*;

import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;

/**
 * 入群欢迎语 服务类
 * @author xxh
 * @since 2022-04-24
 */
public interface IBrGroupChatWelcomeService extends IService<BrGroupChatWelcome> {


    /**
     * 分页查询
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-04-23
     */
    IPage<BrGroupChatWelcomeVO> pageList(BrGroupChatWelcomePageDTO dto);

    /**
     * 查询列表
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-04-23
     */
    List<BrGroupChatWelcomeVO> queryList(BrGroupChatWelcomeQueryDTO dto);

    /**
     * 根据id查询
     *
     * @param id 主键
     * @author xxh
     * @date 2022-04-23
     */
    BrGroupChatWelcomeVO findById(String id);


    /**
     * 新增/修改
     *
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrGroupChatWelcome
     * @author xxh
     * @date 2022-04-23
     */
    BrGroupChatWelcome saveOrUpdate(BrGroupChatWelcomeSaveOrUpdateDTO dto);


    /**
     * 删除
     *
     * @param id 好友欢迎语id
     * @author xxh
     * @date 2022-04-23
     */
    void delete(String id);

    /**
     * 批量删除
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-04-23
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     *
     * @param id 好友欢迎语id
     * @return com.scrm.server.wx.cp.entity.BrGroupChatWelcome
     * @author xxh
     * @date 2022-04-23
     */
    BrGroupChatWelcome checkExists(String id);


    /**
     * 获取消息
     * @param groupChatExtId
     * @param extCorpId
     * @return
     */
    WxMsgDTO getMxgByGroupChatExtId(String extCorpId, String groupChatExtId);

}
