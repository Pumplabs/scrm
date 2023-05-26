import GroupChatCover from 'components/GroupChatCover'
import React, { forwardRef, useImperativeHandle } from 'react'
import { Select } from 'antd'
import DebounceSelect from 'components/DebounceSelect'
import { UNSET_GROUP_NAME } from 'src/utils/constants'
import { GetGroupList } from 'services/modules/customerChatGroup'
import styles from './index.module.less'

const { Option } = Select
export default forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({}))
  return (
    <DebounceSelect
      allowClear={true}
      placeholder="全部"
      emptyDesc="未搜到相关员工哦~"
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
              name={ele.name || UNSET_GROUP_NAME}
            >
              <div className={styles['option-item']}>
                <GroupChatCover
                  className={styles['option-avatar']}
                  width={40}
                  size={28}
                />
                <span>{ele.name || UNSET_GROUP_NAME}</span>
                <br />
                <span className={styles['owner-text']}>群主：{ele.ownerInfo.name}</span>
              </div>
            </Option>
            // <Option
            //   key={ele.extId}
            //   value={ele.extId}
            //   name={ele.name}
            // >
            //   <div
            //     className={styles['select-option']}
            //   >
            //     <img
            //       src={ele.avatarUrl ? ele.avatarUrl : defaultAvatorUrl}
            //       alt=""
            //       className={styles['user-avatar']}
            //     />
            //     <span className={styles['user-name']}>
            //       {ele.name}
            //     </span>
            //     <p className={styles['user-depName']}>{depName}</p>
            //   </div>
            // </Option>
          )
        }
      }
      {...props}
    >
    </DebounceSelect>
  )
})
