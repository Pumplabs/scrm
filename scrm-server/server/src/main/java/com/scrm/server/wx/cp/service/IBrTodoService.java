package com.scrm.server.wx.cp.service;

import com.scrm.common.dto.BatchDTO;
import com.scrm.server.wx.cp.entity.BrTodo;
import com.baomidou.mybatisplus.extension.service.IService;

import com.scrm.server.wx.cp.dto.BrTodoPageDTO;
import com.scrm.server.wx.cp.dto.BrTodoSaveDTO;
import com.scrm.server.wx.cp.dto.BrTodoUpdateDTO;

import com.scrm.server.wx.cp.dto.BrTodoQueryDTO;
import com.scrm.server.wx.cp.vo.BrTodoVO;

import com.baomidou.mybatisplus.core.metadata.IPage;
import java.util.List;

/**
 * 待办 服务类
 * @author ouyang
 * @since 2022-05-20
 */
public interface IBrTodoService extends IService<BrTodo> {


    /**
     * 分页查询
     * @author ouyang
     * @date 2022-05-20
     * @param dto 请求参数
     */
    IPage<BrTodoVO> pageList(BrTodoPageDTO dto);

    /**
     * 查询列表
     * @author ouyang
     * @date 2022-05-20
     * @param dto 请求参数
     */
    List<BrTodoVO> queryList(BrTodoQueryDTO dto);

    /**
     * 根据id查询
     * @author ouyang
     * @date 2022-05-20
     * @param id 主键
     */
    BrTodoVO findById(String id);


    /**
     * 新增
     * @author ouyang
     * @date 2022-05-20
     * @param dto 请求参数
     * @return com.scrm.server.wx.cp.entity.BrTodo
     */
    BrTodo save(BrTodoSaveDTO dto);

     /**
      * 修改
      * @author ouyang
      * @date 2022-05-20
      * @param dto 请求参数
      * @return com.scrm.server.wx.cp.entity.BrTodo
      */
    BrTodo update(BrTodoUpdateDTO dto);


    /**
     * 删除
     * @author ouyang
     * @date 2022-05-20
     * @param id 待办id
     */
    void delete(String id);

    /**
     * 批量删除
     * @author ouyang
     * @date 2022-05-20
     * @param dto 请求参数
     */
    void batchDelete(BatchDTO<String> dto);

    /**
     * 校验是否存在
     * @author ouyang
     * @date 2022-05-20
     * @param id 待办id
     * @return com.scrm.server.wx.cp.entity.BrTodo
     */
    BrTodo checkExists(String id);

    /**
     * 条件查询
     * @author ouyang
     * @date 2022-05-20
     * @param dto 查询条件
     */
    BrTodo getOne(BrTodoQueryDTO dto);

}
