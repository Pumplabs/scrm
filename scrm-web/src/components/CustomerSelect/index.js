import React, { forwardRef, useImperativeHandle } from 'react'
import { Select, Tag } from 'antd'
import { get } from 'lodash'
import cls from 'classnames'

import WeChatCell from 'components/WeChatCell'
import { DepNames } from 'components/DepName'
import DebounceSelect from 'components/DebounceSelect'
import { GetCustomerDropdownList } from 'services/modules/customerManage'
import defaultAvatorUrl from 'assets/images/defaultAvator.jpg'
import styles from './index.module.less'

const { Option } = Select
const GroupOwnerSelect = forwardRef((props, ref) => {
  const { valueKey = 'extId', disabledValues = [], ...rest } = props
  useImperativeHandle(ref, () => ({}))
  return (
    <DebounceSelect
      allowClear={true}
      placeholder="全部"
      emptyDesc="未搜到相关客户哦~"
    //   mode="multiple"
      maxTagCount={2}
      className={cls({
        [styles['customer-select']]: true,
      })}
      request={GetCustomerDropdownList}
      renderItem={(ele) => {
        return (
          <Option
            key={ele[valueKey]}
            value={ele[valueKey]}
            disabled={disabledValues.includes(ele[valueKey])}
        >
           <WeChatCell data={ele} />
          </Option>
        )
      }}
      {...rest}></DebounceSelect>
  )
})

export default GroupOwnerSelect
