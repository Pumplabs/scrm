import moment from 'moment'

export const fillZero = (count) => {
  return count < 10 ? `0${count}` : count
}
/**
 *
 * @param {Array<object>} list 数据源
 * @param {Object} options
 * * @param {String} dateFieldName 日期字段名称
 * * @param {Function} format 格式化方法
 * @returns
 */
 export const covertListByDate = (list = [], options = {}) => {
  let timeInfo = null
  let res = []
  let arr = []
  const { dateFieldName = 'createdAt', format } = options
  list.forEach((ele) => {
    const eleTime = moment(ele[dateFieldName])
    const year = eleTime.year()
    const date = eleTime.date()
    const month = eleTime.month() + 1
    const isToday = moment().isSame(eleTime, 'days')
    const curFullyDate = eleTime.format('YYYY-MM-DD')
    const dateStr =
      typeof format === 'function'
        ? format({ year, month, date, isToday })
        : eleTime.format('MM月DD日')
    if (timeInfo && timeInfo.str !== curFullyDate) {
      res = [
        ...res,
        {
          year,
          date: timeInfo.dateStr,
          isToday: timeInfo.isToday,
          fullDate: curFullyDate,
          key:timeInfo.key,
          list: [...arr],
        },
      ]
      arr = []
    }
    arr = [
      ...arr,
      {
        actionName: eleTime.format('HH:mm'),
        ...ele,
      },
    ]
    timeInfo = {
      str: curFullyDate,
      key:ele.id,
      year,
      isToday,
      dateStr,
    }
  })
  if (arr.length) {
    res = [
      ...res,
      {
        date: timeInfo.dateStr,
        fullDate: timeInfo.str,
        year: timeInfo.year,
        isToday: timeInfo.isToday,
        key:timeInfo.key,
        list: [...arr],
      },
    ]
  }
  return res
}
