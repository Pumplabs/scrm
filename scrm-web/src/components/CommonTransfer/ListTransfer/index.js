import { useState, useMemo } from 'react'
import cls from 'classnames'
import { merge } from 'lodash'
import { LeftCol, RightCol } from '../TransferCol'
import styles from './index.module.less'

/**
 * @param {Array<Object>} dataSource 数据源
 * @param {function} onChange
 * @param {Array<String>} selectedKeys
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
  const [searchText, setSearchText] = useState('')
  const isDefinedValue = typeof defineKeys !== 'undefined'
  const selfSelectedKeys = isDefinedValue ? defineKeys : selectedKeys
  
  const handleChange = (item, checked) => {
    const nextKeys = checked ? [...selfSelectedKeys, item[valueKey]] : selfSelectedKeys.filter(ele => ele !== item[valueKey])
    if (typeof onChange === 'function') {
      onChange(nextKeys)
    }
    if (!isDefinedValue) {
      setSelectedKeys(nextKeys)
    }
  }

  const onCheckAll = (e) => {
    const checked = e.target.checked
    setSelectedKeys(checked ? allKeys : [])
  }

  const onReset = () => {
    setSelectedKeys([])
    if (typeof onChange === 'function') {
      onChange([])
    }
  }

  const onSearch = (e) => {
    const text = e.target.value
    setSearchText(text)
  }

  const selectedList = useMemo(() => dataSource.filter(ele => selfSelectedKeys.includes(ele[valueKey])), [dataSource, valueKey, selfSelectedKeys])

  const dataCount = dataSource.length
  const selectedCount = selfSelectedKeys.length
  const checkAllStatus = useMemo(() => {
    return {
      checked: dataCount > 0 && selectedCount > 0 && selectedCount === dataCount,
      indeterminate: dataCount > 0 && selectedCount > 0 && selectedCount !== dataCount
    }
  }, [dataCount, selectedCount])

  const allKeys = useMemo(() => {
    return dataSource.map(ele => ele[valueKey])
  }, [dataSource, valueKey])

  const list = useMemo(() => {
    return searchText ? dataSource.filter(ele => ele[titleKey].includes(searchText)) : dataSource
  }, [dataSource, searchText, titleKey])

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
          selectedKeys={selfSelectedKeys}
          dataSource={list}
          total={list.length}
          fieldNames={itemFieldNames}
          checkAllStatus={checkAllStatus}
          onCheckAll={onCheckAll}
          showSearch={showSearch}
          onSearch={onSearch}
          onChange={handleChange}
        />
        <RightCol
          total={selectedList.length}
          fieldNames={itemFieldNames}
          onReset={onReset}
          onChange={handleChange}
          dataSource={selectedList}
        />
      </div>
    </div>
  )
}
