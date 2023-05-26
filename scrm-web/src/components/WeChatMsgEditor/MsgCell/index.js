import { useState, useEffect } from 'react'
import { LinkOutlined, PlayCircleOutlined } from '@ant-design/icons'
import cls from 'classnames'
import { isEmpty } from 'lodash'
import ExpandCell from 'components/ExpandCell'
import { getMsgList } from 'components/WeChatMsgEditor/utils'
import styles from './index.module.less'
import { Tooltip } from 'antd'

/**
 * @param {Function} onExpand 点击展开
 * @param {String} ninameLabel
 */
export default (props) => {
  const [mediaList, setMsgArr] = useState([])
  const {
    className,
    data = {},
    onExpand,
    maxHeight = 44,
    ninameLabel,
    ...rest
  } = props
  const dataJson = JSON.stringify(data)
  const hasDefinedExpandFn = typeof onExpand === 'function'
  const getData = async () => {
    const arr = await getMsgList(data, '', ninameLabel)
    setMsgArr(arr)
  }

  useEffect(() => {
    if (isEmpty(data)) {
      setMsgArr([])
    } else {
      getData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataJson])

  const count = mediaList.length
  const onToggleShow = (isExpand) => {
    if (isExpand && hasDefinedExpandFn) {
      onExpand(mediaList)
    }
  }
  return (
    <div
      className={cls({
        [styles['msg-cell']]: true,
        [className]: className,
      })}
      {...rest}>
      <p className={styles['count-statics']}>[共{count}条]</p>
      <ExpandCell
        maxHeight={maxHeight}
        fieldNames={{
          expand: '展开全部',
        }}
        onToggleShow={hasDefinedExpandFn ? onToggleShow : undefined}>
        <MediaContent mediaList={mediaList} />
      </ExpandCell>
    </div>
  )
}
const MediaContent = ({ mediaList = [] }) => {
  return (
    <>
      {mediaList.map((ele, idx) => {
        switch (ele.type) {
          case 'app':
            return <AppCell data={ele.content} key={idx} />
          case 'img':
            return <ImgCell data={ele.content} key={idx} />
          case 'link':
            return <LinkCell data={ele.content} key={idx} />
          case 'myLink':
            return (
              <LinkCell
                data={{
                  ...ele.content,
                  name: ele.content.title,
                  info: ele.content.description,
                }}
                key={idx}
              />
            )
          case 'video':
            return <VideoCell data={ele.content} key={idx} />
          case 'text':
            return <TextCell text={ele.text} key={idx} />
          default:
            return null
        }
      })}
    </>
  )
}

const AppCell = ({ data = {}, style = {} }) => {
  const src = data.file && data.file[0] ? data.file[0].thumbUrl : ''
  return (
    <div
      style={style}
      className={cls({
        [styles['app-cell']]: true,
        [styles['content-cell']]: true,
      })}>
      <span>{data.name}</span>
      <div>
        <img alt="" src={src} className={styles['app-cover']} />
      </div>
    </div>
  )
}

const TextCell = ({ style, text }) => {
  return (
    <div style={style} className={styles['content-cell']}>
      {text}
    </div>
  )
}
const ImgCell = ({ style, data = {} }) => {
  const src = data.file && data.file[0] ? data.file[0].thumbUrl : ''
  return (
    <div
      className={cls({
        [styles['imgCell']]: true,
        [styles['content-cell']]: true,
      })}
      style={style}>
      <img alt="" src={src} className={styles['imgCell-img']} />
    </div>
  )
}

const VideoCell = ({ style, data = {} }) => {
  const fileName = data.file && data.file[0] ? data.file[0].fileName : ''
  const name = data.name  ? data.name : fileName
  return (
    <div className={styles['video-cell']}>
      <PlayCircleOutlined className={styles['video-icon']} />
      <Tooltip title={name} placement="topLeft">
        <span className={styles['video-name']}>{name}</span>
      </Tooltip>
    </div>
  )
}
export const LinkCell = ({ style, data = {} }) => {
  const src = data.file && data.file[0] ? data.file[0].thumbUrl : ''
  return (
    <div
      className={cls({
        [styles['linkMsg-cell']]: true,
        [styles['content-cell']]: true,
      })}
      style={style}>
      <div
        className={cls({
          [styles['linkMsg-cover']]: true,
        })}>
        {src ? (
          <img src={src} alt="" className={styles['link-img']} />
        ) : (
          <div className={styles['link-icon']}>
            <LinkOutlined />
          </div>
        )}
      </div>
      <div className={styles['link-info']}>
        <p
          className={cls({
            [styles['link-text']]: true,
            [styles['link-title']]: true,
          })}>
          {data.name}
        </p>
        <p
          className={cls({
            [styles['link-text']]: true,
            [styles['link-desc']]: true,
          })}>
          {data.info}
        </p>
      </div>
    </div>
  )
}
