import { useState, useMemo } from 'react'
import { SearchOutlined, CloseCircleFilled } from '@ant-design/icons'
import { Empty, Checkbox, Input, Tooltip, Pagination } from 'antd'
import cls from 'classnames'
import { debounce, merge } from 'lodash'
import TransferCol, { LeftCol, RightCol } from '../TransferCol'
import usePagedHook from './usePagedHook'
import { modifyList, getListByPager } from './utils'
import styles from './index.module.less'

/**
 * @param {Array<Object>} dataSource 数据源
 * @param {function} onChange
 * @param {Array<Object>} selectedKeys
 * @param {Object} fieldNames 自定义字段属性
 * @param {Boolean} itemIsValue 是否将整个选项作为值
 */

const defaultFieldNames = {
  title: 'name',
  value: 'id'
}

export default (props) => {
  const { dataSource = [], pagination = {}, request, onChange, selectedKeys: defineKeys, fieldNames = {}, showSearch = true, className, footer, ...rest } = props
  const itemFieldNames = useMemo(() => {
    return merge(defaultFieldNames, fieldNames)
  }, [fieldNames])
  const { title: titleKey, value: valueKey } = itemFieldNames

  const [selectedKeys, setSelectedKeys] = useState([])
  const [pager, setPager] = useState({current: 1, pageSize: 1})
  const isDefinedValue = typeof defineKeys !== 'undefined'
  const selfSelectedKeys = isDefinedValue ? defineKeys : selectedKeys
  const { dataSource: leftList, pagination: leftPager, onChange: onLeftPagerChange, onSearch } = usePagedHook({
    dataSource,
    pagination,
    titleKey,
    request
  })

  const handleChange = (item, checked) => {
    const nextKeys = modifyList(selfSelectedKeys, item, checked, valueKey, true)
    if (typeof onChange === 'function') {
      onChange(nextKeys)
    }
    if (!isDefinedValue) {
      setSelectedKeys(nextKeys)
    }
  }

  const onReset = () => {
    setSelectedKeys([])
    if (typeof onChange === 'function') {
      onChange([])
    }
  }

  const leftKeys = useMemo(() => {
    return selfSelectedKeys.map(ele => ele[valueKey])
  }, [valueKey, selfSelectedKeys])

  // 右侧数据
  const rightList = useMemo(() => {
    return getListByPager(pager, selfSelectedKeys)
  }, [pager, selfSelectedKeys])

  const onRightPageChange = (current, pageSize) => {
    setPager({
      current,
      pageSize
    })
  }

  return (
    <div style={{ width: "100%" }}>
      <div
        className={cls({
          [styles.transferContainer]: true,
          [className]: className,
          'ant-transfer': true
        })}
        {...rest}
      >
        <LeftCol
          title={`${leftKeys.length}/${leftPager.total}项`}
          selectedKeys={leftKeys}
          dataSource={leftList}
          total={leftPager.total}
          fieldNames={itemFieldNames}
          showSearch={showSearch}
          itemIsValue={true}
          onSearch={onSearch}
          onChange={handleChange}
          footer={
            <div style={{ textAlign: "right", padding: "8px 0px" }}>
              <Pagination
                {...leftPager}
                size="small"
                onChange={onLeftPagerChange}
              />
            </div>
          }
        />
        <RightCol
          total={selectedKeys.length}
          fieldNames={itemFieldNames}
          onReset={onReset}
          onChange={handleChange}
          dataSource={rightList}
          footer={
            <div style={{ textAlign: "right", padding: "8px 0px"}}>
              <Pagination
                total={selectedKeys.length}
                current={pager.current}
                pageSize={pager.pageSize}
                size="small"
                onChange={onRightPageChange}
              />
            </div>
          }
        />
      </div>
    </div>
  )
}
