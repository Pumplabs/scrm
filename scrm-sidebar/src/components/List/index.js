import { forwardRef } from 'react'
import cls from 'classnames'
import { List } from 'antd-mobile'
import styles from './index.module.less'

const MyList = forwardRef((props = {}, ref) => {
  return (
    <List
      ref={ref}
      style={{ '--border-top': 'none', '--border-bottom': 'none' }}
      {...props}
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
