package com.scrm.server.wx.cp.utils;

import com.scrm.common.util.DateUtils;
import com.scrm.server.wx.cp.entity.BrFieldLog;
import com.scrm.server.wx.cp.service.IBrCommonConfService;
import io.swagger.annotations.ApiModelProperty;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 比较新老对象的差别
 */
@Slf4j
@Component
public class ClassBaseUtil {

    public final static String ADD = "ADD";

    public final static String UPDATE = "UPDATE";

    public final static String DELETE = "删除";

    public final static List<String> fieldNameList = Arrays.asList("name", "stageId", "expectMoney", "expectDealDate", "priority", "desp");

    public final static Map<Integer, String> priorityMap = new HashMap() {{
        put(1, "高");
        put(2, "中");
        put(3, "低");
    }};

    public final static Map<Integer, String> sexMap = new HashMap() {{
        put(0, "未知");
        put(1, "男性");
        put(2, "女性");
    }};

    @Autowired
    private IBrCommonConfService commonConfService;

    private static ClassBaseUtil classBaseUtil;

    @PostConstruct
    public void init() {
        classBaseUtil = this;
    }

    /**
     * 比较新老对象的差别
     *
     * @param unityOperate 类型
     * @param oldObj       旧对象
     * @param newObj       新对象
     * @return matter 哪个字段有更新 content 内容更新成什么
     */
    public Map<String, ValueChange> comparatorObject(String unityOperate, Object oldObj, Object newObj, String tableName, String extCorpId) {
        Map<String, ValueChange> map = new HashMap();
        if (oldObj != null && UPDATE.equals(unityOperate)) {
            Map<String, Object> oldMap;
            try {
                oldMap = changeValueToMap(oldObj);

                Map<String, Object> newMap = changeValueToMap(newObj);
                if (oldMap != null && !oldMap.isEmpty()) {
                    for (Map.Entry<String, Object> entry : oldMap.entrySet()) {
                        Object oldValue = entry.getValue();
                        Object newValue = newMap.get(entry.getKey());
                        if (oldValue == null && newValue == null) {
                            continue;
                        }
                        if (newValue == null) {
                            newValue = "";
                        }
                        if (oldValue == null) {
                            oldValue = "";
                        }
                        if (!oldValue.equals(newValue)) {
                            //商机的特殊处理
                            if (BrFieldLog.OPPORTUNITY_TABLE_NAME.equals(tableName)){
                                if ("预计成交日期".equals(entry.getKey())) {
                                    oldValue = StringUtils.isBlank(oldValue.toString())? "" : DateUtils.dateToSimpleStr((Date) oldValue);
                                    newValue = StringUtils.isBlank(newValue.toString()) ? "" : DateUtils.dateToSimpleStr((Date) newValue);
                                }
                                if ("优先级".equals(entry.getKey())) {
                                    oldValue = StringUtils.isBlank(oldValue.toString()) ? "" : priorityMap.get(oldValue);
                                    newValue = StringUtils.isBlank(newValue.toString()) ? "" : priorityMap.get(newValue);
                                }
                                if ("阶段".equals(entry.getKey())) {
                                    oldValue = StringUtils.isBlank(oldValue.toString()) ? "" : classBaseUtil.commonConfService.findById(oldValue.toString()).getName();
                                    newValue = StringUtils.isBlank(newValue.toString()) ? "" : classBaseUtil.commonConfService.findById(newValue.toString()).getName();
                                }
                            }
                            ValueChange valueChange = new ValueChange(oldValue.toString(), newValue.toString());
                            map.put(entry.getKey(), valueChange);
                        }
                    }
                }
            } catch (IllegalAccessException e) {
                log.error("转换map出现异常", e);
            }
        } else if (ADD.equals(unityOperate)) {

        }
        return map;
    }

    /**
     * 将类对象转换成Map
     *
     * @param entity 原对象
     * @return
     * @throws IllegalAccessException 类型转换时报错
     */
    private Map changeValueToMap(Object entity) throws IllegalAccessException {
        Map resultMap = new HashMap<>();
        List<Field> fields = Arrays.asList(entity.getClass().getDeclaredFields());
        if ("BrOpportunity".equals(entity.getClass().getSimpleName())) {
            fields = fields.stream().filter(e -> fieldNameList.contains(e.getName())).collect(Collectors.toList());
        }

        for (Field field : fields) {
            field.setAccessible(true);
            resultMap.put(field.getAnnotation(ApiModelProperty.class).value(), field.get(entity));
        }
        return resultMap;
    }

}

