
import { post } from '../request'
import { handleArray, handlePageParams, handleTable } from '../utils'

// 查询管理员列表
export const GetAdminList = async (pager) => {
  const params = {
    ...handlePageParams(pager),
  }
  return post('/api/sysRoleStaff/pageList', params, { needJson: true }).then(res => handleTable(res))
}
// 新增管理员列表
export const AddAdmin = async (params) => {
  return post('/api/sysRoleStaff/saveAdmin', params, {needJson: true})
}
// 删除管理员列表
export const RemoveAdmin = async (params) => {
  return post('/api/sysRoleStaff/delete', params, {needForm: true})
}
// 批量删除管理员列表
export const BatchRemoveAdmin = async (params) => {
  return post('/api/sysRoleStaff/batchDelete', params, {needJson: true})
}