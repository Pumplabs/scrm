import React, { useImperativeHandle, forwardRef, Fragment } from 'react'
import { Select, Spin, Empty } from 'antd';
import useDebounce from './useDebounce'
import { getUserByDepId } from 'services/modules/userManage'

const { Option } = Select;

/**
 * 
 * @param {function(data)} renderItem 渲染选项 
 * @param {string} emptyDesc 无数据文案
 * @returns 
 */
function DebounceSelect ({ renderItem, emptyDesc, request, ...props }, ref) {
  const { onSearch, onPopupScroll, optionList, fetching } = useDebounce({
    request: request ? request : getUserByDepId
  })
  useImperativeHandle(ref, () => ({}))
  return (
    <Select
      showSearch={true}
      filterOption={false}
      onSearch={onSearch}
      onPopupScroll={onPopupScroll}
      loading={fetching}
      notFoundContent={fetching ? <Spin size="small" /> : <Empty description={emptyDesc} />}
      allowClear={true}
      {...props}
    >
      {
        optionList.map((ele, idx) => {
          if (typeof renderItem === 'function') {
            return <Fragment key={idx}>{renderItem(ele)}</Fragment>
          }
          return <Option
            value={idx}
            key={idx}
          >{idx}</Option>
        })
      }
    </Select>
  );
}

const WrapDebounceSelect = forwardRef(DebounceSelect)
WrapDebounceSelect.Option = Select.Option
export default WrapDebounceSelect