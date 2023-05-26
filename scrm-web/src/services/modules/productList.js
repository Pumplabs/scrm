import { post } from '../request'
import { handleTable, handlePageParams } from '../utils'

// 获取产品列表
export const GetProductList = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/brProductInfo/pageList', params, {needJson: true}).then(res => handleTable(res))
}

// 新增产品
export const AddProdcut = async (params) => {
  return post("/api/brProductInfo/save", params, {needJson: true})
}

// 编辑产品
export const EditProduct = async (params) => {
  return post('/api/brProductInfo/update', params, {needJson: true})
}

// 删除产品
export const BatchRemoveProduct = async (params) => {
  return post('/api/brProductInfo/batchDelete', params, {needJson: true})
}
