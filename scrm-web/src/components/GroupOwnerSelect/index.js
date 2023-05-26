import React, { forwardRef, useImperativeHandle } from 'react'
import { Select, Tag } from 'antd'
import { get } from 'lodash'
import OpenEle from 'components/OpenEle'
import { DepNames } from 'components/DepName'
import DebounceSelect from 'components/DebounceSelect'
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
      emptyDesc="未搜到相关员工哦~"
      mode="multiple"
      maxTagCount={2}
      tagRender={(tagProps) => {
        const { label, closable, onClose } = tagProps
        const src = get(label, 'props.ele.avatarUrl') || defaultAvatorUrl
        const userExtId = get(label, 'props.ele.name') || tagProps.value
        const userName = <OpenEle type="userName" openid={userExtId} />
        const onPreventMouseDown = (event) => {
          event.preventDefault()
          event.stopPropagation()
        }
        return (
          <Tag
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{
              marginRight: 3,
              wordBreak: 'break-all',
              whiteSpace: 'break-spaces',
            }}>
            <span style={{ marginRight: 4 }}>
              <img
                src={src}
                alt=""
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 2,
                  marginRight: 2,
                }}
              />
              <span style={{ verticalAlign: 'middle' }}>{userName}</span>
            </span>
          </Tag>
        )
      }}
      renderItem={(ele) => {
        return (
          <Option
            key={ele[valueKey]}
            value={ele[valueKey]}
            name={<OpenEle type="userName" openid={ele.name} />}
            label={<OpenEle type="userName" openid={ele.name} />}
            disabled={disabledValues.includes(ele[valueKey])}>
            <OptionItem ele={ele} />
          </Option>
        )
      }}
      {...rest}></DebounceSelect>
  )
})

const OptionItem = ({ ele }) => {
  return (
    <div className={styles['select-option']}>
      <img
        src={ele.avatarUrl ? ele.avatarUrl : defaultAvatorUrl}
        alt=""
        className={styles['user-avatar']}
      />
      <span className={styles['user-name']}>
        <OpenEle type="userName" openid={ele.name} />
      </span>
      <p className={styles['user-depName']}>
        <DepNames dataSource={ele.departmentList} />
      </p>
    </div>
  )
}
export default GroupOwnerSelect
