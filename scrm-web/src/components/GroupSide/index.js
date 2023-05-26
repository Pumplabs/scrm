import { useState, useMemo, Fragment } from 'react'
import cls from 'classnames'
import { Menu, Dropdown, Empty, Spin } from 'antd'
import { PlusCircleOutlined, EllipsisOutlined } from '@ant-design/icons'
import styles from './index.module.less'
const uniqKey = 'id'
/**
 * @param {ReactNode} addonBefore 首项内容
 * @param {Function} renderItemContent 渲染节点内容
 */
export default (props) => {
  const [selectedItemKey, setSelectedItemKey] = useState('')
  const {
    dataSource = [],
    renderItem,
    title,
    renderItemContent,
    selectedKey,
    onSelect,
    itemProps = {},
    addonBefore,
    className,
    loading = false,
    onAdd,
    showAddIcon = true,
    ...rest
  } = props
  const isDefinedKey = typeof selectedKey !== 'undefined'
  const handleSelect = (item) => {
    if (typeof onSelect === 'function') {
      onSelect(item)
    }
    if (!isDefinedKey) {
      setSelectedItemKey(item[uniqKey])
    }
  }
  const _selectedKey = isDefinedKey ? selectedKey : selectedItemKey
  return (
    <div
      className={cls({
        [styles['group-side']]: true,
        [className]: className,
      })}
      {...rest}>
      <div className={styles['group-side-header']}>
        <span className={styles['group-side-title']}>{title}</span>
        {showAddIcon ? (
          <PlusCircleOutlined
            className={cls({
              [styles['group-side-extra']]: true,
              [styles['add-btn']]: true,
            })}
            onClick={onAdd}
          />
        ) : null}
      </div>
      <div className={styles['group-side-body']}>
        <Spin spinning={loading}>
          <ul className={styles['group-ul']}>
            {addonBefore ? (
              <Fragment key="addonBefore">{addonBefore}</Fragment>
            ) : null}
            {dataSource.length ? (
              dataSource.map((item, idx) => {
                return (
                  <ListItem
                    item={item}
                    idx={idx}
                    key={item[uniqKey]}
                    onSelect={handleSelect}
                    activeKey={_selectedKey}
                    uniqKey={uniqKey}
                    renderItem={renderItem}
                    renderItemContent={renderItemContent}
                    itemProps={itemProps}
                  />
                )
              })
            ) : (
              <Empty description="暂时没有数据哦" imageStyle={{ width: 150 }} />
            )}
          </ul>
        </Spin>
      </div>
    </div>
  )
}

const defaultAction = [
  {
    title: '编辑',
    key: 'edit',
  },
  {
    title: '删除',
    key: 'remove',
  },
]

/**
 *
 * @param {Boolean}} preAction 保留action空位
 * @returns
 */
const ListItem = (props) => {
  const {
    item = {},
    idx,
    onSelect,
    activeKey,
    uniqKey,
    renderItem,
    renderItemContent,
    itemProps = {},
    children,
  } = props
  const { onAction, showAction, actions = defaultAction, preAction } = itemProps
  const handleSelect = () => {
    if (typeof onSelect === 'function') {
      onSelect(item, idx)
    }
  }
  const menuActions = useMemo(() => {
    return Array.isArray(actions) ? actions : defaultAction
  }, [actions])

  const menu = (
    <Menu>
      {menuActions.map((actionItem) => (
        <Menu.Item
          key={actionItem.key}
          onClick={() => {
            if (typeof onAction === 'function') {
              onAction(actionItem.key, item)
            }
          }}>
          {actionItem.title}
        </Menu.Item>
      ))}
    </Menu>
  )
  const shouldShowAction =
    typeof showAction === 'function'
      ? showAction(item, idx)
      : Boolean(showAction)
  const definedLiItem =
    typeof renderItem === 'function' ? renderItem(item, idx) : undefined
  const hasAction = shouldShowAction && menuActions.length > 0
  if (definedLiItem !== undefined) {
    return definedLiItem
  }
  return (
    <li
      className={cls({
        [styles['group-item']]: true,
        [styles['group-active-item']]: `${item[uniqKey]}` === `${activeKey}`,
        [styles['group-has-actions']]: preAction ? preAction : hasAction,
      })}
      key={item[uniqKey]}
      onClick={handleSelect}>
      {hasAction ? (
        <Dropdown overlay={menu}>
          <EllipsisOutlined className={styles['actions-icon']} />
        </Dropdown>
      ) : null}
      {typeof renderItemContent === 'function'
        ? renderItemContent(item, idx)
        : children}
    </li>
  )
}
