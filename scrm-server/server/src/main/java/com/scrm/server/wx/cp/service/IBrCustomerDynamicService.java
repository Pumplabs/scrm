package com.scrm.server.wx.cp.service;

import com.scrm.api.wx.cp.dto.CustomerDynamicInfoDTO;
import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.entity.BrCustomerDynamic;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.dto.BrCustomerDynamicPageDTO;
import com.scrm.server.wx.cp.dto.BrCustomerDynamicSaveDTO;
import com.scrm.server.wx.cp.dto.BrCustomerDynamicQueryDTO;
import com.scrm.server.wx.cp.vo.BrCustomerDynamicVO;
import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;

/**
 * 客户动态 服务类
 * @author xxh
 * @since 2022-05-12
 */
public interface IBrCustomerDynamicService extends IService<BrCustomerDynamic> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-05-12
     * @param dto 请求参数
     */
    IPage<BrCustomerDynamicVO> pageList(BrCustomerDynamicPageDTO dto);

    /**
     * 查询列表
     * @author xxh
     * @date 2022-05-12
     * @param dto 请求参数
     */
    List<BrCustomerDynamicVO> queryList(BrCustomerDynamicQueryDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-05-12
     * @param id 主键
     */
    BrCustomerDynamicVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-05-12
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrCustomerDynamic
     */
    BrCustomerDynamic save(BrCustomerDynamicSaveDTO dto);

    /**
     * 删除
     * @author xxh
     * @date 2022-05-12
     * @param id 客户动态id
     */
    void delete(String id);

    /**
     * 批量删除
     * @author xxh
     * @date 2022-05-12
     * @param dto 请求参数
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-05-12
     * @param id 客户动态id
     * @return com.scrm.server.wx.cp.entity.BrCustomerDynamic
     */
    BrCustomerDynamic checkExists(String id);

    /**
     * 增删员工，根据队列来新增客户动态
     * @param changType
     * @param extCorpId
     * @param extStaffId
     * @param extCustomerId
     * @return
     */
    void saveByQueue(String changType, String extCorpId, String extStaffId, String extCustomerId, CustomerDynamicInfoDTO info);

    /**
     *  新增一条客户动态
     * @param model
     * @param type
     * @param extCorpId
     * @param extStaffId
     * @param extCustomerId
     * @param info
     */
    void save(Integer model, Integer type, String extCorpId, String extStaffId, String extCustomerId, CustomerDynamicInfoDTO info);
}
