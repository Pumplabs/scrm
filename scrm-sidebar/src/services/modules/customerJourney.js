import { post } from '../request'
import { handleArray, handlePageParams, handleTable } from '../utils'

// 分页获取客户旅程
export const GetJourneyList = async (pager, formVals) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/brJourney/pageList', params, {needJson: true}).then(res => handleTable(res))
}

// 获取旅程全部阶段
export const GetJourneyAllStage = async (params) => {
  return post('/api/brJourneyStage/list', params, {needJson: true}).then(res => handleArray(res))
}
// 新增客户阶段
export const AddStageCustomer = async (params) => {
  return post('/api/brJourneyStageCustomer/save', params, {needJson:true})
}