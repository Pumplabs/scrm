import cls from 'classnames'
import { CloseCircleFilled } from '@ant-design/icons'
import { Tooltip } from 'antd'
import TransferCol from '../TransferCol'
import styles from './index.module.less'

const direction = 'right'
export default (props) => {
  const { dataSource, total, onReset, fieldNames, onChange, footer,renderLabel, renderTooltipTitle, ...rest } = props
  const { title: titleKey, value: valueKey } = fieldNames
  const renderItemLabel = (ele) => {
    if (typeof renderLabel === 'function') {
      const label = renderLabel(direction, ele, true)
      return typeof label === 'undefined' ?  ele[titleKey] : label
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
    <TransferCol
      list={dataSource}
      title={`${total}项`}
      titleExtra={
        <span onClick={onReset}>
          清空
        </span>
      }
      renderItem={(ele) => (
        <li key={ele[valueKey]}
          className={cls({
            [styles['list-item']]: true,
            [styles['right-list-item']]: true
          })}
        >
          <Tooltip
            placement="topLeft"
            title={renderItemTooltipTitle(ele)}
          >
            <span className={styles.itemName}>
              {renderItemLabel(ele)}
              <span
                className={styles.removeIcon}
                onClick={() => onChange(ele, false)}
              >
                <CloseCircleFilled />
              </span>
            </span>
          </Tooltip>
        </li>
      )}
      footer={typeof footer === 'function' ? footer('right') : footer}
      {...rest}
    />
  )
}