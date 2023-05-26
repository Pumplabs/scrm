import { post } from '../request'
import { handleTimes} from 'utils/times'
import { handlePageParams, handleTable, handleObj } from '../utils'

// 查询移交记录
export const GetTransferHistoryList = (pager, formVals = {}) => {
  const { createTime, ...rest } = formVals
  const [beginTime, endTime] = handleTimes(createTime, {searchTime: true})
 const params = {
   beginTime,
   endTime,
   ...rest,
   ...handlePageParams(pager),
 }
  return post("/api/staffOnJobTransfer/pageInfo", params, { needJson: true}).then(res => handleTable(res))
}

// 查询移交记录
export const TransferCustomer = (params = {}) => {
  return post("/api/staffOnJobTransfer/transferCustomer", params, { needJson: true})
}
