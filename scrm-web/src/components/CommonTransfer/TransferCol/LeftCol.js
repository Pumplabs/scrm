import { SearchOutlined } from '@ant-design/icons'
import { Checkbox, Input } from 'antd'
import { debounce } from 'lodash'
import TransferCol from '../TransferCol'
import LeftItem from './LeftItem'

/**
 * @param {Array} dataSource 源数据
 * @param {Array} selectedKeys 选中的值
 * @param {Number} total 总数
 * @param {Function} onChange
 * @param {Object} fieldNames
 * @param {Object} checkAllStatus
 * @param {Boolean} showSearch
 * @param {Object} searchProps
 * @param
 */
export default (props) => {
  const { dataSource, selectedKeys, total = 0, renderLabel, renderTooltipTitle, onCheckAll,itemIsValue, onSearch, onChange, fieldNames = {}, checkAllStatus, showSearch, searchProps = {}, footer, ...rest } = props
  const { title: titleKey, value: valueKey } = fieldNames

  const renderItemLabel = (ele, checked) => {
    if (typeof renderLabel === 'function') {
      return renderLabel('left', ele, checked)
    }
  }

  const handleChange = (...args) => {
    if (typeof onChange === 'function') {
      onChange(...args)
    }
  }

  const handleSearch = (e) => {
    if (typeof onSearch === 'function') {
      onSearch(e)
    }
  }

  const debounceInputChange = debounce(handleSearch, 200)

  const defaultSearchProps = typeof onSearch === 'function' ? {
    onChange: debounceInputChange,
    onPressEnter: handleSearch
  } : {}

  return (
    <TransferCol
      title={
        <Checkbox
          {...checkAllStatus}
          onChange={onCheckAll}
        >
          {selectedKeys.length}/{total}项
        </Checkbox>
      }
      titleExtra={
        showSearch && (
          <Input
            prefix={<SearchOutlined />}
            placeholder="请输入"
            style={{ width: "100%" }}
            {...defaultSearchProps}
            {...searchProps}
          />
        )
      }
      list={dataSource}
      renderItem={ele => {
        const checked = itemIsValue ? selectedKeys.some(item => item[valueKey] === ele[valueKey]) : selectedKeys.includes(ele[valueKey])
        return (
          <LeftItem
            ele={ele}
            checked={checked}
            valueKey={valueKey}
            titleKey={titleKey}
            onChange={handleChange}
            renderLabel={renderItemLabel}
            renderTooltipTitle={renderTooltipTitle}
          />
        )
      }}
      footer={typeof footer === 'function' ? footer('left') : footer}
      {...rest}
    />
  )
}