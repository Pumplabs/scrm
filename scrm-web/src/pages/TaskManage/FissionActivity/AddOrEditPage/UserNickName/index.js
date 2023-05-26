import { Switch } from 'antd'
import ColorPicker from 'components/MyColorPicker'
/**
 * 用户昵称
 * value
 * * @param {Boolean} checked 是否勾选
 * * @param {Object} color 是否勾选
 */
export default ({ value = {}, onChange }) => {
  const onColorChange = (val) => {
    triggerChange('color', val)
  }

  const onCheckChange = (val) => {
    triggerChange('checked', val)
  }

  const triggerChange = (key, val) => {
    changeValue({
      ...value,
      [key]: val
    })
  }

  const changeValue = (nextValue) => {
    if (typeof onChange === 'function') {
      onChange(nextValue)
    }
  }

  return (
    <div>
      <Switch
        checkedChildren="开启"
        checked={value.checked}
        unCheckedChildren="关闭"
        onChange={onCheckChange}
      />
      {
        value.checked ? (
          <span style={{ marginLeft: 8 }}>
            <span style={{marginRight: 4, lineHeight: "20px", display: "inline-block", verticalAlign: "bottom"}}>
              昵称颜色:
            </span>
            <ColorPicker
              value={value.color}
              onChange={onColorChange}
            />
          </span>
        ) : null
      }
    </div>
  )
}