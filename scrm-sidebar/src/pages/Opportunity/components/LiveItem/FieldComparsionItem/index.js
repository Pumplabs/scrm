import { useMemo } from 'react'
import cls from 'classnames'
import { formatNumber } from 'src/utils'
import styles from './index.module.less'
const FieldItem = ({ value = 0, className, isNum = false }) => {
  return (
    <span
      className={cls({
        [styles['field-item']]: true,
        [className]: className,
      })}>
      {isNum ? (
        <>
          <span className={styles['field-sign']}>￥</span>
          <span>{formatNumber(value)}</span>
        </>
      ) : (
        <span>{value}</span>
      )}
    </span>
  )
}
const NUM_FIELDS = ['预计金额']
// 金额
const FieldUpdateItem = ({ beforeValue = 0, afterValue = 0, fieldName }) => {
  const isNum = useMemo(() => {
    return NUM_FIELDS.includes(fieldName)
  }, [fieldName])
  return (
    <>
      <FieldItem
        className={cls({
          [styles['before-field']]: true,
        })}
        isNum={isNum}
        value={beforeValue}
      />
      <span> --&gt;</span>
      <FieldItem
        className={cls({
          [styles['after-field']]: true,
        })}
        isNum={isNum}
        value={afterValue}
      />
    </>
  )
}

export default FieldUpdateItem