package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.dto.BrFriendWelcomeSaveOrUpdateDTO;
import com.scrm.server.wx.cp.entity.BrFriendWelcome;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.dto.BrFriendWelcomePageDTO;
import com.scrm.server.wx.cp.dto.BrFriendWelcomeQueryDTO;
import com.scrm.server.wx.cp.vo.BrFriendWelcomeVO;
import com.scrm.api.wx.cp.dto.*;

import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.List;

/**
 * 好友欢迎语 服务类
 *
 * @author xxh
 * @since 2022-04-23
 */
public interface IBrFriendWelcomeService extends IService<BrFriendWelcome> {


    /**
     * 分页查询
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-04-23
     */
    IPage<BrFriendWelcomeVO> pageList(BrFriendWelcomePageDTO dto);

    /**
     * 查询列表
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-04-23
     */
    List<BrFriendWelcomeVO> queryList(BrFriendWelcomeQueryDTO dto);

    /**
     * 根据id查询
     *
     * @param id 主键
     * @author xxh
     * @date 2022-04-23
     */
    BrFriendWelcomeVO findById(String id);


    /**
     * 新增/修改
     *
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrFriendWelcome
     * @author xxh
     * @date 2022-04-23
     */
    BrFriendWelcome saveOrUpdate(BrFriendWelcomeSaveOrUpdateDTO dto);


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
     * @return com.scrm.server.wx.cp.entity.BrFriendWelcome
     * @author xxh
     * @date 2022-04-23
     */
    BrFriendWelcome checkExists(String id);


    /**
     * 获取消息
     * @param staffExtId
     * @param extCorpId
     * @return
     */
    WxMsgDTO getMxgByStaffExtId(String extCorpId, String staffExtId);

}
