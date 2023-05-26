package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.dto.BrMediaSayPageDTO;
import com.scrm.server.wx.cp.dto.BrMediaSaySaveDTO;
import com.scrm.server.wx.cp.dto.BrMediaSayUpdateDTO;
import com.scrm.server.wx.cp.entity.BrMediaSay;
import com.scrm.server.wx.cp.vo.BrMediaSayVO;

/**
 * （素材库）企业话术 服务类
 * @author xxh
 * @since 2022-05-10
 */
public interface IBrMediaSayService extends IService<BrMediaSay> {


    /**
     * 分页查询
     * @author xxh
     * @date 2022-05-10
     * @param dto 请求参数
     */
    IPage<BrMediaSayVO> pageList(BrMediaSayPageDTO dto);

    /**
     * 根据id查询
     * @author xxh
     * @date 2022-05-10
     * @param id 主键
     */
    BrMediaSayVO findById(String id);


    /**
     * 新增
     * @author xxh
     * @date 2022-05-10
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrMediaSay
     */
    BrMediaSay save(BrMediaSaySaveDTO dto);

     /**
      * 修改
      * @author xxh
      * @date 2022-05-10
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.BrMediaSay
      */
    BrMediaSay update(BrMediaSayUpdateDTO dto);

    /**
     * 批量删除
     * @author xxh
     * @date 2022-05-10
     * @param dto 请求参数
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-05-10
     * @param id （素材库）企业话术id
     * @return com.scrm.server.wx.cp.entity.BrMediaSay
     */
    BrMediaSay checkExists(String id);

    /**
     * 添加发送次数
     * @param extCorpId
     * @param sayId
     * @param count
     */
    void addSendCount(String extCorpId, String sayId, Integer count);
}
