import { message, Radio } from 'antd'
import cls from 'classnames'
import { PlayCircleOutlined } from '@ant-design/icons'
import { MATERIAL_TYPE_EN_VALS } from 'pages/SaleOperations/constants'
import LinkItem from 'pages/SaleOperations/TrackMaterial/LinkItem'
import FileIcon from 'pages/SaleOperations/TrackMaterial/Files/FileIcon'
import styles from './index.module.less'

const LinkList = ({
  dataSource = [],
  selectedKeys,
  onChange,
  disabled,
  uniqKey,
}) => {
  const getKeyStr = (item) => {
    if (typeof uniqKey === 'function') {
      return uniqKey(item)
    } else {
      return item[uniqKey]
    }
  }

  return (
    <>
      {dataSource.map((record) => {
        const keyStr = getKeyStr(record)
        record.uniqKey = keyStr
        const checked = selectedKeys.some((item) => item.uniqKey === keyStr)
        return (
          <div
            key={record.id}
            className={cls({
              [styles['list-item']]: true,
              [styles['list-item-active']]: checked,
              [styles['list-item-disabled']]: disabled,
            })}
            onClick={(e) => {
              if (!disabled || checked) {
                onChange(!checked, record)
              } else {
                message.warning('不能再选啦！')
              }
            }}>
            <Radio
              checked={checked}
              disabled={checked ? false : disabled}
              className={styles['list-item-radio']}
            />
            {renderContentItem(record, record.type)}
          </div>
        )
      })}
    </>
  )
}

const renderContentItem = (record, type) => {
  switch (type) {
    case MATERIAL_TYPE_EN_VALS.ARTICLE:
      return (
        <LinkItem
          title={record.title}
          info={record.summary}
          coverUrl={record.filePath}
        />
      )
    case MATERIAL_TYPE_EN_VALS.FILE:
      return (
        <LinkItem
          title={record.title}
          info={record.summary}
          cover={<FileIcon data={record} />}
        />
      )
    case MATERIAL_TYPE_EN_VALS.LINK:
      return (
        <LinkItem
          title={record.title}
          info={record.summary}
          coverUrl={record.filePath}
        />
      )
    case MATERIAL_TYPE_EN_VALS.VIDEO:
      return (
        <LinkItem
          title={record.title}
          info={record.summary}
          cover={<PlayCircleOutlined style={{ fontSize: 40 }} />}
        />
      )
    default:
      return null
  }
}

export default LinkList
