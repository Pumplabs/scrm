import { useEffect, useMemo, useState } from 'react'
import cls from 'classnames'
import MsgLinkItem from './components/LinkItem'
import MsgAppItem from './components/AppItem'
import MsgImgItem from './components/ImgItem'
import MsgTextItem from './components/TextItem'
import VideoItem from './components/VideoItem'
import UserAvatar from './components/UserAvatar'
import { ATTACH_TYPE_EN_VAL } from '../../constants'
import { getMsgList } from '../../utils'
import styles from './index.module.less'

/**
 * @param {array<object>} mediaList
 * @param {function} getItemData
 */
export default ({ mediaList, className, getItemData, msg, ninameLabel, ...rest }) => {
  const [msgList, setMsgList] = useState([])
  
  const isDefinedMsg = mediaList !== undefined

  const msgStr = useMemo(() => {
    return JSON.stringify(msg)
  }, [msg])

  const setMsgContent = async () => {
    const arr = await getMsgList(msg, '', ninameLabel)
    setMsgList(arr)
   }
   
   useEffect(() => {
     if (!isDefinedMsg) {
      setMsgContent()
     }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [msgStr, isDefinedMsg])
 
  const msgDataList = isDefinedMsg && Array.isArray(mediaList) ? mediaList : msgList
  return (
    <div
      className={cls({
        [styles.showcaseSection]: true,
        [className]: className
      })}
      {...rest}
    >
      <div
        className={cls({
          [styles.msgContainer]: true,
        })}
      >
        {
          msgDataList.map((ele, idx) => (
            <MsgItem
              key={idx}
              data={ele}
              getItemData={getItemData}
            />
          ))
        }
      </div>
    </div>
  )
}
/**
 * 
 * @param {boolean} isSendType 是否为发送消息 
 * @returns 
 */
export const MsgItem = ({ data, isSendType, getItemData }) => {
  const handleDefaultItemData = (data) => {
    const { type, content = {} } = data
    const coverFile = getFile(content.file)
    switch (type) {
      case 'text':
        return {
          text: data.text || ''
        }
      case 'img':
        return {
          name: content.name,
          thumbUrl: coverFile.thumbUrl
        }
      case 'link':
        return {
          thumbUrl: coverFile.thumbUrl,
          name: content.name,
          info: content.info,
        }
      case 'app':
        return {
          thumbUrl: coverFile.thumbUrl,
          name: content.name,
        }
      case 'myLink':
        return {
          thumbUrl: coverFile.thumbUrl,
          name: content.title,
          info: content.description,
        }
      case ATTACH_TYPE_EN_VAL.VIDEO:
        return {
          name: content.name || coverFile.name,
          thumbUrl: coverFile.thumbUrl
        }
      default:
        return {}
    }
  }

  const itemProps = {
    ...(typeof getItemData === 'function' ? getItemData(data) : handleDefaultItemData(data)),
  }

  const renderContent = () => {
    const { type } = data
    switch (type) {
      case 'text':
        return <MsgTextItem {...itemProps} />
      case 'img':
        return <MsgImgItem {...itemProps} />
      case 'link':
      case 'myLink':
        return <MsgLinkItem {...itemProps} />
      case 'app':
        return <MsgAppItem {...itemProps} />
      case ATTACH_TYPE_EN_VAL.VIDEO:
        return <VideoItem {...itemProps}/>
      default:
        return null
    }
  }

  if (data.type === 'text' && !itemProps.text) {
    return null
  }
  return (
    <div className={
      cls({
        [styles.msgItemWrap]: true,
        [styles.sendMsgItemWrap]: isSendType
      })
    }>
      <UserAvatar className={styles.userIcon} />
      <div className={cls({
        [styles.msgContent]: true,
        [styles[`${data.type}-msgContent`]]: true
      })}>
        {renderContent(data)}
      </div>
    </div>
  )
}

const getFile = (files) => {
  return Array.isArray(files) && files.length ? files[0] : {}
}