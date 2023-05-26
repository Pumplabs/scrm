
import { post, get } from '../request'
import { handlePageParams, handleTable, handleObj } from '../utils'

// 新增个人群发
export const AddPersonMass = async (params) => {
  return post("/api/wxMsgTemplate/savePerson", params, {needJson: true})
}

// 获取群发列表
export const GetMassList = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
return post('/api/wxMsgTemplate/pageList', params, { needJson: true}).then(res => handleTable(res))
}

// 查询群发详情
export const GetMassDetail = async (params = {}) => {
  return get(`/api/wxMsgTemplate/${params.id}`).then(res => handleObj(res))
}