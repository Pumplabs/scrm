import { post, get } from '../request'
import { handlePageParams, handleTable, handleObj } from '../utils'

// 新增客户群群发
export const AddMass = async (params) => {
  return post('/api/wxMsgGroupTemplate/savePerson', params, { needJson: true })
}

// 获取群发列表
export const GetMassList = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals,
  }
  return post('/api/wxMsgGroupTemplate/pageList', params, {
    needJson: true,
  }).then((res) => handleTable(res))
}

// 查询群发详情
export const GetMassDetail = async (params = {}) => {
  return get(`/api/wxMsgGroupTemplate/findById`, params).then((res) =>
    handleObj(res)
  )
}

export const GetOwnerSendList = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals,
  }
  return post('/api/wxMsgGroupTemplate/getStaffDetails', params, {
    needJson: true,
  }).then((res) => handleTable(res))
}

export const GetGroupReceiveList = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals,
  }
  return post('/api/wxMsgGroupTemplate/getChatDetails', params, {
    needJson: true,
  }).then((res) => handleTable(res))
}