import React from 'react'
import { Select, InputNumber } from 'antd'
import styles from './index.module.less'
export const REPEAT_TYPES = {
  DATE: 1,
  WEEK: 2,
  TWO_WEEK: 3,
  MONTH: 4,
  NEVER: 5,
  DEFINED: 6,
}

export const REPEAT_OPTIONS = [
  {
    label: '每日',
    value: REPEAT_TYPES.DATE,
  },
  {
    label: '每周',
    value: REPEAT_TYPES.WEEK,
  },
  {
    label: '每两周',
    value: REPEAT_TYPES.TWO_WEEK,
  },
  {
    label: '每月',
    value: REPEAT_TYPES.MONTH,
  },
  {
    label: '永不',
    value: REPEAT_TYPES.NEVER,
  },
  {
    label: '自定义',
    value: REPEAT_TYPES.DEFINED,
  },
]

export default React.forwardRef((props, ref) => {
  const { value = {}, onChange, ...rest } = props

  const triggerChange = (key, val) => {
    if (typeof onChange === 'function') {
      let nextVal = {}
      if (key === 'type' && val === REPEAT_TYPES.DEFINED) {
        nextVal = {
          [key]: val,
          count: 1,
        }
      } else {
        nextVal = {
          ...value,
          [key]: val,
        }
      }
      onChange(nextVal)
    }
  }

  const onRepeatTypeChange = (val) => {
    triggerChange('type', val)
  }
  
  const onNumChange = (val) => {
    triggerChange('count', val)
  }
  return (
    <div ref={ref} {...rest}>
      <Select
        placeholder="重复"
        value={value.type}
        options={REPEAT_OPTIONS}
        onChange={onRepeatTypeChange}
        style={{ width: 120, marginRight: 8 }}
      />
      {value.type === REPEAT_TYPES.DEFINED ? (
        <span className={styles['count-item']}>
          <span className={styles['count-item-label']}>每</span>
          <InputNumber
            value={value.count}
            onChange={onNumChange}
            min={1}
            precision={0}
            max={1000}
          />
          <span className={styles['count-item-label']}>天</span>
        </span>
      ) : null}
    </div>
  )
})
