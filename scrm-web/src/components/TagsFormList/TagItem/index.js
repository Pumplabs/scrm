import React from 'react'
import { Input, Tooltip } from 'antd'
import cls from 'classnames'
import {
  UpCircleOutlined,
  DownCircleOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons'
import styles from './index.module.less'

export const TAG_PREFIX = 'tag_'

/**
 * 
 * @param {*} props 
 * @returns 
 */
const Item = (props) => {
  const { onAction, name, isLast, isFirst, ...rest } = props
  const handleAction = (type) => {
    if (typeof onAction === 'function') {
      onAction(type, rest.value)
    }
  }
  const handleUp = () => {
    handleAction('up')
  }

  const handleTop = () => {
    handleAction('top')
  }
  const handleBottom = () => {
    handleAction('bottom')
  }
  const handleDown = () => {
    handleAction('down')
  }

  const handleAdd = () => {
    handleAction('add')
  }

  const handleRemove = () => {
    handleAction('remove')
  }
  return (
    <div className={styles.tagItem}>
      <Input {...rest} />
      <div className={styles.tagItemAction}>
        <Tooltip title="置顶">
          <VerticalAlignTopOutlined
            onClick={handleTop}
            className={cls({
              [styles.tagItemActionItem]: true,
              [styles['disabled-action']]: isFirst,
            })}
          />
        </Tooltip>
        <Tooltip title="置底">
          <VerticalAlignBottomOutlined
            onClick={handleBottom}
            className={cls({
              [styles.tagItemActionItem]: true,
              [styles['disabled-action']]: isLast,
            })}
          />
        </Tooltip>
        <Tooltip title="上移">
          <UpCircleOutlined
            onClick={handleUp}
            className={cls({
              [styles.tagItemActionItem]: true,
              [styles['disabled-action']]: isFirst,
            })}
          />
        </Tooltip>
        <Tooltip title="下移">
          <DownCircleOutlined
            onClick={handleDown}
            className={cls({
              [styles.tagItemActionItem]: true,
              [styles['disabled-action']]: isLast,
            })}
          />
        </Tooltip>
        <Tooltip title="新增">
          <PlusCircleOutlined
            onClick={handleAdd}
            className={cls({
              [styles.tagItemActionItem]: true,
            })}
          />
        </Tooltip>
        <Tooltip title="删除">
          <MinusCircleOutlined
            onClick={handleRemove}
            className={cls({
              [styles.tagItemActionItem]: true,
            })}
          />
        </Tooltip>
      </div>
    </div>
  )
}

export default Item