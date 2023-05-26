import { useEffect, useState } from 'react'
import { TextArea, Popup, Button } from 'antd-mobile'
import styles from './index.module.less'

export default (props) => {
  const [text, setText] = useState('')
  const { onOk, onCancel, title, ...rest } = props

  useEffect(() => {
    if (!rest.visible) {
      setText('')
    }
  }, [rest.visible])

  const onTextChange = (value) => {
    setText(value)
  }

  const handleCancel = () => {
    onCancel()
  }

  const handleOk = () => {
    if (typeof onOk === 'function') {
      onOk({
        text,
      })
    }
  }

  return (
    <Popup
      {...rest}
      onMaskClick={handleCancel}
      bodyClassName={styles['popup-body']}>
      <p className={styles['popup-header']}>{title ? title : '回复跟进'}</p>
      <TextArea
        showCount
        onChange={onTextChange}
        value={text}
        maxLength={200}
        rows={10}
        placeholder="请输入不超过200个字符..."
      />
      <div className={styles['popup-footer']}>
        <Button fill="none" onClick={handleCancel}>
          取消
        </Button>
        <Button
          color="primary"
          fill="none"
          disabled={text.length === 0}
          onClick={handleOk}>
          确定
        </Button>
      </div>
    </Popup>
  )
}
