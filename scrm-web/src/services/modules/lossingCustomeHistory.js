import { post, get } from '../request'
import { handleTimes } from 'utils/times'
import { handleObj, handlePageParams, handleTable } from '../utils'

// 查询列表
export const GetTableList = (pager, formVals = {}) => {
  const { times, ...rest } = formVals
  const [deleteBeginTime, deleteEndTime] = handleTimes(times, { searchTime: true })
  const params = {
    deleteBeginTime,
    deleteEndTime,
    ...rest,
    ...handlePageParams(pager),
  }
  return post("/api/wxCustomerLossInfo/pageList", params, { needJson: true }).then(res => handleTable(res))
}

// 获取统计信息
export const GetLossingStatisticsData = async (params) => {
  return get('/api/wxCustomerLossInfo/getStatistics', params).then(res => handleObj(res))
}

// 获取已删除客户信息
export const GetLossingCustomerInfo = async (params = {}) => {
  return get(`/api/wxCustomerLossInfo/${params.id}`).then(res => handleObj(res))
}