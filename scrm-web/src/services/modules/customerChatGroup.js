import moment from 'moment'
import { get, post } from '../request'
import { handleTimes } from 'utils/times'
import {
  handlePageParams,
  handleTable,
  saveFileByRes,
  handleObj,
  handleArray,
} from '../utils'

/**
 * 获取群聊列表
 */
export const GetGroupList = async (pager = {}, formVals = {}) => {
  const { tags = [], ...rest } = formVals
  let params = {
    ...handlePageParams(pager),
    ...rest,
  }
  if (Array.isArray(tags) && tags.length) {
    params.tagIds = tags.map((ele) => ele.id)
  }
  return post('/api/wxGroupChat/pageList', params, { needJson: true }).then(
    (res) => handleTable(res)
  )
}
/**
 * 同步群聊
 */
export const AsyncGroupList = async (params) => {
  return get('/api/wxGroupChat/sync',params)
}
/**
 * 获取群聊详情
 */
export const GetGroupById = async (params) => {
  return get(`/api/wxGroupChat/${params.id}`).then((res) => handleObj(res))
}
/**
 * 群聊统计
 */
export const GetGroupStatics = async (pager, formVals = {}) => {
  const { times, ...rest } = formVals
  const [beginTime = '', endTime = ''] = handleTimes(times, {
    searchTime: true,
  })
  const params = {
    ...handlePageParams(pager),
    beginTime,
    endTime,
    ...rest,
  }
  return post(`/api/wxGroupChat/getStaticsInfo`, params, {
    needJson: true,
  }).then((res) => handleTable(res))
}
// 导出群聊
export const ExportGroupChat = async (params = {}) => {
  return post('/api/wxGroupChat/export', params, {
    needJson: true,
  }).then((res) => handleObj(res))
}
// 获取群聊成员
export const GetChatGroupMember = async (pager, formVals = {}) => {
  const { times, ...rest } = formVals
  const [joinTimeBegin, joinTimeEnd] = handleTimes(times)
  const params = {
    joinTimeBegin,
    joinTimeEnd,
    ...handlePageParams(pager),
    ...rest,
  }
  return post('/api/wxGroupChatMember/pageList', params, {
    needJson: true,
  }).then((res) => handleTable(res))
}

// 导出群聊成员
export const ExportGroupMember = async (formVals) => {
  const { times, ...rest } = formVals
  const [joinTimeBegin, joinTimeEnd] = handleTimes(times, { searchTime: true })
  const startTime = joinTimeBegin
    ? moment(joinTimeBegin, 'YYYY-MM-DD HH:mm:ss').valueOf() / 1000
    : ''
  const endTime = joinTimeEnd
    ? moment(joinTimeEnd, 'YYYY-MM-DD HH:mm:ss').valueOf() / 1000
    : ''
  const params = {
    joinTimeBegin: typeof startTime === 'string' ? '' : Math.floor(startTime),
    joinTimeEnd: typeof endTime === 'string' ? '' : Math.floor(endTime),
    ...rest,
  }
  return post('/api/wxGroupChatMember/export', params, {
    needJson: true,
  }).then((res) => handleObj(res))
}
// 导出统计数据
export const ExportStaticsData = async (formVals) => {
  const { times, ...rest } = formVals
  const [stime, etime] = handleTimes(times, { searchTime: true })
  const beginTime = stime
    ? moment(stime, 'YYYY-MM-DD HH:mm:ss').valueOf() / 1000
    : ''
  const endTime = etime
    ? moment(etime, 'YYYY-MM-DD HH:mm:ss').valueOf() / 1000
    : ''
  const params = {
    beginTime,
    endTime,
    ...rest,
  }
  return post('/api/wxGroupChat/exportStaticsInfo', params, {
    needHandleResponse: true,
    needJson: true,
    responseType: 'blob',
  }).then((res) => saveFileByRes(res))
}
