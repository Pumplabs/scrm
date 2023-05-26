import { post, get } from '../request'
import { handleTimes } from 'utils/times'
import { handleTable, handlePageParams, handleArray, handleObj } from '../utils'

// 获取分组列表
export const GetGroupList = async (params) => {
  return post('/api/brOpportunityGroup/list', params, { needJson: true }).then(res => handleArray(res))
}

// 新增分组
export const AddGroup = async (params) => {
  return post('/api/brOpportunityGroup/save', params, { needJson: true })
}

// 编辑分组
export const EditGroup = async (params) => {
  return post('/api/brOpportunityGroup/update', params, { needJson: true })
}

// 删除分组
export const RemoveGroup = async (params) => {
  return post('/api/brOpportunityGroup/delete', params, { needJson: true })
}
// 商机列表
export const GetOpportunityList = async (pager, formVals = {}) => {
  const { createTime,...rest } = formVals
  const [createdAtStart = '', createdAtEnd = ''] = handleTimes(createTime, { searchTime: true })
  const params = {
    createdAtStart,
    createdAtEnd,
    status: '',
    ...handlePageParams(pager),
    ...rest
  }
  return post('/api/brOpportunity/pageList', params, { needJson: true }).then(res => handleTable(res))
}
// 新增商机
export const AddOpportunity = async (params) => {
  return post('/api/brOpportunity/save', params, {needJson: true})
}
// 编辑商机
export const EditOpportunity = async (params) => {
  return post('/api/brOpportunity/update', params, {needJson: true})
}
// 删除商机
export const RemoveOpportunity = async (params) => {
  return post('/api/brOpportunity/delete', params, {needJson: true})
}
// 批量删除商机
export const BatchRemoveOpportunity = async (params) => {
  return post('/api/brOpportunity/batchDelete', params, {needJson: true})
}

// 添加跟进
export const AddFollow = async (params) => {
  return post('/api/brCustomerFollow/save', params, {needJson: true})
}

export const GetConfigPageList = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/brCommonConf/pageList', params, {needJson: true}).then(res => handleTable(res))
}

// 分页获取分组列表
export const GetGroupPageList = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/brOpportunityGroup/pageList', params, {needJson: true}).then(res => handleTable(res))
}

// 商机动态
export const GetOppMoment = async (pager, formVals = {}) => {
  const { createTime, ...rest } = formVals
  const params = {
    ...rest,
    ...handlePageParams(pager),
  }
  return post('/api/brOpportunity/logList', params, {needJson: true}).then(res => handleTable(res))
}

// 获取商机详情
export const GetOppDetail = async (params) => {
  return get(`/api/brOpportunity/${params.id}`).then(res => handleObj(res))
}

// 完成商机任务
export const DoneOppTask = async (params) => {
  return get('/api/brCustomerFollow/finishTask', params)
}

// 删除回复
export const RemoveReply = async (params) => {
  return post('/api/brCustomerFollow/deleteReply', params, {
    needForm: true
  })
}
// 阅读跟进
export const ReadFollow = async (params) => {
  return get('/api/brCustomerFollow/readMsgByFollow', params)
}

// 新增跟进回复
export const AddFollowReply = async (params) => {
  return post('/api/brCustomerFollow/saveReply', params, {
    needJson: true
  })
}