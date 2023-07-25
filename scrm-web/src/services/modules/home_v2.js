import { get, post } from '../request'
import { handleArray, handleObj } from '../utils'

// 获取素材今日统计
export const GetTodayMaterialStatics = async () => {
  return get('/api/brMediaCount/getTodayCount').then(res => handleObj(res))
}

// 获取素材top排行榜
export const GetMaterialTopsStatics = async (params) => {
  return post('/api/brMediaCount/sortCount', params, { needJson: true }).then(res => handleArray(res))
}

// 获取客户统计信息
export const GetCustomerStatics = async (params) => {
  return get('/api/wxCustomer/getStatisticsInfo', params).then(res => handleObj(res))
}

// 获取员工拉新信息
export const GetUserPullNewStatics = async (params) => {
  return get('/api/wxCustomer/getPullNewStatisticsInfo', params).then(res => handleObj(res))
}

// 获取群统计信息
export const GetGroupStatics = async (params) => {
  return get('/api/wxGroupChat/getStatics', params).then(res => handleObj(res))
}
// 获取阶段信息
export const GetJourneyStatics = async () => {
  return get('/api/brJourney/getStatistics').then(res => handleArray(res))
}

export const getOverviewStatics = async () => {
  return get('/api/reports/getTodayDataOverview').then(res => handleObj(res))
}

export const getLastStaticsDataByDays = async (params) => {
  return get('/api/reports/getLastStaticsDataByDays', params).then(res => handleObj(res))
}


export const getStaffTotalFollowUpStatisticsTop5 = async () => {
  return get('/api/reports/getStaffTotalFollowUpStatisticsTop5').then(res => handleObj(res))
}

export const getStaffOrderTotalAmountStatisticsTop5 = async () => {
  return get('/api/reports/getStaffOrderTotalAmountStatisticsTop5').then(res => handleObj(res))
}


export const getCustomerLastNDaysCountDaily = async () => {
  return get('/api/wxCustomer/getLastNDaysCountDaily?days=30').then(res => handleArray(res))
}

export const getOpportunityLastNDaysCountDaily = async () => {
  return get('/api/brOpportunity/getLastNDaysCountDaily?days=30').then(res => handleArray(res))
}

export const getOrderLastNDaysCountDaily = async () => {
  return get('/api/BrOrder/getLastNDaysCountDaily?days=30').then(res => handleArray(res))
}