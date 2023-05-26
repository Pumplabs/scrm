export const getDate = (timeStr) => {
  const time = new Date(timeStr)
  const date = time.getDate()
  // 月日
  const month = time.getMonth() + 1
  const hour = time.getHours()
  const min = time.getMinutes()
  const year = time.getFullYear()
  return {
    year,
    date,
    month,
    hour,
    min,
  }
}
export const fillZero = (count) => {
  return count < 10 ? `0${count}` : count
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
