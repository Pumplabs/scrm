import { forwardRef, useMemo } from 'react'
import { DatePicker } from 'antd-mobile'
import moment from 'moment'
import { isEqual } from 'lodash'
import { fillZero } from 'src/utils'

export const getIndexByDate = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day, hour, minute, second]
}

const weights = ['year', 'month', 'day', 'hour', 'minute', 'second']
const compareVal = (value1, value2, { isGt, isEq, isLt }) => {
  if (!isEq && !isLt && !isGt) {
    return false
  }
  // 如果不能选择大于，不能选择小于
  if (!isGt && !isLt) {
    return value1 === value2
  }
  if (isEq) {
    return isGt ? value1 >= value2 : value1 <= value2
  } else {
    return isGt ? value1 > value2 : value1 < value2
  }
}
export default forwardRef((props, ref) => {
  const {
    shouldSelectAfterCurrent = true,
    shouldSelectBeforeCurrent = true,
    shouldSelectCurrent = true,
    precision = 'day',
    ...rest
  } = props
  const currentWeight = useMemo(() => {
    const idx = weights.indexOf(precision)
    return weights.slice(0, idx + 1)
  }, [precision])
  const currentData  = getIndexByDate(new Date())
  const getFilters = ({ isBefore, isAfter, isCurrent }) => {
    let fns = {}
    currentWeight.forEach((weightItem, weightIdx) => {
      fns[weightItem] = function (val, time) {
        const selectTimeData = getIndexByDate(time.date)
        // 如果前面部分相等
        const currentPrefix = currentData.slice(0, weightIdx)
        const selectPrefix = selectTimeData.slice(0, weightIdx)
        if (isEqual(currentPrefix, selectPrefix)) {
          return compareVal(val, currentData[weightIdx], {
            isGt: isAfter,
            isLt: isBefore,
            isEq: precision === weightItem ? shouldSelectCurrent : true,
          })
        } else {
          return true
        }
      }
    })
    return fns
  }

  const getFiltersByConfig = () => {
    if (
      shouldSelectAfterCurrent &&
      shouldSelectBeforeCurrent &&
      shouldSelectCurrent
    ) {
      return {}
    } else {
      return getFilters({
        isBefore: shouldSelectBeforeCurrent,
        isAfter: shouldSelectAfterCurrent,
        isCurrent: shouldSelectCurrent,
      })
    }
  }
  const filters = getFiltersByConfig()

  return (
    <DatePicker
      ref={ref}
      precision={precision}
      {...rest}
      min={new Date(moment('1900-01-01 00:00:00').valueOf())}
      filter={filters}
    />
  )
})

export const formatDate = (dateStr, formatStr = 'YYYY-MM-DD') => {
  const date = new Date(dateStr)
  const yearStr = date.getFullYear()
  const month = date.getMonth() + 1
  const monthStr = fillZero(month)
  const day = date.getDate()
  const dayStr = fillZero(day)
  const hour = date.getHours()
  const min = date.getMinutes()
  const second = date.getSeconds()
  let res = formatStr
  res = res.replace('YYYY', yearStr)
  res = res.replace('MM', monthStr)
  res = res.replace('DD', dayStr)
  res = res.replace('HH', fillZero(hour))
  res = res.replace('mm', fillZero(min))
  res = res.replace('ss', fillZero(second))
  return res
}
