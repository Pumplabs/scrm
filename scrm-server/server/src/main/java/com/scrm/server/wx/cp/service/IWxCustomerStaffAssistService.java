package com.scrm.server.wx.cp.service;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.server.wx.cp.dto.WxCustomerStaffAssistSaveOrUpdateDTO;
import com.scrm.server.wx.cp.entity.WxCustomerStaffAssist;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.dto.WxCustomerStaffAssistQueryDTO;

import java.util.List;

/**
 * 客户-员工跟进协助人 服务类
 * @author xxh
 * @since 2022-08-02
 */
public interface IWxCustomerStaffAssistService extends IService<WxCustomerStaffAssist> {




    /**
     * 查询列表
     * @author xxh
     * @date 2022-08-02
     * @param dto 请求参数
     */
    List<Staff> queryStaffAssistList(WxCustomerStaffAssistQueryDTO dto);



     /**
      * 修改
      * @author xxh
      * @date 2022-08-02
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.WxCustomerStaffAssist
      */
    void saveOrUpdate(WxCustomerStaffAssistSaveOrUpdateDTO dto);


    /**
     * 删除
     * @author xuxh
     * @date 2022/8/3 19:00
     * @param dto
     * @return void
     */
    void remove(WxCustomerStaffAssistSaveOrUpdateDTO dto);


}
