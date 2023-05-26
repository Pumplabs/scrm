import { useMemo } from 'react'
import { Dropdown, Menu, Tooltip, Button } from 'antd'
import {
  MinusCircleOutlined,
  EditOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import cls from 'classnames'
import SortableList from './SortableList'
import {
  ATTACH_TYPE_CN_VAL,
  ATTACH_TYPE_EN_VAL,
} from '../../constants'
import { validShouldAddAttach } from '../../valid'
import styles from './index.module.less'

export default (props) => {
  const {
    dataSource = [],
    onEdit,
    onRemove,
    onSelectMenu,
    onChange,
    uniqKey,
    attachmentRules = {},
  } = props

  const onChooseMaterial = () => {
    onClickMenu({ key: 'normalmaterial' })
  }

  const onClickMenu = ({ key }) => {
    if (typeof onSelectMenu === 'function') {
      onSelectMenu(key)
    }
  }

  const { menuOptions, shouldAddAttach } = useMemo(() => {
    const { menuOptions, shouldAddAttach } = validShouldAddAttach(
      dataSource,
      attachmentRules
    )
    return {
      menuOptions,
      shouldAddAttach,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, attachmentRules])

  const menu = (
    <Menu onClick={onClickMenu}>
      {menuOptions.map((ele) => (
        <Menu.Item key={ele.type} disabled={ele.disabled}>
          {ele.name}
        </Menu.Item>
      ))}
    </Menu>
  )
  return (
    <div className={styles.attchmentContainer}>
      <div className={styles.attchmentList}>
        <SortableList
          dataSource={dataSource}
          onChange={onChange}
          uniqKey={uniqKey}
          renderItem={(ele, idx) => (
            <MediaItem
              data={ele}
              key={idx}
              onEdit={() => onEdit(ele, idx + 1)}
              onRemove={() => onRemove(ele, idx)}
            />
          )}
        />
      </div>
      {shouldAddAttach ? (
        <div className={styles['attchment-toolbar']}>
          <Dropdown overlay={menu} placement="topLeft">
            <Button style={{ marginRight: 8 }} icon={<PlusOutlined />}>
              自定义添加附件
            </Button>
          </Dropdown>
          <Button
            type="text"
            className={styles['link-btn']}
            onClick={onChooseMaterial}>
            从素材库选
          </Button>
        </div>
      ) : null}
    </div>
  )
}

const MediaItem = ({ data, onEdit, onRemove }) => {
  const handleEdit = () => {
    if (typeof onEdit === 'function') {
      onEdit(data)
    }
  }
  const handleRemove = () => {
    if (typeof onRemove === 'function') {
      onRemove(data)
    }
  }

  const getFile = (file) => {
    return Array.isArray(file) && file.length ? file[0] : {}
  }

  const text = useMemo(() => {
    const renderText = () => {
      const { type, content = {} } = data
      const { name: coverFileName = '' } = getFile(content.file)
      switch (type) {
        case ATTACH_TYPE_EN_VAL.LINK:
          return content.name ? content.name : content.href
        case ATTACH_TYPE_EN_VAL.IMAGE:
          return content.name ? content.name : coverFileName
        case ATTACH_TYPE_EN_VAL.MINI_APP:
          return content.name
        case ATTACH_TYPE_EN_VAL.TEXT:
          return content.name || data.text
        case ATTACH_TYPE_EN_VAL.TRACK_MATERIAL:
          return content.title
        case ATTACH_TYPE_EN_VAL.VIDEO:
          return content.name || coverFileName
        default:
          return ''
      }
    }
    return renderText()
  }, [data])

  return (
    <div className={styles.mediaItem}>
      <MinusCircleOutlined
        className={cls([styles.mediaAction, styles.removeIcon])}
        onClick={handleRemove}
        onPointerDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
      />
      <Tooltip title={text} placement="topLeft">
        <span className={styles.typeName}>{ATTACH_TYPE_CN_VAL[data.type]}</span>
        <span className={styles.content}>{text}</span>
      </Tooltip>
      {data.type !== ATTACH_TYPE_EN_VAL.TRACK_MATERIAL ? (
        <EditOutlined
          className={cls([styles.mediaAction, styles.editIcon])}
          onClick={handleEdit}
          onPointerDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        />
      ) : null}
    </div>
  )
}
