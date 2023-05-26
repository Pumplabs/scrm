import GroupChatCover from 'components/GroupChatCover'
import React, { forwardRef, useImperativeHandle } from 'react'
import { Select } from 'antd'
import DebounceSelect from 'components/DebounceSelect'
import { GetGroupList } from 'services/modules/customerChatGroup'
import styles from './index.module.less'

const { Option } = Select

export default forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({}))
  return (
    <DebounceSelect
      allowClear={true}
      placeholder="全部"
      emptyDesc="未搜到相关群聊哦~"
      mode="multiple"
      maxTagCount={2}
      optionLabelProp="name"
      request={GetGroupList}
      renderItem={
        (ele) => {
          return (
            <Option
              key={ele.extChatId}
              value={ele.extChatId}
              name={ele.name}
            >
              <div className={styles['option-item']}>
                <GroupChatCover
                  className={styles['option-avatar']}
                  width={40}
                  size={28}
                />
                <span>{ele.name}</span>
                <br />
                <span className={styles['owner-text']}>群主：{ele.ownerInfo.name}</span>
              </div>
            </Option>
          )
        }
      }
      {...props}
    >
    </DebounceSelect>
  )
})
