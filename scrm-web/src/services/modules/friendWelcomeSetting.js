import { post } from '../request'
import { handlePageParams, handleTable } from '../utils'

export const GetWelComeList = async (pager = {}, formVals = {}) => {
  const params = {
    ...formVals,
    ...handlePageParams(pager),
  }
  return post('/api/brFriendWelcome/pageList',params, {needJson: true}).then(res => handleTable(res))
}
// 新增欢迎语
export const AddOrEditWelCome = async (params) => {
  return post('/api/brFriendWelcome/saveOrUpdate', params, {needJson: true})
}
// 删除欢迎语
export const RemoveWelCome = async (params) => {
  return post('/api/brFriendWelcome/delete', params, {needForm: true})
}