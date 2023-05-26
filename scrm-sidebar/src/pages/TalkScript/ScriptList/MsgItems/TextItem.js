import cls from 'classnames'
import styles from './index.module.less'
export default ({ className, text = '',...rest }) => {
  return (
    <div
      className={cls({
        [styles['msg-item']]: true,
        [styles['text-item']]: true,
        [className]: className,
      })}
      {...rest}>
      {text}
    </div>
  )
}
