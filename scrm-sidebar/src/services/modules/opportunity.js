import { post, get } from '../request'
import { handlePageParams, handleTable, handleObj, handleArray } from '../utils'

// 商机列表
export const GetOpportunityList = async (pager, formVals = {}) => {
  const params = {
    ...formVals,
    ...handlePageParams(pager),
  }
  return post('/api/brOpportunity/pageList', params, { needJson: true }).then(res => handleTable(res))
}

// 获取商机详情
export const GetOppDetail = async (params) => {
  return get(`/api/brOpportunity/${params.id}`).then(res => handleObj(res))
}
// 获取商机分组阶段
export const GetOppStageByGroupId = async (params) => {
  return post('/api/brCommonConf/list', params, {needJson: true}).then(res => handleArray(res))
}
// 修改商机阶段
export const ChangeOppStage = async (params) => {
  return post('/api/brOpportunity/updateStage',params, {needJson: true})
}
// 修改商机
export const EditOpp = async (params) => {
  return post('/api/brOpportunity/update', params, {needJson: true})
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

// 获取分组列表
export const GetGroupList = async (params) => {
  return post('/api/brOpportunityGroup/list', params, { needJson: true }).then(res => handleArray(res))
}

export const GetConfigAllList = async (params) => {
  return post('/api/brCommonConf/list', params, {needJson: true}).then(res => handleArray(res))
}
// 新增商机
export const AddOpportunity = async (params) => {
  return post('/api/brOpportunity/save', params, {needJson: true})
}