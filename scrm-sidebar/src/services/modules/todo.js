import { post } from '../request'
import { handlePageParams, handleTable } from '../utils'

// 查询待办
export const GetTodoList = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post("/api/brTodo/pageList", params, {
    needJson: true,
  }).then(res => handleTable(res))
}
