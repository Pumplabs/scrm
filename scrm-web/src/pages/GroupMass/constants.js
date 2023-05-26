// export const MSG_RECEIvE_STATUS_OPTIONS = [
//   {
//     label: '群主已发送',
//     value: 1
//   },
//   {
//     label: '群主未发送',
//     value: 2
//   },
//   {
//     label: '发送失败',
//     value: 3
//   }
// ]

export const SEND_STATUS_VAL = {
  // 已取消
  CANCEL: 2,
  // 待发送
  WAIT_SEND: 0,
  // 发送成功
  SUCCESS:  1,
  // 创建失败
  FAIL: -1
}
// 0->待发送，1->发送成功，2->已取消，-1->创建失败，	
export const SEND_STATUS_NAMES = {
  // 已取消
  [SEND_STATUS_VAL.CANCEL]: '已取消',
  // 待发送
  [SEND_STATUS_VAL.WAIT_SEND]: '待发送',
  // 发送成功
  [SEND_STATUS_VAL.SUCCESS]: '发送成功',
  // 创建失败
  [SEND_STATUS_VAL.FAIL]: '创建失败'
}