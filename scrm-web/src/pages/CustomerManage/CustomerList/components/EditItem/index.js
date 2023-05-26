import { useState, forwardRef, useImperativeHandle } from 'react'
import { EditOutlined } from '@ant-design/icons'
import ImmediateInput from 'components/ImmediateInput'
import styles from './index.module.less'
export default forwardRef(({ onChange, defaultValue, children, inputProps = {} }, ref) => {
  const [visible, setVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    onCancel,
  }))

  const onSave = (text) => {
    if (typeof onChange === 'function') {
      onChange(text)
    }
    setVisible(false)
  }
  const onCancel = () => {
    setVisible(false)
  }

  const onShow = () => {
    setVisible(true)
  }

  const onBlur = () => {
    onCancel()
  }

  const inputEleProps = {
    required: false,
    onSave,
    onCancel,
    maxLength: 30,
    defaultValue,
    ...inputProps
  }
  const text = defaultValue || '-'

  return (
    <span className={styles['edit-item']} onBlur={onBlur} ref={ref}>
      {visible ? (
        <>{children ? children : <ImmediateInput {...inputEleProps} />}</>
      ) : (
        text
      )}
      {!visible ? (
        <EditOutlined className={styles['edit-icon']} onClick={onShow} />
      ) : null}
    </span>
  )
})
