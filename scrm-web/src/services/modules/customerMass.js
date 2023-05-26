import { get, post } from '../request'
import { handleTimes} from 'utils/times'
import { handlePageParams, handleTable, handleObj, handleArray } from '../utils'

/**
 * 新增客户群发
*/
export const AddCustomerMass = (params) => {
  return post(`/api/wxMsgTemplate/save`, params, { needJson: true })
}
/**
 * 编辑客户群发
*/
export const EditCustomerMass = (params) => {
  return post('/api/wxMsgTemplate/update', params, {needJson: true})
}
/**
 * 查看客户群发详情
*/
export const GetCustomerMassDetail = (params) => {
  return get(`/api/wxMsgTemplate/${params.id}`).then(res => handleObj(res))
}
/**
 * 统计符合条件的客户数量
 */
export const GetCustomerCountByCondition = (params) => {
  return post(`/api/wxMsgTemplate/countCustomer`, params, { needJson: true })
}

// 查询群发列表
export const GetCustomerMassPageList = (pager, formVals = {}) => {
  const { createTime, creatorIds = [], ...rest } = formVals
  const [sendTimeStart, sendTimeEnd] = handleTimes(createTime, {searchTime: true})
 const params = {
   creatorIds,
   sendTimeStart,
   sendTimeEnd,
   ...rest,
   ...handlePageParams(pager),
 }
  return post("/api/wxMsgTemplate/pageList", params, { needJson: true}).then(res => handleTable(res))
}
// 取消群发
export const CancelMass = (params) => {
  return get('/api/wxMsgTemplate/cancel', params)
}
// 提醒群发
export const RemindMass = (params) => {
  return post("/api/wxMsgTemplate/remind", params, {needJson: true})
}
// 导出客户详情
export const ExportCustomerList = (params) => {
  return get("/api/wxMsgTemplate/exportCustomer", params).then(res => handleObj(res))
}
// 导出成员详情
export const ExportStaff = (params) => {
  return get("/api/wxMsgTemplate/exportStaff",  params).then(res => handleObj(res))
}
// 导出群发
export const ExportMass = async(params) => {
  return post('/api/wxGroupChat/export', params, { needJson: true}).then(res => handleObj(res))
}
// 根据状态查询员工
export const QueryStaffByStatus = async (params) => {
  return post('/api/wxMsgTemplate/getStaffByStatus', params, { needJson: true}).then(res => handleArray(res))
}