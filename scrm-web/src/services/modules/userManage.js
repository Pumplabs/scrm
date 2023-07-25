import { post, get } from '../request'
import { handlePageParams, handleTable, saveFileByRes, handleArray, handleObj } from '../utils'

// 创建部门
export async function PostCreateDep(params) {
  return post(`/api/department/save`, params, { needJson: true });
}
// 获取部门树
export async function GetTreeDepData() {
  return get('/api/department/getTree').then(res => handleArray(res))
}
// 获取部门列表
export async function GetAllDep() {
  const params = {
    extParentId: 0,
    "pageNum": 1,
    "pageSize": 99999
  }
  return post('/api/department/pageList', params, { needJson: true }).then(res => res.data && Array.isArray(res.data.records) ? res.data.records : [])
}
// 更新部门
export async function UpdateDep(params) {
  return post('/api/department/update', params, { needJson: true })
}

// 移除部门
export async function RemoveDep(params) {
  return get('/api/department/delete', params)
}
// 同步部门
export async function asyncDepData() {
  return get('/api/department/sync')
}

// 获取部门下的员工
export async function getUserByDepId(pager = {}, vals = {}) {
  const params = {
    ...handlePageParams(pager),
    ...vals
  }
  return post('/api/staff/pageList', params, { needJson: true }).then(res => handleTable(res))
}
// 创建用户
export async function CreateUser(params) {
  return post("/api/staff/save", params, { needJson: true })
}
// 更新用户
export async function UpdateUser(params) {
  return post("/api/staff/update", params, {
    needJson: true
  })
}
// 删除用户
export async function BatchRemoveUser(params) {
  return post('/api/staff/batchDelete', params, {
    needJson: true
  })
}
// 获取当前用户
export async function GetCurrentStaffAdmin() {
  return get(`/api/v1/staff-admin/action/get-current-staff`, {
    method: 'GET',
  });
}
// 同步用户
export async function AsyncUserData() {
  return get('/api/staff/sync')
}
// 导出用户
export async function ExportUser(params) {
  return get('/api/staff/export', { ...params }, {
    needHandleResponse: true,
    responseType: 'blob'
  }).then(res => saveFileByRes(res))
}

// 获取部门树和员工
export const getDepTreeAndUser = async (formVals = {}) => {
  const { name = '', ...rest } = formVals
  const params = {
    staffName: name,
    ...rest
  }
  return get("/api/department/getTreeWithStaffMap", params).then(res => handleArray(res))
}