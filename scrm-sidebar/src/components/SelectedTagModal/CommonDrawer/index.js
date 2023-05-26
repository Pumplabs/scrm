import { Drawer } from 'antd'
import cls from 'classnames'
import { LeftOutlined } from '@ant-design/icons'
import styles from './index.module.less'

/**
 * 抽屉顶部
 * @returns
 */
const DrawerHeader = ({ title, leftTitle, right, onClose }) => {
  return (
    <div className={styles['drawer-header']}>
      <div className={styles['drawer-header-left']} onClick={onClose}>
        <LeftOutlined />
        <span className={styles['left-title']}>{leftTitle}</span>
      </div>
      <p className={styles['header-title']}>{title}</p>
      <div className={styles['drawer-header-right']}>{right}</div>
    </div>
  )
}
export default ({
  children,
  headerStyle = {},
  className,
  title,
  leftTitle,
  right,
  ...props
}) => {
  return (
    <Drawer
      headerStyle={{ position: 'relative', padding: 0, ...headerStyle }}
      title={
        <DrawerHeader
          onClose={props.onCancel}
          title={title}
          leftTitle={leftTitle}
          right={right}
        />
      }
      placement="right"
      className={cls({
        [styles['my-drawer']]: true,
        [className]: className,
      })}
      width="100%"
      closable={false}
      {...props}>
      <div className={styles['drawer-body']}>{children}</div>
    </Drawer>
  )
}
