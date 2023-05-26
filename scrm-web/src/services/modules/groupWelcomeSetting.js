import { post } from '../request'
import { handlePageParams, handleTable } from '../utils'

// 获取欢迎语列表
export const GetWelComeList = async (pager = {}, formVals = {}) => {
  const params = {
    ...formVals,
    ...handlePageParams(pager),
  }
  return post('/api/brGroupChatWelcome/pageList',params, {needJson: true}).then(res => handleTable(res))
}
// 新增欢迎语
export const AddOrEditWelCome = async (params) => {
  return post('/api/brGroupChatWelcome/saveOrUpdate', params, {needJson: true})
}
// 删除欢迎语
export const RemoveWelCome = async (params) => {
  return post('/api/brGroupChatWelcome/delete', params, {needForm: true})
}