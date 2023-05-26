import { post } from '../request'
import { handleTable, handlePageParams } from '../utils'

// 获取部门下的员工
export async function getUserByDepId (pager = {}, vals = {}) {
  const params = {
    ...handlePageParams(pager),
    ...vals
  }
  return post('/api/staff/pageList', params, { needJson: true }).then(res => handleTable(res))
}