import { post, get } from '../request'
import { handleObj, handleArray } from '../utils'

// 获取订阅信息
export const GetSubscription = async ({staffName = '', ...rest} = {}) => {
  const params = {
    staffName,
    ...rest
  }
  return post('/api/sysSubscribe/getOne', params, {
    needForm: true,
  }).then((res) => handleObj(res))
}
// 新增、编辑席位
export const ModifyUseSeat = async (params) => {
  return post('/api/sysSubscribe/updateSeat', params, {
    needJson: true,
  })
}

// 获取席位用户
export const GetSeatStaff = async () => {
  // extStaffIds
  return get('/api/sysSubscribe/getSeatStaffList').then(res => {
    if (res && res.data && Array.isArray(res.data.extStaffIds)) {
      return res.data.extStaffIds.map(item => ({
        extId: item
      }))
    } else {
      return []
    }
  })
}