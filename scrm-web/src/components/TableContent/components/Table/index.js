import { Fragment, useMemo } from 'react'
import { Table, Space, Divider, Dropdown, Menu } from 'antd'
import { isEmpty } from 'lodash'
import cls from 'classnames'
import { CaretDownOutlined } from '@ant-design/icons'
import StatusCell from '../StatusCell'
import styles from './index.module.less'

const getActionCell = (ele, record, idx) => {
  if (typeof ele.render === 'function') {
    return ele.render(record)
  }
  const isDisabled =
    typeof ele.disabled === 'function' ? ele.disabled(record) : ele.disabled
  return (
    <span
      key={idx}
      className={cls({
        [ele.className]: ele.className,
        [styles['cell-disabled-action']]: isDisabled,
        [styles['cell-action']]: true,
      })}
      onClick={() => {
        if (typeof ele.onClick === 'function' && !isDisabled) {
          ele.onClick(record)
        }
      }}>
      {idx > 0 && <Divider type="vertical" />}
      {ele.title}
    </span>
  )
}

const getFilterActions = (actions, record) => {
  let arr = []
  actions.forEach((ele, idx) => {
    if (ele.visible !== undefined) {
      const visible =
        typeof ele.visible === 'function'
          ? ele.visible(record, idx)
          : Boolean(ele.visible)
      if (!visible) {
        return
      }
    }
    arr = [...arr, ele]
  })
  return arr
}

const renderAction = (actions, { maxActionCount, ...colData }) => {
  return {
    fixed: 'right',
    title: '操作',
    zIndex: 1,
    width: actions.length * 80,
    className: styles['right-col'],
    render: (record) => {
      const actionsArr = getFilterActions(actions, record)
      const prefixCells = maxActionCount
        ? actionsArr.slice(0, maxActionCount)
        : actionsArr
      const drowdownCells = maxActionCount
        ? actionsArr.slice(maxActionCount)
        : []
      const menu = (
        <Menu>
          {drowdownCells.map((ele, idx) => {
            return (
              <Menu.Item
                className={styles.actionMenuItem}
                key={idx}
                onClick={() => {
                  if (typeof ele.onClick === 'function') {
                    ele.onClick(record)
                  }
                }}>
                {ele.title}
              </Menu.Item>
            )
          })}
        </Menu>
      )
      if (!actionsArr.length) {
        return null
      }
      return (
        <span>
          {prefixCells.map((ele, idx) => {
            return (
              <Fragment key={idx}>{getActionCell(ele, record, idx)}</Fragment>
            )
          })}
          {drowdownCells.length ? (
            <Dropdown overlay={menu}>
              <span style={{ wordBreak: 'keep-all', whiteSpace: 'nowrap' }}>
                <Divider type="vertical" />
                <span className={styles['more-action']}>更多</span>
                <CaretDownOutlined className={styles.dropdownArrow} />
              </span>
            </Dropdown>
          ) : null}
        </span>
      )
    },
    ...colData,
  }
}

const ToolButton = ({ toolBar, ...props }) => {
  const existTool = Array.isArray(toolBar)
  if (!existTool) {
    return null
  }
  return (
    <div className={styles.tableBtns} {...props}>
      <Space>{toolBar}</Space>
    </div>
  )
}

const getOptionsColumn = (data) => {
  const { options, ...rest } = data
  return {
    ...rest,
    render: (val) => {
      return <StatusCell options={options} val={val} />
    },
  }
}
export default (tableProps) => {
  const {
    name,
    toolBar,
    actions,
    columns = [],
    className,
    title,
    operationCol = {},
    pagination,
    ...props
  } = tableProps

  const tableColumns = useMemo(() => {
    const handleColumns = (columns) => {
      return columns.map((ele) => {
        if (Reflect.has(ele, 'options')) {
          return getOptionsColumn(ele)
        } else {
          return ele
        }
      })
    }
    if (!actions || (Array.isArray(actions) && actions.length === 0)) {
      return handleColumns(columns)
    } else {
      return [...handleColumns(columns), renderAction(actions, operationCol)]
    }
  }, [columns, actions, operationCol])

  const renderTableTitle = (...args) => {
    if (typeof title === 'function') {
      return title(...args)
    }
    return (
      <Fragment>
        <ToolButton
          toolBar={toolBar}
          className={cls({
            [styles['table-toolbar']]: !definedTitle,
            [styles['title-toolbar']]: definedTitle,
          })}
        />
        <div style={{ lineHeight: '32px' }}>{name}</div>
      </Fragment>
    )
  }
  const hasTitle = name || !isEmpty(toolBar) || title
  const definedTitle = typeof title === 'function'
  return (
    <Table
      size="middle"
      rowKey="id"
      columns={tableColumns}
      className={cls({
        [className]: className,
        [styles['table']]: true,
        [styles['hasname-table']]: name,
        [styles['table-notitle']]: !definedTitle && !name,
      })}
      title={hasTitle ? renderTableTitle : null}
      {...props}
      pagination={
        pagination
          ? {
              showTotal: (total) => `共${total}条`,
              showSizeChanger: false,
              ...pagination,
            }
          : pagination
      }
    />
  )
}
