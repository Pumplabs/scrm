import { get, post } from '../request'
import { handleTimes } from 'utils/times'
import { handleArray, handleTable, handlePageParams, saveFileByRes, handleObj } from '../utils'

// 查询群活码列表
/**
 * 
 * @param {Object}  {name:"code name",roomBaseName:""}
 * @returns 
 */
export const GetGroupQRCodeList = async (pager = {}, formVals = {}) => {
  const params = {
    ...formVals,
    ...handlePageParams(pager),
  }
  return post('/api/wxJoinWay/pageList', params, { needJson: true }).then(res => handleTable(res))
}

// 新增渠道码
export const AddGroupQRCode = async (params) => {
  return post("/api/wxJoinWay/save", params, { needJson: true })
}

// 编辑渠道码
export const EditGroupQRCode = async (params) => {
  return post("/api/wxJoinWay/update", params, { needJson: true })
}
// 获取单个
export const getGroupQRCodeById = async (params) => {
  return get(`/api/wxJoinWay/${params.id}`).then(res => handleObj(res))
}
// 删除单个渠道码
export const RemoveGroupQRCode = async (params) => {
  return post("/api/wxJoinWay/delete", params, { needForm: true })
}


// 批量删除渠道码
export const BatchRemoveGroupQRCode = async (params) => {
  return post("/api/wxJoinWay/batchDelete", params, { needJson: true })
}
// 导出二维码图片
export async function ExportCodeImg(url, name = '渠道码图片') {
  return get('/api/common/downloadFile', { url }, {
    needHandleResponse: true,
    responseType: 'blob'
  }).then(res => saveFileByRes(res, `${name}.png`))
}
// 获取渠道码指标统计
export const GetChannelCodeIndexStatic = async (params) => {
  return post('/api/wxJoinWay/countTotal', params, {
    needJson: true
  }).then(res => handleObj(res))
}


// 渠道活码统计按时间
export const GetGroupQRCodeStaticsByTime = async (params) => {
  return post('/api/wxJoinWay/countByDate', params, {
    needJson: true
  }).then(res => handleArray(res))
}


// 渠道活码统计按客户
export const GetChannelCodeStaticsByCustomer = async (params) => {
  return post("/api/wxJoinWay/countByCustomer", params, {
    needJson: true
  }).then(res => handleArray(res))
}
// 渠道活码统计按员工
export const GetChannelCodeStaticsByUser = async (params) => {
  return post('/api/wxJoinWay/countByStaff', params, {
    needJson: true
  }).then(res => handleArray(res))
}
export const ExportUser = async (params) => {
  return post('/api/wxJoinWay/getExportUrlByStaff', params, {
    needJson: true,
  }).then(res => handleObj(res))
}

export const ExportDate = async (params) => {
  return get('/api/wxJoinWay/exportUrlByDate', params, {
    needHandleResponse: true,
    responseType: 'blob'
  }).then(res => saveFileByRes(res))
}

export const ExportCustomer = async (params) => {
  return post('/api/wxJoinWay/getExportUrlByCustomer', params,  {
    needHandleResponse: true,
    responseType: 'blob',
    needJson: true,
  }).then(res => saveFileByRes(res))
}

