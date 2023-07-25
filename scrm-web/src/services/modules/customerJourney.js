import { get, post } from '../request'
import { handleTimes } from 'utils/times'
import { handleArray, handleObj, handlePageParams, handleTable, saveFileByRes } from '../utils'

// 新增旅程
export const AddJourney = async (params) => {
  return post('/api/brJourney/save', params, { needJson: true })
}
// 分页获取客户旅程
export const GetJourneyList = async (pager, formVals) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/brJourney/pageList', params, { needJson: true }).then(res => handleTable(res))
}
// 获取旅程全部阶段
export const GetJourneyAllStage = async (params) => {
  return post('/api/brJourneyStage/list', params, { needJson: true }).then(res => handleArray(res))
}
// 编辑旅程
export const EditJourney = async (params) => {
  return post('/api/brJourney/update', params, { needJson: true })
}
// 删除旅程
export const RemoveJourney = async (params) => {
  return post('/api/brJourney/delete', params, { needForm: true })
}
// 旅程客户
export const GetJourneyStageCustomer = async (pager = {}, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/brJourneyStageCustomer/pageList', params, { needJson: true }).then(res => handleTable(res))
}
// 新增旅程客户
export const AddJourneyCustomer = async (params) => {
  return post('/api/brJourneyStageCustomer/batchSave', params, { needJson: true })
}
// 编辑旅程客户
export const EditJourneyCustomer = async (params) => {
  return post('/api/brJourneyStageCustomer/update', params, { needJson: true })
}
// 删除旅程客户
export const RemoveJourneyCustomer = async (params) => {
  return post('/api/brJourneyStageCustomer/delete', params, { needForm: true })
}
// 获取客户旅程列表
export const GetJourneyUserList = async (params) => {
  return post('/api/brJourneyStageCustomer/list', params, { needJson: true }).then(res => handleArray(res))
}
// 获取旅程客户列表
export const GetCustomerListByJoureny = async (pager = {}, formVals = {}) => {
  const { times, ...rest } = formVals
  const [createdAtBegin, createdAtEnd] = handleTimes(times, { searchTime: true })
  const params = {
    ...handlePageParams(pager),
    createdAtBegin,
    createdAtEnd,
    ...rest
  }
  return post("/api/brJourneyStageCustomer/pageCustomerList", params, { needJson: true }).then(res => handleTable(res))
}
// 批量删除旅程客户
export const BatchRemoveCustomers = async (params) => {
  return post("/api/brJourneyStageCustomer/batchDelete", params, { needJson: true })
}
// 移动阶段客户
export const MoveJourenyStageCustomer = async (params) => {
  return post('/api/brJourneyStage/moveAllCustomer', params, { needJson: true })
}
export const UpdateJourneyStage = async (params) => {
  return post('/api/brJourneyStage/update', params, { needJson: true }).then(res => handleObj(res))
}

export const AddJourneyStage = async (params) => {
  return post('/api/brJourneyStage/save', params, { needJson: true }).then(res => handleObj(res))
}



export const UpdateJourneyStageSort = async (params) => {
  return post('/api/brJourney/updateJourneyStageSort', params, { needJson: true }).then(res => handleObj(res))
}


export const RemoveJourneyStage = async (params) => {
  return post('/api/brJourneyStage/delete', params, { needJson: true }).then(res => handleObj(res))
}