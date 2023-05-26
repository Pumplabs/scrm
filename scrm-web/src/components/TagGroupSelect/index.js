import React, { forwardRef, useImperativeHandle, useMemo } from 'react'
import { Select } from 'antd'
import DebounceSelect from 'components/DebounceSelect'
import urlConfig from './urlConfig'

const { Option, OptGroup } = Select;

const TagGroupSelect = forwardRef((props, ref) => {
  const { valueKey = 'extId', tagType = 'customer', ...rest } = props
  useImperativeHandle(ref, () => ({}))

  const configItem = useMemo(() => {
    const type = Reflect.has(urlConfig, tagType) ? tagType : 'customer'
    return urlConfig[type]
  }, [tagType])

  const requestFn = (pager, params) => {
    const par = typeof configItem.formatParams === 'function' ? configItem.formatParams(params) : params
    return configItem.list(pager, par)
  }
  return (
    <DebounceSelect
      request={requestFn}
      allowClear={true}
      placeholder="全部"
      emptyDesc="未搜到相关标签哦~"
      mode="multiple"
      maxTagCount={2}
      renderItem={
        (ele) => {
          const tags = Array.isArray(ele.tags) ? ele.tags : []
          return (
            <OptGroup
              label={ele.name}
              key={ele.id}
            >
              {tags.map(ele => (
                <Option
                  value={ele.id}
                  key={ele.id}
                >{ele.name}</Option>
              ))}
            </OptGroup>
          )
        }
      }
      {...rest}
    >
    </DebounceSelect>
  )
})

export default TagGroupSelect

