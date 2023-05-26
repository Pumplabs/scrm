import cls from 'classnames'
import { PlayCircleOutlined } from '@ant-design/icons'
import styles from '../index.module.less'

const VideoCell = ({ data = {}, ...rest }) => {
  return (
    <div
      className={cls({
        [styles['video-cell']]: true,
        [styles['content-cell']]: true,
      })}
      {...rest}>
      <PlayCircleOutlined className={styles['video-icon']} />
      <p className={styles['video-name']}>{data.name}</p>
    </div>
  )
}
export default VideoCell
