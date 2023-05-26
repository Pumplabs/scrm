package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.dto.SysSwitchUpdateDTO;
import com.scrm.api.wx.cp.entity.SysSwitch;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.SysSwitchQueryDTO;

import java.util.List;

/**
 * 系统开关服务类
 *
 * @author xxh
 * @since 2022-03-26
 */
public interface ISysSwitchService extends IService<SysSwitch> {


    /**
     * 查询列表
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-03-26
     */
    List<SysSwitch> queryList(SysSwitchQueryDTO dto);


    /**
     * 根据编码获取
     *
     * @param extCorpId 企业ID
     * @param code      编码
     * @author xxh
     * @date 2022-03-26
     */
    SysSwitch getByCode(String extCorpId, String code);


    /**
     * 修改开关
     * @param dto 请求参数
     * @return 对象
     */
    SysSwitch update(SysSwitchUpdateDTO dto);
}
