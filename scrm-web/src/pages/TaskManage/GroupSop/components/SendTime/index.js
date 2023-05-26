import { useMemo } from 'react'
import moment from 'moment'
import { REPEAT_TYPES } from '../../constants'
import { NUM_CN } from 'src/utils/constants'
import styles from './index.module.less'

const getFrequencyName = (type) => {
  switch (type) {
    case REPEAT_TYPES.MONTH:
      return '每月'
    case REPEAT_TYPES.DATE:
      return '每天'
    case REPEAT_TYPES.WEEK:
      return '每周'
    case REPEAT_TYPES.TWO_WEEK:
      return '每两周'
    default:
      return ''
  }
}

/**
 *
 * @param {String} prefix 前缀
 * @param {String} suffix 后缀
 * @returns
 */
const TimeItem = (props) => {
  const { data = {}, suffix = '', isTriggerTime, prefix = '' } = props
  const { frequencyCount, frequencyUnit } = useMemo(() => {
    let frequencyCount = ''
    let frequencyUnit = ''
    if (data.startDay) {
      frequencyCount = data.startDay
      frequencyUnit = '天'
      return {
        frequencyCount,
        frequencyUnit,
      }
    }
    const executeTime = data.executeAt
      ? moment(data.executeAt, 'YYYY-MM-DD HH:mm')
      : null
    if (!executeTime) {
      return {
        frequencyCount,
        frequencyUnit,
      }
    }
    const day = executeTime.day()
    const date = executeTime.date()
    switch (data.period) {
      case REPEAT_TYPES.WEEK:
      case REPEAT_TYPES.TWO_WEEK:
        frequencyCount = day === 0 ? '日' : NUM_CN[day]
        break
      case REPEAT_TYPES.MONTH:
        frequencyCount = date
        frequencyUnit = '日'
        break
      case REPEAT_TYPES.DEFINED:
        frequencyCount = data.customDay
        frequencyUnit = '天'
        break
      default:
        break
    }
    return {
      frequencyCount,
      frequencyUnit,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isTriggerTime])
  const actionName = useMemo(() => {
    return isTriggerTime ? getFrequencyName(data.period) : prefix
  }, [data, prefix, isTriggerTime])

  const timeStr = useMemo(() => {
    if (data.startTime) {
      return data.startTime
    } else if (data.period === REPEAT_TYPES.NEVER) {
      return data.executeAt
    } else {
      return data.executeAt
        ? moment(data.executeAt, 'YYYY-MM-DD HH:mm').format('HH:mm')
        : ''
    }
  }, [data])
  const timePrefixStr = data.period === REPEAT_TYPES.DEFINED ? '每' : ''
  const prefixStr = isTriggerTime ? timePrefixStr : '第'
  return (
    <TimeContent actionName={actionName} suffix={suffix} time={timeStr}>
      <>
        {prefixStr}
        {/* 频率值 */}
        {frequencyCount ? (
          <span className={styles['time-count']}>{frequencyCount}</span>
        ) : null}
        {/* 频率单位 */}
        {frequencyUnit ? <span>{frequencyUnit},</span> : null}
      </>
    </TimeContent>
  )
}

const TimeContent = (props) => {
  const { actionName, suffix, time, children } = props
  return (
    <div className={styles['time-item']}>
      {actionName ? (
        <span className={styles['time-trigger']}>{actionName}</span>
      ) : null}
      {children}
      {/* 第<span className={styles['time-count']}>3</span>天， */}
      <span className={styles['time-count']}>{time}</span>
      {suffix}
    </div>
  )
}
export default TimeItem
