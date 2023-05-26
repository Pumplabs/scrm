import moment from 'moment'
import { handleTime } from 'src/utils/times'
export const getStartTime = (type) => {
  let days = 0
  if (type === 'seven') {
    days = 6
  } else if (type === 'thirty') {
    days = 29
  }
  const time = days > 0 ? moment().subtract(days, 'days') : moment().format()
  return handleTime(time, {
    suffix: ' 00:00:00'
  })
}