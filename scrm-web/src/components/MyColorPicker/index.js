import { useState, forwardRef } from 'react'
import { Popover, Button } from 'antd'
import { SketchPicker } from 'react-color'
import { formatColorStr } from './utils'
import styles from './index.module.less'

export default forwardRef(({ value, onChange }, ref) => {
  const [color, setColor] = useState(value)
  const [visible, setVisible] = useState(false)
  const handleChangeComplete = (item) => {
    setColor(item.rgb)
  }
  const onOk = () => {
    setVisible(false)
    if (typeof onChange === 'function') {
      onChange(color)
    }
  }

  const onCancel = () => {
    setVisible(false)
  }

  const openPover = () => {
    setVisible(true)
    setColor(value)
  }

  const content = (
    <div>
      <SketchPicker
        color={color}
        disableAlpha={true}
        onChangeComplete={handleChangeComplete}
      />
      <div className={styles['color-picker-footer']}>
        <span className={styles['color-info']}>
          已选择
          <span
            style={{ background: formatColorStr(color) }}
            className={styles['color-icon']}></span>
        </span>
        <Button size="small" style={{ marginRight: 4 }} onClick={onCancel}>
          取消
        </Button>
        <Button type="primary" size="small" onClick={onOk}>
          确定
        </Button>
      </div>
    </div>
  )

  return (
    <Popover
      content={content}
      title="选择颜色"
      trigger="click"
      visible={visible}>
      <span className={styles['color-picker']} onClick={openPover} ref={ref}>
        <span
          className={styles['color-item']}
          style={{
            background: value ? formatColorStr(value) : '',
          }}></span>
      </span>
    </Popover>
  )
})
