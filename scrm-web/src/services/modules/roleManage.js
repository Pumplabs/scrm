import { post } from '../request'
import { handleTable, handlePageParams } from '../utils'

// 获取角色列表
export const GetRoleTableList = async (pager) => {
  const params = {
    ...handlePageParams(pager),
  }
  return post('/api/sysRole/pageList', params, {needJson: true}).then(res => handleTable(res))
}
// 新增角色
export const AddRole = async (params) => {
  return post('/api/sysRole/save', params, {needJson: true})
}
// 删除单个角色
export const RemoveRole = async (params) => {
  return post('/api/sysRole/delete', params, {needForm: true})
}
// 批量删除角色
export const BatchRemoveRole = async (params) => {
  return post('/api/sysRole/batchDelete', params, {needJson: true})
}