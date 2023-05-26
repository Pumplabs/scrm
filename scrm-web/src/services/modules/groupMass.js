

import { get, post } from '../request'
import { handleTimes} from 'utils/times'
import { handlePageParams, handleTable, handleObj } from '../utils'

/**
 * 新增客户群发
*/
export const AddGroupMass = (params) => {
  return post(`/api/wxMsgGroupTemplate/save`, params, { needJson: true })
}
// 编辑客户群发
export const EditGroupMass = (params) => {
  return post('/api/wxMsgGroupTemplate/update', params, { needJson: true })
}
// 查询群发列表
export const GetGroupMassPageList = (pager, formVals = {}) => {
  const { createTime, creatorIds = [], ...rest } = formVals
  const [sendTimeStart, sendTimeEnd] = handleTimes(createTime, {searchTime: true})
 const params = {
   creatorIds,
   sendTimeStart,
   sendTimeEnd,
   ...rest,
   ...handlePageParams(pager),
 }
  return post("/api/wxMsgGroupTemplate/pageList", params, { needJson: true}).then(res => handleTable(res))
}
// 获取群发详情
export const GetGroupMassDetail = (params) => {
  return get('/api/wxMsgGroupTemplate/findById', params).then(res => handleObj(res))
}
// 提醒
export const RemindUser = (params = {}) => {
  return post("/api/wxMsgGroupTemplate/remind", params, {needJson: true})
}
// 取消发送
export const CancelGroupMass = (params = {}) => {
  return get('/api/wxMsgGroupTemplate/cancel', params)
}
// 群主列表
export const GetGroupOwnerList = (pager, formVals = {})=> {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/wxMsgGroupTemplate/pageChatOwnerList', params, {needJson: true}).then(res => handleTable(res))
}
// 客户群接受详情列表查询
export const GetChatDetail = (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post("/api/wxMsgGroupTemplate/getChatDetails", params, {needJson: true}).then(res => handleTable(res))
}
// 群主发送详情列表
export const GetOwnerDetail = (pager, formVals) => {
  const { hasSend = '', ...rest } = formVals
  const params = {
    ...handlePageParams(pager),
    hasSend: hasSend === '' ? '': Boolean(hasSend),
    ...rest
  }
  return post("/api/wxMsgGroupTemplate/getStaffDetails", params, {needJson: true}).then(res => handleTable(res))
}
// 导出群发
export const ExportMass = async(formVals = {}) => {
  const { createTime, creatorIds = [], ...rest } = formVals
  const [sendTimeStart, sendTimeEnd] = handleTimes(createTime, {searchTime: true})
  const params = {
    creatorIds,
    sendTimeStart,
    sendTimeEnd,
    ...rest,
  }
  return post('/api/wxGroupChat/export', params, { needJson: true}).then(res => handleObj(res))
}
// 导出客户群发送详情
export const ExportChatDetail = async (params) => {
  return get('/api/wxMsgGroupTemplate/exportChatDetails', params).then(res => handleObj(res))
}
// 导出群主发送详情
export const ExportChatOwnerDetail = async (params) => {
  return get('/api/wxMsgGroupTemplate/exportStaffDetails', params).then(res => handleObj(res))
}