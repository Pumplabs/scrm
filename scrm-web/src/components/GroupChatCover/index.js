import { TeamOutlined } from '@ant-design/icons'
import cls from 'classnames'
import styles from './index.module.less'
export default ({ className, width = 60, size = 48, style = {}, ...rest }) => {
  return (
    <div
      className={
        cls({
          [styles['wrap']]: true,
          [className]: className
        })
      }
      style={{width, height: width, paddingTop: width > size ? (width - size) / 2 : 0 }}
      {...rest}
    >
      <TeamOutlined
        className={styles.icon}
        style={{fontSize: size}}
      />
    </div>
  )
}