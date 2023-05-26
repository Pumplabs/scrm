
import { post, get } from '../request'
import { handleTable, handlePageParams } from '../utils'

// 获取客户标签组不分页
export async function GetAllCustomerTagGroup (params) {
  return post(`/api/wxTagGroup/list`, params, { needJson: true }).then(res => Array.isArray(res.data) ? res.data : []);
}
// 分页获取客户标签组
export async function GetCustomerTagGroup (pager, formVals = {}) {
  const reqParams = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post(`/api/wxTagGroup/pageList`, reqParams, { needJson: true }).then(res => handleTable(res));
}

// 同步客户标签组
export async function AsyncCustomerTagGroup () {
  return get('/api/wxTagGroup/sync')
}

// 新增客户标签组
export async function AddCustomerTagGroup (params) {
  return post('/api/wxTagGroup/save', params, { needJson: true })
}

// 删除客户标签组
export async function RemoveCustomerTagGroup (params) {
  return post(`/api/wxTagGroup/delete`, params, { needForm: true })
}

// 编辑客户标签组
export async function EditCustomerTagGroup (params) {
  return post(`/api/wxTagGroup/update`, params, { needJson: true })
}

// 新增客户标签
export async function AddCustomerTag (params) {
  return post(`/api/wxTag/save`, params, { needJson: true })
}