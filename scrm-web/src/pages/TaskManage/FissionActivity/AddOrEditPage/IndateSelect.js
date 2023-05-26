import { Radio, InputNumber } from 'antd'

// 有效期
export const INDATE_EN_VAL = {
  // 立即失效
  IMMEDIATE: 'immediate',
  // 其它时间
  OTHER: 'other'
}
const IndateSelect = ({ value = { day: 7 }, onChange }) => {

  const handleChange = (newValue) => {
    if (typeof onChange === 'function') {
      onChange(newValue)
    }
  }
  const handleRadioChange = (e) => {
    const type = e.target.value
    handleChange({
      ...value,
      type
    })
  }
  const handleNumberChange = (num) => {
    // const num = e.target.value
    handleChange({
      ...value,
      day: num
    })
  }
  return (
    <div>
      <Radio.Group
        value={value.type}
        onChange={handleRadioChange}
      >
        <Radio value={INDATE_EN_VAL.IMMEDIATE}>立即失效</Radio>
        <Radio value={INDATE_EN_VAL.OTHER}>
          <InputNumber
            disabled={value.type !== INDATE_EN_VAL.OTHER}
            max={Number.MAX_SAFE_INTEGER}
            min={1}
            onChange={handleNumberChange}
            value={value.day > 0 ? value.day : undefined}
            precision={0}
          />
          天后过期
        </Radio>
      </Radio.Group>
    </div>
  )
}
export default IndateSelect