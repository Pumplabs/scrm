import { Input } from 'antd'
import cls from 'classnames'
import styles from './index.module.less'

export default ({ value, maxLength, wrapStyle, ...rest }) => {
  const count = typeof value === 'string' ? value.length : 0
  return (
    <div
      className={styles.inputWrap}
      style={wrapStyle}
    >
      <Input.TextArea
        className={styles.inputEle}
        value={value}
        maxLength={maxLength}
        bordered={false}
        {...rest}
      />
      {maxLength ? (
        <div className={cls({
          [styles.tips]: true,
        })}>{count}/{maxLength}</div>
      ) : null}
    </div>
  )
}