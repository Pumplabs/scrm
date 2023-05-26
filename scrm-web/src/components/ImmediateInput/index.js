import { useRef, useEffect, useState } from 'react'
import { Input } from 'antd'
import cls from 'classnames'
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import styles from './index.module.less'

/**
 * 即时输入框
 * @param {function}  onSave 点击保存
 * @param {function} onCancel 点击取消
 * @param {function} defaultValue 默认值
 * @param {function} validMsg 校验信息
 * @param {boolean} trimSpace 是否去除前后空格, 默认为true
 * @param {Boolean} confirmLoading 是否校验中
 * @param {Boolean} required 是否非空
 * @returns
 */
const ImmediateInput = (props) => {
  const {
    onChange,
    onSave,
    onCancel,
    defaultValue,
    className,
    validMsg,
    required= true,
    trimSpace = true,
    confirmLoading,
    ...rest
  } = props
  const [curVal, setCurVal] = useState(rest.value || '')
  const isDefinedValue = Reflect.has(rest, 'value')
  const [msg, setMsg] = useState('')
  const instance = useRef()
  useEffect(() => {
    instance.current.focus()
    window.addEventListener('focus', () => {
      if (instance.current) {
        instance.current.focus()
      }
    })
  }, [])

  useEffect(() => {
    setCurVal(defaultValue || '')
    setMsg('')
  }, [defaultValue])

  const onInputChange = (e) => {
    const val = e.target.value
    const newVal = typeof val === 'string' && trimSpace ? val.trim() : val
    if (!isDefinedValue) {
      setCurVal(newVal)
    }
    if (typeof onChange === 'function') {
      onChange(newVal)
    }
    const newMsg = getMsg(val)
    setMsg(newMsg)
  }

  // 点击保存
  const handleSave = () => {
    if (required && !curVal) {
      cancelInput()
      return
    }
    // 如果正在提交中
    if (confirmLoading) {
      return;
    }
    const newMsg = getMsg()
    setMsg(newMsg)
    if (newMsg) {
      instance.current.focus()
      return
    }
    if (typeof onSave === 'function') {
      onSave(curVal)
    }
  }

  // 回车键
  const onPressEnter = () => {
    handleSave()
  }

  // 失去焦点
  const onBlur = () => {
    instance.current.focus()
    handleSave()
  }

  const cancelInput = () => {
    if (typeof onCancel === 'function') {
      onCancel()
    }
  }

  const handleCancel = (e) => {
    e.stopPropagation()
    cancelInput()
    return
  }

  const getMsg = (val = curVal) => {
    if (required && !val) {
      return '请输入'
    }
    return typeof validMsg === 'function' ? validMsg(val) : ''
  }

  return (
    <div className={styles['input-container']}>
      <div className={styles['input-inner']} onBlur={onBlur}>
        <Input
          onChange={onInputChange}
          ref={(r) => (instance.current = r)}
          onPressEnter={onPressEnter}
          value={curVal}
          className={cls({
            [className]: className,
            [styles['input-ele']]: true,
            [styles['input-error']]: msg,
          })}
          {...rest}
        />
        <span className={styles['input-actions']}>
          {confirmLoading ? (
            <span className={styles['action-text-btn']}>
              <LoadingOutlined />
            </span>
          ) : (
            <span onClick={handleSave} className={styles['action-text-btn']}>
              <CheckCircleOutlined />
            </span>
          )}
          <span
            onMouseDown={handleCancel}
            className={styles['action-text-btn']}>
            <CloseCircleOutlined
          />
          </span>
        </span>
      </div>
      {msg && <p className={styles['input-msg']}>{msg}</p>}
    </div>
  )
}
export default ImmediateInput
