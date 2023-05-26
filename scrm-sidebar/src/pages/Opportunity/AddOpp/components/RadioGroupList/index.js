import { forwardRef } from 'react'
import { Radio } from 'antd-mobile'
import styles from './index.module.less'

export default forwardRef((props, ref) => {
  const { list = [], fieldNames = {}, labelInValue, onChange, ...rest } = props
  const { label = 'label', value = 'value' } = fieldNames
  const onClickItem = (item) => {
    if (typeof onChange === 'function') {
      const changeVal = labelInValue ? item : item[value]
      onChange(changeVal)
    }
  }
  return (
    <Radio.Group ref={ref} {...rest} onChange={onChange}>
      {list.map((ele) => (
        <div
          key={ele[value]}
          className={styles['radio-item-wrap']}
          onClick={() => onClickItem(ele)}>
          <Radio
            value={ele[value]}
            style={{
              '--icon-size': '22px',
              '--font-size': '16px',
              '--gap': '8px',
            }}>
            {ele[label]}
          </Radio>
        </div>
      ))}
    </Radio.Group>
  )
})
