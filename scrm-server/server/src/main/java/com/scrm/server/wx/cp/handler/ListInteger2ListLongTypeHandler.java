package com.scrm.server.wx.cp.handler;

import com.alibaba.fastjson.JSON;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;
import org.springframework.util.StringUtils;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 *  处理List<Long>类型
 */
@MappedJdbcTypes(JdbcType.VARCHAR) // 数据库中该字段存储的类型
@MappedTypes(List.class) // 需要转换的对象
public class ListInteger2ListLongTypeHandler extends BaseTypeHandler<List<Long>> {
    private static ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, List<Long> parameter, JdbcType jdbcType) throws SQLException {
        ps.setObject(i, JSON.toJSONString(parameter));
    }

    @Override
    public List<Long> getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return getLongs(rs.getString(columnName));
    }

    @Override
    public List<Long> getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return getLongs(rs.getString(columnIndex));
    }

    @Override
    public List<Long> getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return getLongs(cs.getString(columnIndex));
    }

    private List<Long> getLongs(String value) {
        if (StringUtils.hasText(value)) {
            try {
                CollectionType type = objectMapper.getTypeFactory().constructCollectionType(ArrayList.class, Long.class);
                return objectMapper.readValue(value, type);
                //List<Long> longs = JsonUtil.parseArray(value, Long.class);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }
        return null;
    }
}
