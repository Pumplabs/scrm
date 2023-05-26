package com.scrm.server.wx.cp.service;

import com.scrm.server.wx.cp.dto.BrOrderProductSaveOrUpdateDTO;
import com.scrm.server.wx.cp.entity.BrOrderProduct;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.dto.BrOrderProductPageDTO;
import com.scrm.server.wx.cp.dto.BrOrderProductQueryDTO;
import com.scrm.server.wx.cp.vo.BrOrderProductVO;
import com.baomidou.mybatisplus.core.metadata.IPage;

import java.util.List;
import java.util.Set;

/**
 * 订单-产品关联 服务类
 *
 * @author xxh
 * @since 2022-07-25
 */
public interface IBrOrderProductService extends IService<BrOrderProduct> {


    /**
     * 分页查询
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-07-25
     */
    IPage<BrOrderProductVO> pageList(BrOrderProductPageDTO dto);

    /**
     * 查询列表
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2022-07-25
     */
    List<BrOrderProductVO> queryList(BrOrderProductQueryDTO dto);

    /**
     * 根据id查询
     *
     * @param id 主键
     * @author xxh
     * @date 2022-07-25
     */
    BrOrderProductVO findById(String id);


    /**
     * 校验是否存在
     *
     * @param id 订单-产品关联id
     * @return com.scrm.server.wx.cp.entity.BrOrderProduct
     * @author xxh
     * @date 2022-07-25
     */
    BrOrderProduct checkExists(String id);

    /**
     * 批量新增/修改
     *
     * @param orderId     订单ID
     * @param productList 产品列表
     * @return void
     * @author xuxh
     * @date 2022/7/25 15:16
     */
    List<BrOrderProduct> batchSaveOrUpdate(String orderId, List<BrOrderProductSaveOrUpdateDTO> productList);

    /**
     *根据订单ID批量删除
     * @author xuxh
     * @date 2022/7/25 15:57
     * @param orderIds 订单ID列表
     */
    void batchDeleteByOrderIds(List<String> orderIds);
}
