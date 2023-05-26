import { Radio, message } from 'antd'
import cls from 'classnames'
import ImgItem from '../ImgItem'
import { MATERIAL_TYPE_EN_VALS } from 'pages/SaleOperations/constants'
import styles from './index.module.less'
export default ({
  dataSource = [],
  selectedKeys,
  onChange,
  disabled,
  uniqKey = 'id',
}) => {
  const getKeyStr = (item) => {
    if (typeof uniqKey === 'function') {
      return uniqKey(item)
    } else {
      return item[uniqKey]
    }
  }
  return (
    <ul className={styles['imgs-ul']}>
      {dataSource.map((item) => {
        const keyStr = getKeyStr(item)
        item.uniqKey = keyStr
        const checked = selectedKeys.some(
          (ele) => ele.uniqKey === keyStr
        )
        return (
          <li
            className={cls({
              [styles['imgs-li']]: true,
              [styles['imgs-li-disabled']]: disabled,
              [styles['imgs-check-li']]: checked,
            })}
            key={keyStr}
            onClick={(e) => {
              if (!disabled || checked) {
                onChange(!checked, item)
              } else {
                message.warning('不能再选啦！')
              }
              e.stopPropagation()
            }}>
            <div
              className={styles['radio-ele']}
              onClick={(e) => {
                e.stopPropagation()
              }}>
              <Radio
                checked={checked}
                value={keyStr}
                style={{ marginRight: 0 }}
                disabled={checked ? false : disabled}
                onClick={(e) => {
                  onChange(!checked, item)
                }}
              />
            </div>
            <ImgItem
              src={item.filePath}
              title={item.title}
              imgClassName={styles['img-item']}
              isPoster={item.type === MATERIAL_TYPE_EN_VALS.POSTER}
            />
          </li>
        )
      })}
    </ul>
  )
}
