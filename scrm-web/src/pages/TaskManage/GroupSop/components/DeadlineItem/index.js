import { forwardRef } from 'react'
import { InputNumber, Select } from 'antd'
export const DEADLINE_TYPE_VALS = {
  DAY: 'day',
  HOUR: 'hour',
}
const DEADLINE_OPTIONS = [
  {
    label: '天',
    value: 'day',
  },
  {
    label: '小时',
    value: 'hour',
  },
]
export default forwardRef((props, ref) => {
  const { value = {}, onChange, ...rest } = props

  const handleChange = (key, val) => {
    if (typeof onChange === 'function') {
      onChange({
        ...value,
        [key]: val,
      })
    }
  }
  const onNumChange = (val) => {
    handleChange('num', val)
  }
  const onTypeChange = (val) => {
    handleChange('type', val)
  }
  return (
    <div ref={ref} {...rest}>
      <span style={{ marginRight: 6 }}>收到任务后</span>
      <InputNumber
        value={value.num}
        onChange={onNumChange}
        min={1}
        precision={0}
        max={Number.MAX_SAFE_INTEGER}
      />
      <Select
        value={value.type}
        options={DEADLINE_OPTIONS}
        style={{ width: 100 }}
        onChange={onTypeChange}
        fieldNames={{
          title: 'label',
          value: 'value',
        }}
      />
    </div>
  )
})
