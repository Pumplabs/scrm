import { post, get } from '../request'
import { handlePageParams, handleTable, handleObj } from '../utils'

// 获取任务宝界面
export async function GetMaketFissionList (pager = {}, vals = {}) {
  const params = {
    ...handlePageParams(pager),
    ...vals
  }
  return post('/api/wxFissionTask/pageList', params, { needJson: true }).then(res => handleTable(res))
}

// 创建任务宝
export async function CreateMarketFission (params) {
  return post(`/api/wxFissionTask/save`, params, { needJson: true });
}
// 编辑任务宝
export async function EditMarketFission (params) {
  return post(`/api/wxFissionTask/update`, params, { needJson: true });
}
// 获取任务宝详情
export async function GetMarketFissionDetail (params = {}) {
  return get(`/api/wxFissionTask/${params.id}`).then(res => handleObj(res))
}
// 删除任务宝
export async function RemoveMaketFission (params) {
  return get(`/api/wxFissionTask/delete`, params)
}
// 结束活动
export async function StopMaketFission (params) {
  return get('/api/wxFissionTask/over', params)
}
// 推广活动
export const PromoteActivity = async (params) => {
  return post("/api/wxFissionTask/expand", params, {needJson: true})
}

// 获取参与客户数据列表
export const GetCustomerJoinActivityData = async (pager, vals = {}) => {
  const { lossStatus, ...rest } = vals
  const params = {
    ...handlePageParams(pager),
    hasLose: typeof lossStatus === 'undefined' ?  lossStatus : Boolean(lossStatus),
    ...rest
  }
  return post("/api/wxFissionTask/findCountList", params, { needJson: true }).then(res=> handleTable(res))
}
// 获取客户邀请详情
export const GetCustomerInviteData = async (pager, vals = {}) => {
  const params = {
    ...handlePageParams(pager),
   ...vals
  }
  return post("/api/wxFissionTask/getInviteDetails", params, { needJson: true }).then(res=> handleTable(res))
}
// 获取活动数据统计
export const GetActivityStatistics = async (params) => {
  return post('/api/wxFissionTask/countByCondition', params, {needJson: true}).then(res => handleObj(res))
}
// 兑奖
export const AwardPrice = async (params) => {
  return post('/api/wxFissionTask/price', params, { needJson: true})
}