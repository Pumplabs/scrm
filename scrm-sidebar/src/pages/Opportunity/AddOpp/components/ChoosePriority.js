import { useState, useEffect } from 'react'
import MyPopup from 'components/MyPopup'
import RadioGroupList from 'components/RadioGroupList'
import { PRIORITY_OPTIONS } from '../constants'

export default (props) => {
  const { visible, onOk, data = {}, ...rest } = props
  const [priority, setPriority] = useState('')

  useEffect(() => {
    if (visible) {
      setPriority(data.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onPriority = (val) => {
    setPriority(val)
  }

  const handleOk = () => {
    if (typeof onOk === 'function') {
      const item = PRIORITY_OPTIONS.find((ele) => ele.value === priority)
      onOk(priority, item)
    }
  }

  return (
    <MyPopup title={'选择阶段'} onOk={handleOk} visible={visible} {...rest}>
      <div style={{ height: '40vh', overflowY: 'auto' }}>
        <RadioGroupList
          list={PRIORITY_OPTIONS}
          value={priority}
          onChange={onPriority}
        />
      </div>
    </MyPopup>
  )
}
