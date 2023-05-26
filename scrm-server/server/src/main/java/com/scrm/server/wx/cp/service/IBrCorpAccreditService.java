package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.BrCorpSeeDTO;
import com.scrm.api.wx.cp.dto.CorpInfoDTO;
import com.scrm.common.entity.BrCorpAccredit;
import com.scrm.server.wx.cp.vo.SeatStaffVO;
import me.chanjar.weixin.common.error.WxErrorException;

import java.util.List;

/**
 * 企业授权信息 服务类
 * @author xxh
 * @since 2022-04-10
 */
public interface IBrCorpAccreditService extends IService<BrCorpAccredit> {

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-04-10
     * @param id 企业授权信息id
     * @return com.scrm.common.entity.BrCorpAccredit
     */
    BrCorpAccredit checkExists(String id);

    /**
     * 根据公司id获取授权码
     * @param corpId
     * @return
     */
    BrCorpAccredit getByCorpId(String corpId);

    /**
     * 根据corpId查询agentId
     * @param corpId
     * @return
     */
    Integer getAgentIdByCorpId(String corpId);

    /**
     * 根据corpId查询CorpName
     * @param corpId
     * @return
     */
    String getCorpNameByCorpId(String corpId);

    /**
     * 记录企业信息
     * @param dto
     */
    void registerCorpInfo(CorpInfoDTO dto);

    /**
     * 根据企业id删除授权信息
     * @param authCorpId
     */
    void deleteByCorpId(String authCorpId);

    /**
     * 更新授权信息
     * @param corpId
     */
    void update(String corpId) throws WxErrorException;

    /**
     * 获取授权企业的可见员工和可见部门
     * @return
     */
    BrCorpSeeDTO getSeeByCorpId(String extCorpId);

    /**
     * 根据公司id获取企业的可见员工范围extId
     * @param corpId
     * @return
     */
    List<String> getSeeStaffFromRedis(String corpId, boolean forceFlush);

    /**
     * 根据公司获取企业的可见范围的员工
     * @param extCorpId
     * @return
     */
    SeatStaffVO getSeeStaff(String extCorpId);
}
