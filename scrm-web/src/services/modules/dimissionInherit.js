import { post } from '../request'
import { handleTimes } from 'utils/times'
import { handlePageParams, handleTable } from '../utils'

// 查询客户移交记录
export const GetCustomerTransferHistoryList = (pager, formVals = {}) => {
  const { createTime, ...rest } = formVals
  const [beginTime, endTime] = handleTimes(createTime, { searchTime: true })
  const params = {
    beginTime,
    endTime,
    ...rest,
    ...handlePageParams(pager),
  }
  return post(
    '/api/staffResignedInheritance/transferCustomerPageInfo',
    params,
    { needJson: true }
  ).then((res) => handleTable(res))
}
// 查询群移交记录
export const GetGroupTransferHistory = (pager, formVals = {}) => {
  const { createTime, creatorIds = [], ...rest } = formVals
  const [beginTime, endTime] = handleTimes(createTime, { searchTime: true })
  const params = {
    creatorIds,
    beginTime,
    endTime,
    ...rest,
    ...handlePageParams(pager),
  }
  return post(
    '/api/staffResignedInheritance/transferGroupChatPageInfo',
    params,
    { needJson: true }
  ).then((res) => handleTable(res))
}

// 分配客户
export const TransferCustomer = (params = {}) => {
  return post('/api/staffResignedInheritance/transferCustomer', params, {
    needJson: true,
  })
}

// 分配群聊
export const TransferGroup = (params) => {
  return post('/api/staffResignedInheritance/transferGroupChat', params, {
    needJson: true,
  })
}

// 查询离职员工列表
export const GetDimmissionInherit = (pager, formVals = {}) => {
  const { createTime, ...rest } = formVals
  const [resignedBeginTime, resignedEndTime] = handleTimes(createTime, {
    searchTime: true,
  })
  console.log('rest', rest)
  const params = {
    resignedBeginTime,
    resignedEndTime,
    ...rest,
    ...handlePageParams(pager),
  }
  return post(
    '/api/staffResignedInheritance/transferStatisticsPageInfo',
    params,
    { needJson: true }
  ).then((res) => handleTable(res))
}

// 获取待移交客户
export const GetWaitTransferCustomer = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/staffResignedInheritance/waitTransferCustomerPage', params, { needJson: true, }).then(res => handleTable(res))
}
// 获取待移交群聊
export const GetWaitTransferGroup = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/staffResignedInheritance/waitTransferGroupChatPage', params, { needJson: true, }).then(res => handleTable(res))
}