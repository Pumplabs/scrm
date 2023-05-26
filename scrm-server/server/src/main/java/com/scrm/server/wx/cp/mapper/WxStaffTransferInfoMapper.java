package com.scrm.server.wx.cp.mapper;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.scrm.api.wx.cp.dto.WxWaitTransferCustomerPageDTO;
import com.scrm.api.wx.cp.dto.WxWaitTransferGroupChatPageDTO;
import com.scrm.api.wx.cp.entity.WxCustomer;
import com.scrm.api.wx.cp.entity.WxGroupChat;
import com.scrm.api.wx.cp.entity.WxStaffTransferInfo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

/**
 * 员工在职转接记录 Mapper接口
 *
 * @author xxh
 * @since 2022-03-05
 */
public interface WxStaffTransferInfoMapper extends BaseMapper<WxStaffTransferInfo> {

    Page<WxCustomer> waitTransferCustomerPage(Page<WxCustomer> page, @Param("dto") WxWaitTransferCustomerPageDTO dto);

}
