import React, { forwardRef, useImperativeHandle } from 'react'
import { Select } from 'antd'
import DebounceSelect from 'components/DebounceSelect'
import { GetCategoryTableList } from 'services/modules/productCategory'

const { Option } = Select
export default forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({}))
  return (
    <DebounceSelect
      allowClear={true}
      placeholder="全部"
      emptyDesc="未搜到相关分类哦~"
      optionLabelProp="name"
      request={GetCategoryTableList}
      renderItem={(ele) => {
        return (
          <Option key={ele.id} value={ele.id} name={ele.name}>
            {ele.name}
          </Option>
        )
      }}
      {...props}></DebounceSelect>
  )
})
