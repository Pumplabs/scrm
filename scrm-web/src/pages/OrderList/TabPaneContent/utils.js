// 根据价格、折扣计算价钱
export const calcPrice = (price = 0, discount = 100) => {
  return ((price  * discount) / 100).toFixed(2)
}
// 根据价格计算折扣
export const calcDiscount = (newPrice = 0, oldPrice = 0) => {
  return (newPrice * 100 / oldPrice).toFixed(0)
}
// 获取订单金额
export const getOrderAmount = (list = [], discount =  100) => {
  const totalAmount = list.reduce((total, ele) => total + ele.newPrice * ele.count, 0)
  return (totalAmount * discount) / 100
}
