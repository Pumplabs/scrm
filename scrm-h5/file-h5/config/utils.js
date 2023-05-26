
// 转换为url参数
function convertToUrlParams (data ={},) {
  let res = ''
  for(const attr in data) {
    const value = data[attr]
    let valueStr = value
    if (value && typeof value === 'object') {
       const nextStr = convertToUrlParams(value)
       valueStr = nextStr ? encodeURIComponent(nextStr) : nextStr
    }
    const item = valueStr || valueStr === 0 ? `${attr}=${valueStr}` : attr
    const code = res ? '&' : ''
   res = res + code + item
  }
  return res
}
module.exports = {
  // 转换为url参数
  convertToUrlParams
}