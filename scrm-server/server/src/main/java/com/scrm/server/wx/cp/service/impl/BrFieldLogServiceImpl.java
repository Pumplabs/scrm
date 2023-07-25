package com.scrm.server.wx.cp.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.scrm.common.exception.BaseException;
import com.scrm.server.wx.cp.dto.BrFieldLogInfoDTO;
import com.scrm.server.wx.cp.utils.ClassBaseUtil;
import com.scrm.common.util.JwtUtil;
import com.scrm.common.util.UUID;
import com.scrm.server.wx.cp.utils.ValueChange;
import com.scrm.server.wx.cp.dto.BrFieldLogPageDTO;
import com.scrm.server.wx.cp.dto.BrFieldLogQueryDTO;
import com.scrm.server.wx.cp.entity.BrFieldLog;
import com.scrm.server.wx.cp.mapper.BrFieldLogMapper;
import com.scrm.server.wx.cp.service.IBrFieldLogService;
import com.scrm.server.wx.cp.service.IStaffService;
import com.scrm.server.wx.cp.vo.BrFieldLogVO;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * 字段变化记录 服务实现类
 *
 * @author ouyang
 * @since 2022-06-17
 */
@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class BrFieldLogServiceImpl extends ServiceImpl<BrFieldLogMapper, BrFieldLog> implements IBrFieldLogService {

    @Autowired
    private IStaffService staffService;

    @Autowired
    private ClassBaseUtil classBaseUtil;

    @Override
    public IPage<BrFieldLogVO> pageList(BrFieldLogPageDTO dto) {
        LambdaQueryWrapper<BrFieldLog> wrapper = new QueryWrapper<BrFieldLog>()
                .lambda().eq(BrFieldLog::getExtCorpId, dto.getExtCorpId())
                .eq(BrFieldLog::getDataId, dto.getDataId())
                .eq(BrFieldLog::getTableName, dto.getTableName())
                .orderByDesc(BrFieldLog::getOperTime);
        IPage<BrFieldLog> page = page(new Page<>(dto.getPageNum(), dto.getPageSize()), wrapper);
        return page.convert(this::translation);
    }


    @Override
    public List<BrFieldLogVO> queryList(BrFieldLogQueryDTO dto) {
        LambdaQueryWrapper<BrFieldLog> wrapper = new QueryWrapper<BrFieldLog>()
                .lambda().eq(BrFieldLog::getExtCorpId, dto.getExtCorpId())
                .eq(BrFieldLog::getDataId, dto.getDataId())
                .eq(BrFieldLog::getTableName, dto.getTableName())
                .orderByDesc(BrFieldLog::getOperTime);
        return Optional.ofNullable(list(wrapper)).orElse(new ArrayList<>()).stream().map(this::translation).collect(Collectors.toList());
    }


    @Override
    public BrFieldLogVO findById(String id) {
        return translation(checkExists(id));
    }


    @Override
    public void save(Object oldObj, Object newObj, String tableName, String dataId, String extCorpId) {
        Map<String, ValueChange> stringValueChangeMap = classBaseUtil.comparatorObject(ClassBaseUtil.UPDATE, oldObj, newObj, tableName, extCorpId);
        stringValueChangeMap.forEach((k, v) -> {
            //封装数据
            BrFieldLog brFieldLog = new BrFieldLog();
            brFieldLog.setId(UUID.get32UUID()).setMethod(BrFieldLog.FIELD_UPDATE)
                    .setTableName(tableName).setOldValue(v.getOldValue())
                    .setNewValue(v.getNewValue())
                    .setOperId(JwtUtil.getExtUserId()).setExtCorpId(extCorpId)
                    .setOperTime(new Date()).setFieldName(k).setDataId(dataId);
            //入库
            save(brFieldLog);
        });

    }

    @Override
    public void save(String tableName, String dataId, Integer method, BrFieldLogInfoDTO info, Date operDate, String operId) {
        //封装数据
        BrFieldLog brFieldLog = new BrFieldLog();
        brFieldLog.setId(UUID.get32UUID()).setMethod(method)
                .setTableName(tableName).setOperId(operId)
                .setExtCorpId(JwtUtil.getExtCorpId())
                .setOperTime(operDate).setInfo(info).setDataId(dataId);
        //入库
        save(brFieldLog);
    }


    /**
     * 翻译
     *
     * @param brFieldLog 实体
     * @return BrFieldLogVO 结果集
     * @author ouyang
     * @date 2022-06-17
     */
    private BrFieldLogVO translation(BrFieldLog brFieldLog) {
        BrFieldLogVO vo = new BrFieldLogVO();
        BeanUtils.copyProperties(brFieldLog, vo);

        vo.setOperator(staffService.find(brFieldLog.getExtCorpId(), brFieldLog.getOperId()));
        return vo;
    }


    @Override
    public BrFieldLog checkExists(String id) {
        if (StringUtils.isBlank(id)) {
            return null;
        }
        BrFieldLog byId = getById(id);
        if (byId == null) {
            throw new BaseException("字段变化记录不存在");
        }
        return byId;
    }

    @Override
    public void deleteByDataIds(String tableName, List<String> dataIds) {
        remove(new LambdaQueryWrapper<BrFieldLog>()
                .eq(BrFieldLog::getTableName, tableName)
                .in(BrFieldLog::getDataId, dataIds));
    }
}
