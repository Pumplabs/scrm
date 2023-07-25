package com.scrm.server.wx.cp.mapper;

import com.scrm.server.wx.cp.entity.BrCommonConf;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

/**
 * 通用配置 Mapper接口
 *
 * @author ouyang
 * @since 2022-06-07
 */
public interface BrCommonConfMapper extends BaseMapper<BrCommonConf> {
    Integer getMaxSort(@Param("extCorpId") String extCorpId, @Param("groupId") String groupId, @Param("typeCode") String typeCode);

    Integer getMaxCode(@Param("extCorpId") String extCorpId, @Param("groupId") String groupId, @Param("typeCode") String typeCode);

}
