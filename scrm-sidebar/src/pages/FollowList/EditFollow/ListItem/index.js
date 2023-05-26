import cls from 'classnames'
import styles from './index.module.less'

const Item = ({ children, className }) => {
  return (
    <li
      className={cls({
        [styles['user-list-item']]: true,
        [className]: className,
      })}>
      {children}
    </li>
  )
}
const List =  ({ className, children }) => {
  return <ul className={cls({
    [styles['user-ul']]: true,
    [className]: className
  })}>{children}</ul>
}
List.Item = Item
export default List