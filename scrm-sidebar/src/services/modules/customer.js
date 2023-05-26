import { get, post } from '../request'
import { handleObj, handlePageParams, handleTable } from '../utils'

// 获取客户信息
export const GetCustomerInfo = async (params) => {
  return get(`/api/wxCustomer/getByIdAndStaffId`, params).then(res => handleObj(res))
}

// 编辑客户信息
export const EditCustomerInfo = async (params) => {
  return post("/api/wxCustomer/updateCustomerInfo", params, {needJson: true})
}
// 编辑客户标签
export const EditCustomerTag = async (params) => {
  return post('/api/wxCustomer/editTag', params, {needJson: true})
}

// 客户下拉列表
export const GetCustomerDropdownList = async(pager = {}, formVals = {})  => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/wxCustomer/dropDownPageList', params, { needJson: true }).then(res => handleTable(res))
}

// 客户普通列表
export const GetCustomerList = async (pager = {}, formVals = {}) => {
  const params = {
    createdAtBegin: '',
    createdAtEnd: '',
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/wxCustomer/pageList', params, { needJson: true }).then(res => handleTable(res))
}

// 客户动态
export const GetCustomerMoment = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/brCustomerDynamic/pageList', params, { needJson: true }).then(res => handleTable(res))
}

// 获取客户统计信息
export const GetCustomerStatics = async(params) => {
  return get('/api/wxCustomer/getTodayStatisticsInfo', params).then(res => handleObj(res))
}

// 分页获取客户标签
export const GetCustomerTags = async (pager) => {
  const reqParams = {
    ...handlePageParams(pager),
  }
  return post(`/api/wxTagGroup/pageList`, reqParams, { needJson: true }).then(res => handleTable(res));
}

// 删除协作人
export const RemovePartner = async (params) => {
  return post('/api/brCustomerDynamic/pageList', params, { needJson: true }).then(res => handleTable(res))
}

// 获取有协作人的客户列表
export const GetAssistCustomers = async (pager = {}, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/wxCustomer/pageAssistList', params, { needJson: true }).then(res => handleTable(res))
}
  // 编辑旅程客户
export const EditJourneyCustomer = async (params) => {
  return post('/api/brJourneyStageCustomer/update', params, {needJson: true })
}
// 删除阶段客户
export const RemoveJourneyCustomer = async (params) => {
  return get('/api/brJourneyStageCustomer/deleteByCustomerExtIdAndStageId', params, {needForm: true})
}