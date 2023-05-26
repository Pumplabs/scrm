import { useState, useRef, useEffect } from 'react'
import cls from 'classnames'
import { PlayCircleFilled } from '@ant-design/icons'
import CommonModal from 'components/CommonModal'
import styles from './index.module.less'

export default ({ visible, data = {}, refresh, ...rest }) => {
  const [isPlay, setIsPlay] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    setIsPlay(false)
    if (!visible) {
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [visible])

  const onPlay = () => {
    setIsPlay(true)
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const onPause = () => {
    setIsPlay(false)
  }

  return (
    <CommonModal
      {...rest}
      destroyOnClose={true}
      footer={null}
      visible={visible}
    >
      <div className={cls({
        [styles['video-player-wrap']]: true,
        [styles['pause']]: !isPlay
      })}
      >
        {
          visible ? (
            <video
            ref={ref => videoRef.current = ref}
            src={data.filePath}
            className={styles['video-ele']}
            controls="controls"
            onPlay={onPlay}
            onPause={onPause}
          />
          ) : null
        }
        {!isPlay ? (
          <PlayCircleFilled className={styles['video-icon']} onClick={onPlay} />
        ) : null}
      </div>
    </CommonModal>
  )
}
