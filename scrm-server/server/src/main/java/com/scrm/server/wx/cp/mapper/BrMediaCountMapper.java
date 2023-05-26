package com.scrm.server.wx.cp.mapper;

import com.scrm.server.wx.cp.dto.BrMediaCountSaveDTO;
import com.scrm.server.wx.cp.entity.BrMediaCount;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import java.util.Date;

/**
 * 素材统计表 Mapper接口
 * @author xxh
 * @since 2022-05-15
 */
public interface BrMediaCountMapper extends BaseMapper<BrMediaCount> {

    /**
     * 根据查询条件判断当天是否已生成了数据
     * @param dto
     * @return
     */
    BrMediaCount checkToday(BrMediaCountSaveDTO dto);

    /**
     * 根据日期统计那天的发送次数
     * @param date
     * @return
     */
    Integer sumByDate(@Param("extCorpId") String extCorpId,
                      @Param("date") Date date);

    /**
     * 根据类型统计
     * @param type
     * @param typeId
     * @return
     */
    Integer countSendCount(@Param("type") int type, @Param("typeId") String typeId);
}
