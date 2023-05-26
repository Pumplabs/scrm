import { get } from '../request'
import { handleObj } from '../utils'

// 获取欢迎语详情
export const GetGroupWelcome = async (params) => {
  return get(`/api/brGroupChatWelcome/${params.id}`).then(res => handleObj(res))
}
