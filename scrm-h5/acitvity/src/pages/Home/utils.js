const DATE = 24 * 60 * 60

const formatDdoubleDigit = (num) => {
  if (num > 0 && num < 10) {
    return `0${num}`
  } else {
    return num
  }
}
export const formatTimes = (count) => {
  const days = Math.floor(count / DATE)
  let times = count - days * DATE
  const hour = Math.floor(times / (60 * 60))
  times = times - hour * 60 * 60
  const min = Math.floor(times / 60)
  const second = count % 60
  return {
    days,
    hour: formatDdoubleDigit(hour),
    min: formatDdoubleDigit(min),
    second: formatDdoubleDigit(second)
  }
}
