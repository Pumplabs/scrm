
import { get } from '../request'
import { handleObj } from '../utils'

// 新增个人群发
export const GetReportData = async (params) => {
  return get("/api/brReportEveryday/findById", params, {needJson: true}).then(res => handleObj(res))
}