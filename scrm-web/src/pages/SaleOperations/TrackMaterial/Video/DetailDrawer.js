import React, { useEffect, useState } from 'react'
import { PlayCircleFilled } from '@ant-design/icons'
import CommonDrawer from 'components/CommonDrawer'
import TagCell from 'components/TagCell'
import DescriptionsList from 'components/DescriptionsList'
import VideoPlayerModal from './components/VideoPlayerModal'
import styles from './index.module.less'

export default (props) => {
  const { data = {}, onOk, visible, ...rest } = props
  const [videoVisible, setVideoVisible] = useState(false)
  useEffect(() => {
    if (!visible) {
      setVideoVisible(false)
    }
  }, [visible])
  const onVideoModalCancel = () => {
    setVideoVisible(false)
  }
  const onPlay = () => {
    setVideoVisible(true)
  }
  return (
    <CommonDrawer visible={visible} footer={null} {...rest}>
      <VideoPlayerModal
        title={data.title}
        visible={videoVisible}
        data={data}
        onCancel={onVideoModalCancel}
      />
      <DescriptionsList.Item label="视频">
        <VideoItem src={data.filePath} onPlay={onPlay} />
      </DescriptionsList.Item>
      <DescriptionsList.Item label="视频标题">
        {data.title}
      </DescriptionsList.Item>
      <DescriptionsList.Item label="视频描述">
        {data.description}
      </DescriptionsList.Item>
      <DescriptionsList.Item label="素材标签">
        <TagCell dataSource={data.mediaTagDetailList} maxHeight="auto" />
      </DescriptionsList.Item>
      <DescriptionsList.Item label="动态通知">
        {data.hasInform ? '开启' : '关闭'}
      </DescriptionsList.Item>
      <DescriptionsList.Item label="客户标签">
        <TagCell dataSource={data.wxTagDetailList} maxHeight="auto" />
      </DescriptionsList.Item>
      <DescriptionsList.Item label="发送次数">
        {data.sendNum ? data.sendNum : 0}
      </DescriptionsList.Item>
      <DescriptionsList.Item label="浏览次数">
        {data.lookNum ? data.lookNum : 0}
      </DescriptionsList.Item>
    </CommonDrawer>
  )
}

const VideoItem = ({ onPlay, src }) => {
  return (
    <div className={styles['video-item']}>
      <video src={src} className={styles['video-el']} />
      <PlayCircleFilled className={styles['video-icon']} onClick={onPlay} />
    </div>
  )
}
