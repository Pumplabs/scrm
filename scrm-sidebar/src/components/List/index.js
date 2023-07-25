import { forwardRef } from 'react'
import cls from 'classnames'
import { List } from 'antd-mobile'
import styles from './index.module.less'

const MyList = forwardRef((props = {}, ref) => {
  const { theme, className, style = {}, ...rest } = props
  return (
    <List
      ref={ref}
      className={cls({
        [className]: className,
        [styles[`theme-${theme}`]]: theme
      })}
      style={{ '--border-top': 'none', '--border-bottom': 'none', ...style }}
      {...rest}
    ></List>
  )
})
const MyListItem = (props) => {
  const { children, className, ...rest } = props
  return (
    <List.Item
      className={cls({
        [styles['my-list-item']]: true,
        [className]: className,
      })}
      {...rest}>
      {children}
    </List.Item>
  )
}

MyList.Item = MyListItem
export default MyList
