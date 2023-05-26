export const handleTimes = (times, options = {}) => {
  const { searchTime, ...rest } = options
  const [stime, etime] = Array.isArray(times) ? times : []
  const sTimeStr = handleTime(stime, { suffix: searchTime ? ' 00:00:00' : '', ...rest, })
  const eTimeStr = handleTime(etime, { suffix: searchTime ? ' 23:59:59' : '', ...rest,  })
  return [sTimeStr, eTimeStr]
}
/**
 * 
 * @param {*} time 
 * @param {*} options 
 * * @param {String} suffix 后缀
 * @returns 
 */
export const handleTime = (time, options = {}) => {
  const { format = 'YYYY-MM-DD', suffix } = options
  return time ? time.format(format) + suffix : ''
}

const getDiffTime = (count) => {
  const DATE = 24 * 60 * 60
  const days = Math.floor(count / DATE)
  let times = count - days * DATE
  const hour = Math.floor(times / (60 * 60))
  times = times - hour * 60 * 60
  const min = Math.floor(times / 60)
  const second = count % 60
  return {
    days,
    hour,
    min,
    second,
  }
}

export const getDiffStr = (count) => {
  const { days, hour, min, second } = getDiffTime(count)
  let str = `${second}秒`
  if (min) {
    str = `${min}分` + str
  }
  if (hour) {
    str = `${hour}小时` + str
  }
  if (days) {
    str = `${days}天` + str
  }
  return str
}