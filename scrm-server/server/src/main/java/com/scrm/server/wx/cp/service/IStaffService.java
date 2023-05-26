package com.scrm.server.wx.cp.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.scrm.api.wx.cp.dto.*;
import com.scrm.api.wx.cp.entity.Staff;
import com.scrm.api.wx.cp.vo.SimpleStaffVO;
import com.scrm.api.wx.cp.vo.StaffVO;
import com.scrm.common.dto.BatchDTO;
import me.chanjar.weixin.common.error.WxErrorException;
import me.chanjar.weixin.cp.bean.WxCpUser;

import java.util.List;


/**
 * 服务类
 *
 * @author xxh
 * @since 2021-12-16
 */
public interface IStaffService extends IService<Staff> {


    /**
     * 分页查询
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2021-12-16
     */
    IPage<StaffVO> pageList(StaffPageDTO dto);

    /**
     * 根据id查询
     *
     * @param id 主键
     * @author xxh
     * @date 2021-12-16
     */
    StaffVO findById(String id);

    /**
     * 根据id查询（会查出被删除的数据）
     *
     * @param id 主键
     * @author xxh
     * @date 2021-12-16
     */
    Staff find(String id);

    /**
     * 根据id查询（会查出被删除的数据）
     *
     * @param extId     企业员工id
     * @param extCorpId 企业外部id
     * @author xxh
     * @date 2021-12-16
     */
    Staff find(String extCorpId, String extId);


    /**
     * 新增
     *
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.Staff
     * @author xxh
     * @date 2021-12-16
     */
    Staff save(StaffSaveDTO dto) throws WxErrorException;

    /**
     * 修改
     *
     * @param dto 请求参数
     * @return com.scrm.api.wx.cp.entity.Staff
     * @author xxh
     * @date 2021-12-16
     */
    Staff update(StaffUpdateDTO dto) throws WxErrorException;


    /**
     * 批量删除
     *
     * @param dto 请求参数
     * @author xxh
     * @date 2021-12-16
     */
    void batchDelete(BatchDTO<String> dto) throws WxErrorException;

    /**
     * 批量删除
     *
     * @param dto 请求参数
     * @param needDelete 是否调用企微接口删除
     * @author xxh
     * @date 2021-12-16
     */
    void batchDelete(BatchDTO<String> dto,boolean needDelete) throws WxErrorException;



    /**
     * 校验是否存在
     *
     * @param id id
     * @return com.scrm.api.wx.cp.entity.Staff
     * @author xxh
     * @date 2021-12-16
     */
    Staff checkExists(String id);


    /**
     * 校验是否存在
     *
     * @param extId     企业员工id
     * @param extCorpId 企业外部id
     * @return com.scrm.api.wx.cp.entity.Staff
     * @author xxh
     * @date 2021-12-16
     */
    Staff checkExists(String extId, String extCorpId);

    /**
     * 同步企业员工数据
     *
     * @param extCorpId 企业外部id
     * @return 是否同步成功
     */
    Boolean sync(String extCorpId);

    /**
     * 导出
     *
     * @param dto 请求参数
     */
    void exportList(StaffExportDTO dto);

    /**
     * 翻译
     *
     * @param staff 实体
     * @return StaffVO 结果集
     * @author xxh
     * @date 2021-12-16
     */
    StaffVO translation(Staff staff);

    /**
     * 获取简单的员工信息
     *
     * @param corpId 必填
     * @param id     二选一
     * @param extId  二选一
     * @return
     */
    SimpleStaffVO getSimpleInfo(String corpId, String id, String extId);

    /**
     * 根据extId查询员工信息
     *
     * @param corpId
     * @param extIds
     * @return
     */
    List<Staff> listByExtIds(String corpId, List<String> extIds);

    /**
     * 选择员工时同时选择员工和所在部门
     *
     * @param departmentIds
     * @param staffIds
     * @return
     */
    List<String> getStaffIdsByDepts(String corpId, List<Long> departmentIds, List<String> staffIds);

    /**
     * 获取登录token
     *
     * @param staff
     * @param hasWeb
     * @return
     */
    String change2Token(Staff staff, boolean hasWeb);

    /**
     * 根据extId查询
     *
     * @param extId     企业员工id
     * @param extCorpId 企业外部id
     * @author xxh
     * @date 2021-12-16
     */
    Staff findByExtId(String extCorpId, String extId);


    /**
     * 新增/修改
     * @param user
     * @param extCorpId
     * @author xxh
     */
    Staff saveOrUpdateUser(WxCpUser user, String extCorpId);

    /**
     * 根据名字模糊查询员工id(extId)
     */
    List<String> contactSearch(String corpId, String staffName);



    /**
     * 更新企业的管理员
     */
    void updateAdmin(String extCorpId);

    /**
     * 获取当前用户的权限
     * @return
     */
    boolean isAdmin();

    /**
     * 根据企业删除员工
     * @param extCorpId
     */
    void deleteByCorpId(String extCorpId);

    List<String> getAllExtId(String extCorpId);
}
