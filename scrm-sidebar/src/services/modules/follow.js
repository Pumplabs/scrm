import { post, get } from '../request'
import { handleObj, handlePageParams, handleTable } from '../utils'

export const GetCustomerFollowList = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/brCustomerFollow/pageList', params, { needJson: true }).then(res => handleTable(res))
}

// 新增跟进
export const AddCustomerFollow = async (params) => {
  return post('/api/brCustomerFollow/save',params, {needJson: true})
}

// 根据详情
export const GetFollowDetail = async (params) => {
  return get(`/api/brCustomerFollow/${params.id}`).then(res => handleObj(res))
}

// 删除跟进
export const RemoveFollow = async (params) => {
  return post('/api/brCustomerFollow/delete', params, {needForm: true})
}

// 新增跟进回复
export const AddFollowReply = async (params) => {
  return post('/api/brCustomerFollow/saveReply', params, {
    needJson: true
  })
}

export const EditFollow = async (params) => {
  return post('/api/brCustomerFollow/update', params, {
    needJson: true
  })
}

// 获取根据通知
export const GetFollowNotice = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/brCustomerFollow/pageListMsg', params, {
    needJson: true,
  }).then(res => handleTable(res))
}

// 已读通知
export const ReadNotice = async (params) => {
  return get('/api/brCustomerFollow/readMsg', params)
}
// 阅读跟进
export const ReadFollow = async (params) => {
  return get('/api/brCustomerFollow/readMsgByFollow', params)
}
// 删除回复
export const RemoveReply = async (params) => {
  return post('/api/brCustomerFollow/deleteReply', params, {
    needForm: true
  })
}
// 完成任务
export const DoneTask = async (params) => {
  return get('/api/brCustomerFollow/finishTask', params)
}
