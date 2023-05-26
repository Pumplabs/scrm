import { useState, forwardRef } from 'react'
import { Switch } from 'antd'
import { cloneElement } from 'src/utils/reactNode'

/**
 * 带有开关控制的组件
 * @param {Boolean} preserve 是否保留字段值
 * @param {Boolean} showContentOnChecked 当打开开关的时候展示内容
 * @param {Object} value
 * * @param {Boolean} checked 是否开启开关
 * * @param {Any} data 其它的值
 * @param {Boolean} responeChildren 响应children的onChange事件，默认为true
 */
export default forwardRef((props, ref) => {
  const {
    children,
    value,
    onChange,
    responeChildren = true,
    showContentOnChecked = true,
    switchProps = {},
    valuePropName = 'value',
    trigger = 'onChange'
  } = props
  const [selfValue, setSelfValue] = useState({})
  const hasDefinedValue = typeof value === 'undefined'
  const curValue = hasDefinedValue ? selfValue : value
  const shouldShowContent = showContentOnChecked
    ? curValue.checked
    : !curValue.checked

  const handleChange = (nextVals) => {
    if (typeof onChange === 'function') {
      onChange(nextVals)
    }
    if (hasDefinedValue) {
      setSelfValue(nextVals)
    }
  }

  const onSwitchChange = (checked) => {
    handleChange({
      ...curValue,
      checked,
    })
  }

  const onContentChange = (...args) => {
    if (children && typeof children.props.onChange === 'function') {
      children.props.onChange(...args)
    }
    handleChange({
      ...curValue,
      data: args[0]
    })
  }

  const nextChildren = children && responeChildren
    ? cloneElement(children, {
        [trigger]: onContentChange,
        [valuePropName]: curValue.data,
        ...(!shouldShowContent ? { style: { display: 'none' } } : {}),
      })
    : children

  return (
    <div ref={ref}>
      <Switch
        checked={curValue.checked}
        onChange={onSwitchChange}
        {...switchProps}
      />
      {nextChildren}
    </div>
  )
})
