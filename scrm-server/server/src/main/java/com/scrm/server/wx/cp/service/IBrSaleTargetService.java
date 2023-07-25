package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.dto.BrSaleTargetQueryDTO;
import com.scrm.server.wx.cp.dto.BrSaleTargetSaveDTO;
import com.scrm.server.wx.cp.dto.BrSaleTargetUpdateDTO;
import com.scrm.server.wx.cp.entity.BrSaleTarget;
import com.scrm.server.wx.cp.vo.BrSaleTargetVO;

import java.util.List;

/**
 * 销售目标 服务类
 * @author xxh
 * @since 2022-07-20
 */
public interface IBrSaleTargetService extends IService<BrSaleTarget> {
    
    /**
     * 查询列表
     * @author xxh
     * @date 2022-07-20
     * @param dto 请求参数
     */
    List<BrSaleTargetVO> queryList(BrSaleTargetQueryDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-07-20
     * @param id 主键
     */
    List<BrSaleTargetVO> findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-07-20
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrSaleTarget
     */
    BrSaleTarget save(BrSaleTargetSaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2022-07-20
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.BrSaleTarget
      */
    BrSaleTarget update(BrSaleTargetUpdateDTO dto);


    /**
     * 删除
     * @author xxh
     * @date 2022-07-20
     * @param id 销售目标id
     */
    void delete(String id);
    
    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-07-20
     * @param id 销售目标id
     * @return com.scrm.server.wx.cp.entity.BrSaleTarget
     */
    BrSaleTarget checkExists(String id);

    BrSaleTargetVO getStaffCurrentMonthSalesTarget();

}
