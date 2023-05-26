import { post } from '../request'
import { handleTable, handlePageParams } from '../utils'

// 获取标签组列表
export const GetMaterialTagGroupList = async(pager,formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/mediaTagGroup/pageList', params, {needJson: true}).then(res => handleTable(res));
}