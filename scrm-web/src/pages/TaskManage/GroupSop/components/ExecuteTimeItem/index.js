import React, { useMemo } from 'react'
import { DatePicker, InputNumber, TimePicker } from 'antd'
import { getOptionItem } from 'src/utils'
import styles from './index.module.less'

/**
 * @param {Array} typeOptions 类型数组
 * @param {String} triggerType 类型
 * @param {Boolean} triggerIsTime 触发条件是否为时间
 */
export default React.forwardRef((props, ref) => {
  const {
    value = {},
    onChange,
    triggerType,
    typeOptions,
    triggerIsTime,
    disabledDate,
    ...rest
  } = props
  const triggerName = useMemo(() => {
    return getOptionItem(typeOptions, triggerType)
  }, [typeOptions, triggerType])

  const triggerValue = (key, val) => {
    if (typeof onChange === 'function') {
      onChange({
        ...value,
        [key]: val,
      })
    }
  }

  const onTimeChange = (val) => {
    triggerValue('time', val)
  }

  return (
    <div ref={ref} {...rest}>
      {triggerIsTime ? (
        <DatePicker
          value={value.time}
          format="YYYY-MM-DD HH:mm"
          disabledDate={disabledDate}
          showTime={true}
          onChange={onTimeChange}
          placeholder="请选择执行时间"
        />
      ) : (
        <TimeItem value={value} onChange={onChange} label={triggerName} />
      )}
    </div>
  )
})

const TimeItem = React.forwardRef((props, ref) => {
  const { value, onChange, label, ...rest } = props
  const triggerValue = (key, val) => {
    if (typeof onChange === 'function') {
      onChange({
        ...value,
        [key]: val,
      })
    }
  }
  const onNumChange = (val) => {
    triggerValue('count', val)
  }

  const onTimeChange = (val) => {
    triggerValue('time', val)
  }

  return (
    <span className={styles['count-item']} ref={ref} {...rest}>
      <span className={styles['count-item-label']}>{label}</span>
      <span className={styles['count-item-label']}>第</span>
      <InputNumber
        value={value.count}
        onChange={onNumChange}
        min={1}
        precision={0}
        max={1000}
        style={{ width: 66 }}
      />
      <span className={styles['count-item-label']}>天</span>
      <TimePicker
        value={value.time}
        onChange={onTimeChange}
        format="HH:mm"
        style={{ width: 80 }}
      />
    </span>
  )
})
