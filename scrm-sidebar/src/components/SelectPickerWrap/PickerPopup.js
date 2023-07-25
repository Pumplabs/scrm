import { useState, useEffect } from 'react'

import MyPopup from 'components/MyPopup'

export default (props) => {
  const {
    visible,
    onOk,
    value,
    onChange,
    render,
    ...rest
  } = props
  const [tempValue, setTempValue] = useState(undefined)
  useEffect(() => {
    setTempValue(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onRadioChange = (val) => {
    setTempValue(val)
  }
  const handleOk = () => {
    if (typeof onOk === 'function') {
      onOk(tempValue)
    }
  }
  return (
    <MyPopup visible={visible} onOk={handleOk} {...rest}>
      {
         typeof render === 'function' ? render({
          value: tempValue,
          onChange: onRadioChange
        }): null
      }
    </MyPopup>
  )
}