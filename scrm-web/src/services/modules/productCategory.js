import { post } from '../request'
import { handleTable, handlePageParams } from '../utils'

// 获取分类列表
export const GetCategoryTableList = async (pager) => {
  const params = {
    ...handlePageParams(pager),
  }
  return post('/api/brProductType/pageList', params, {needJson: true}).then(res => handleTable(res))
}

// 新增分类
export const AddCategory = async (params) => {
  return post('/api/brProductType/save', params, {needJson: true})
}
// 编辑分类
export const EditCategory = async (params) => {
  return post('/api/brProductType/update', params, {needJson: true})
}

export const BatchRemoveCategory = async (params) => {
  return post('/api/brProductType/batchDelete', params, {needJson: true})
}