import cls from 'classnames'
import { PlayCircleOutlined } from '@ant-design/icons'
import styles from './index.module.less'
export default ({ className, data = {}, ...rest }) => {
  const fileName = data.file && data.file[0] ? data.file[0].name : ''
  return (
    <div
      className={cls({
        [styles['msg-item']]: true,
        [styles['video-item']]: true,
        [className]: className,
      })}
      {...rest}>
      <PlayCircleOutlined className={styles['video-icon']} />
      <p className={styles['video-name']}>{data.name || fileName}</p>
    </div>
  )
}
