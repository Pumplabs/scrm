package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.server.wx.cp.dto.BrMediaCountQueryDTO;
import com.scrm.server.wx.cp.dto.BrMediaCountSaveDTO;
import com.scrm.server.wx.cp.entity.BrMediaCount;
import com.scrm.server.wx.cp.vo.BrMediaCountVO;
import com.scrm.server.wx.cp.vo.BrMediaTodayCountVO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 素材统计表 服务类
 * @author xxh
 * @since 2022-05-15
 */
public interface IBrMediaCountService extends IService<BrMediaCount> {

    /**
     * 查询列表
     * @author xxh
     * @date 2022-05-15
     * @param dto 请求参数
     */
    List<BrMediaCountVO> sortCount(BrMediaCountQueryDTO dto);

    /**
     * 新增
     * @author xxh
     * @date 2022-05-15
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrMediaCount
     */
    void addSendCount(BrMediaCountSaveDTO dto);

    /**
     * 校验是否存在
     * @author xxh
     * @date 2022-05-15
     * @param id 素材统计表id
     * @return com.scrm.server.wx.cp.entity.BrMediaCount
     */
    BrMediaCount checkExists(String id);

    /**
     * 获取今天的统计
     * @return
     */
    BrMediaTodayCountVO getTodayCount();

    /**
     * 获取素材或者话术的统计
     * @param type
     * @param typeId
     * @return
     */
    Integer countSendCount(@Param("type") int type, @Param("typeId") String typeId);
}
