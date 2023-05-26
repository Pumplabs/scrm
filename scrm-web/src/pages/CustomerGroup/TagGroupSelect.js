import React, { forwardRef, useImperativeHandle } from 'react'
import { Select } from 'antd'
import DebounceSelect from 'components/DebounceSelect'
import { GetGroupChatTagGroupList } from 'services/modules/groupChatTag'

const { Option, OptGroup } = Select;
export default forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({}))
  return (
    <DebounceSelect
      allowClear={true}
      placeholder="全部"
      emptyDesc="未搜到相关标签哦~"
      mode="multiple"
      maxTagCount={2}
      request={(pager, {name}) => GetGroupChatTagGroupList(pager, {keyword:name})}
      renderItem={
        (ele) => {
          return (
            <OptGroup label={ele.name}>
              {ele.tags.map(ele => (
                <Option
                  value={ele.id}
                  key={ele.id}
                >{ele.name}</Option>
              ))}
            </OptGroup>
          )
        }
      }
      {...props}
    >
    </DebounceSelect>
  )
})
