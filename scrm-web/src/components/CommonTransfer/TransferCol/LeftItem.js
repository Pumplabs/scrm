import { Tooltip, Checkbox } from 'antd'
import cls from 'classnames'
import styles from './index.module.less'

const direction = 'left'
export default ({ ele, valueKey, titleKey, onChange, checked, renderLabel, renderTooltipTitle }) => {
  const renderItemLabel = (ele, checked) => {
    if (typeof renderLabel === 'function') {
      const label = renderLabel(ele, checked)
      return typeof label === 'undefined' ? ele[titleKey] : label
    } else {
      return ele[titleKey]
    }
  }
  const renderItemTooltipTitle = (ele) => {
    if (typeof renderTooltipTitle === 'function') {
      return renderTooltipTitle(direction, ele, true)
    } else {
      return ele[titleKey]
    }
  }
  return (
    <li
      key={ele[valueKey]}
      onClick={() => onChange(ele, !checked)}
      className={cls({
        [styles['list-item']]: true,
        [styles['active-item']]: checked,
      })}
    >
      <Tooltip
        placement="topLeft"
        title={renderItemTooltipTitle(ele)}
      >
        <span className={cls([styles.itemName])}>
          <Checkbox
            checked={checked}
            onChange={(e) => onChange(ele, e.target.checked)}
            style={{ marginRight: 8 }}
          >
          </Checkbox>
          {renderItemLabel(ele, checked)}
        </span>
      </Tooltip>
    </li>
  )
}