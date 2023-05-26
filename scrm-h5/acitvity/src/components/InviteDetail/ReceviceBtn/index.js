import cls from 'classnames'
import styles from './index.module.less'
const ReceviceBtn = ({ disabled, children, ...rest }) => {
  return (
    <span
      className={cls({
        [styles['receiver-btn']]: true,
        [styles['disabeld-btn']]: disabled,
      })}
      {...rest}>
      {children}
    </span>
  )
}
export default ReceviceBtn