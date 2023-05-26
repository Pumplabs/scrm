import { get, post } from '../request'
import { handleTimes } from 'utils/times'
import { handlePageParams,handleObj, handleTable } from '../utils'

/**
 * 获取客户列表
 * @param {*} params 
 * @returns 
 */
export const GetCustomerList = async (pager = {}, formVals = {}) => {
  const { createTime, extCreatorIds = [], ...rest } = formVals
  const [createdAtBegin = '', createdAtEnd = ''] = handleTimes(createTime, { searchTime: true })
  const params = {
    createdAtBegin,
    createdAtEnd,
    extCreatorId: extCreatorIds,
    ...handlePageParams(pager),
    ...rest
  }
  return post('/api/wxCustomer/pageList', params, { needJson: true }).then(res => handleTable(res))
}
// 客户下拉列表
export const GetCustomerDropdownList = async(pager = {}, formVals = {})  => {
  const { tags = [], times, ...rest } = formVals
  const [createTimeBegin = '', createTimeEnd = ''] = handleTimes(times, { searchTime: true })
  const params = {
    ...rest,
    createTimeBegin,
    createTimeEnd,
    tagExtIdList: tags.map(item => item.extId),
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/wxCustomer/dropDownPageList', params, { needJson: true }).then(res => handleTable(res))
}
/**
 * 同步客户
 * @param {*} params 
 * @returns 
 */
export const AsyncCustomer = async () => {
  return get('/api/wxCustomer/sync')
}
/**
 * 客户详情
 * @param {*} params 
 * @returns 
 */
export const GetCustomerDetail = async (params) => {
  return get(`/api/wxCustomer/getByIdAndStaffId`, params).then(res => res.data ? res.data : {})
}

/**
 * 修改客户
 * @param {*} params 
 * @returns 
 */
export const UpdateCustomer = async (params) => {
  return post(`/api/wxCustomer/updateCustomerInfo`, params, { needJson: true })
}

/**
 * 导出客户
 * @param {*} params 
 * @returns 
 */
export const ExportCustomer = async (formVals = {}) => {
  const { createTime, ...rest } = formVals
  const [createdAtBegin = '', createdAtEnd = ''] = handleTimes(createTime, { searchTime: true })
  const params = {
    createdAtBegin,
    createdAtEnd,
    ...rest
  }
  return get(`/api/wxCustomer/export`, params).then(res => handleObj(res))
}

// 编辑客户企业标签
export const EditCustomerCompanyTag = (params) => {
  return post(`/api/wxCustomer/editTag`, params, { needJson: true })
}

export const AddCompanyTag = async (params) => {
  return get('/api/wxDepartment/getList', params)
}

export const AddUserTag = async (params) => {
  return get('/api/wxDepartment/getList', params)
}
export const GetUserTag = async (params) => {
  return get('/api/wxDepartment/getList', params).then(() => [])
}

export const GetCustomerTable = async (params) => {
  return get('/api/wxDepartment/getList', params).then(() => [])
}
// 客户动态
export const GetCustomerMoment = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/brCustomerDynamic/pageList', params, { needJson: true }).then(res => handleTable(res))
}

// 批量打标
export const BatchMarkTag = async (params) => {
  return post('/api/wxCustomer/batchMarking', params, {needJson: true})
}