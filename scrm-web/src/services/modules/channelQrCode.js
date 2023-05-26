import { get, post } from '../request'
import { handleTimes } from 'utils/times'
import { handleArray, handleTable, handlePageParams, saveFileByRes, handleObj } from '../utils'

// 查询分组列表
export const GetGroupList = async (params) => {
  return post('/api/contactWayGroup/list', params, { needForm: true }).then(res => handleArray(res))
}
// 获取渠道码列表
export const GetChannelTable = async (pager, formVals = {}) => {
  const { createTime, ...rest } = formVals
  const [createdAtStart = '', createdAtEnd = ''] = handleTimes(createTime, { searchTime: true })
  const params = {
    createdAtStart,
    createdAtEnd,
    ...handlePageParams(pager),
    ...rest
  }
  return post('/api/contactWay/pageList', params, { needJson: true }).then(res => handleTable(res))
}
// 删除分组
export const RemoveGroup = async (params) => {
  return post('/api/contactWayGroup/delete', params, { needForm: true })
}
// 新增分组
export const AddGroup = async (params) => {
  return post('/api/contactWayGroup/save', { ...params,  }, { needJson: true })
}
// 编辑分组
export const EditGroup = async (params) => {
  return post('/api/contactWayGroup/update', params, { needJson: true })
}
// 新增渠道码
export const AddChannelCode = async (params) => {
  return post("/api/contactWay/save", params, { needJson: true })
}
// 编辑渠道码
export const EditChannelCode = async (params) => {
  return post("/api/contactWay/update", params, { needJson: true })
}
// 获取单个
export const getChannelCodeById = async (params) => {
  return get(`/api/contactWay/${params.id}`).then(res => handleObj(res))
}
// 删除单个渠道码
export const removeChannelCode = async (params) => {
  return post("/api/contactWay/delete", params, { needForm: true })
}
// 批量删除渠道码
export const batchRemoveChannelCode = async (params) => {
  return post("/api/contactWay/batchDelete", params, { needJson: true })
}
// 导出二维码图片
export async function ExportCodeImg (url, name = '渠道码图片') {
  return get('/api/common/downloadFile', {url}, {
    needHandleResponse: true,
    responseType: 'blob'
  }).then(res => saveFileByRes(res, `${name}.png`))
}
// 获取渠道码指标统计
export const GetChannelCodeIndexStatic = async (params) => {
  return post('/api/contactWay/countTotal', params, {
    needJson: true
  }).then(res => handleObj(res))
}
// 渠道活码统计按时间
export const GetChannelCodeStaticsByTime = async (params) => {
  return post('/api/contactWay/countByDate', params, {
    needJson: true
  }).then(res => handleArray(res))
}
// 渠道活码统计按客户
export const GetChannelCodeStaticsByCustomer = async (params) => {
  return post("/api/contactWay/countByCustomer", params, {
    needJson: true
  }).then(res => handleArray(res))
}
// 渠道活码统计按员工
export const GetChannelCodeStaticsByUser = async (params) => {
  return post('/api/contactWay/countByStaff', params, {
    needJson: true
  }).then(res => handleArray(res))
}
export const ExportUser = async (params) => {
  return post('/api/contactWay/getExportUrlByStaff', params, {
    needJson: true,
  }).then(res => handleObj(res))
}

export const ExportDate = async (params) => {
  return get('/api/contactWay/exportUrlByDate',params, {
    needHandleResponse: true,
    responseType: 'blob'
  }).then(res => saveFileByRes(res))
}

export const ExportCustomer = async (params) => {
  return post('/api/contactWay/getExportUrlByCustomer', params, {
    needJson: true,
  }).then(res => handleObj(res))
}