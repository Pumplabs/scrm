import React, { useState, useEffect, useMemo } from 'react';
import { Empty, Select } from 'antd'
import { useNavigate } from 'react-router'
import CommonDrawer from 'components/CommonDrawer'
import GroupChatCover from 'components/GroupChatCover'
import StaticsBox from 'components/StaticsBox'
import { SEND_STATUS_OPTIONS } from './constants'
import styles from './index.module.less'

const MassDetailModal = (props) => {
  const navigate = useNavigate()
  const { data = {}, modalType, onOk, visible, ...rest } = props
  const [status, setStatus] = useState(undefined)

  useEffect(() => {
    setStatus(undefined)
  }, [rest.visible])

  const onStatusChange = (val) => {
    setStatus(val)
  }

  const filterList = useMemo(() => {
    const chatList = Array.isArray(data.chatInfo) ? data.chatInfo : []
    if (typeof status === 'undefined') {
      return chatList
    } else {
      return chatList.filter(ele => ele.sendStatus === status)
    }
  }, [status, data.chatInfo])

  const onGroupDetail = (record) => {
    navigate(`/groupList/detail/${record.id}`)
  }

  return (
    <CommonDrawer
      visible={visible}
      title="群发详情"
      // closable={true}
      footer={null}
      {...rest}
    >

      <div className={styles['mass-detail-drawer']}>
        <div style={{ marginBottom: 10 }}>
          <StaticsBox
            dataSource={[{
              label: `${data.total}`,
              desc: '本次推送群群聊'
            }, {
              label: `${data.sendCount}`,
              desc: '已群发群聊'
            },
            {
              label: `${data.noSendCount}`,
              desc: '未群发群聊'
            }]}
          />
        </div>
        <div className={styles['mass-list']}>
          <div className={styles['mass-list-header']}>
            <span className={styles['mass-list-name']}>全部</span>
            <span style={{ marginLeft: 4 }}>({filterList.length})</span>
            <div className={styles['mass-list-extra']}>
              <span style={{ marginRight: 4 }}>送达状态
                <span style={{ padding: "0px 4px" }}>:</span>
              </span>
              <Select
                placeholder="请选择消息送达状态"
                style={{ width: 200 }}
                allowClear={true}
                value={status}
                onChange={onStatusChange}
              >
                {
                  SEND_STATUS_OPTIONS.map(ele => (
                    <Select.Option
                      key={ele.value}
                      value={ele.value}
                    >群主{ele.label}</Select.Option>
                  ))
                }
              </Select>
            </div>
          </div>
          <div>
            {filterList.map(ele => (
              <MassListItem
                data={ele}
                key={ele.id}
                onDetail={onGroupDetail}
              />
            ))}
            {
              filterList.length === 0 ? (
                <div style={{ paddingTop: 20 }}>
                  <Empty
                    description="暂时没有相关数据哦"
                  />
                </div>
              ) : null
            }
          </div>
        </div>
      </div>
    </CommonDrawer>
  );
};

const MassListItem = ({ data = {}, onDetail }) => {
  const statusItem = SEND_STATUS_OPTIONS.find(ele => ele.value === data.sendStatus)
  const statusText = statusItem ? `群主${statusItem.label}` : ''
  const handleDetail = () => {
    if(typeof onDetail === 'function') {
      onDetail(data)
    }
  }
  return (
    <div className={styles['mass-list-item']}>
      <GroupChatCover
        width={40}
        size={30}
        className={styles['mass-list-item-avatar']}
      />
      <span className={styles['mass-list-item-name']}>{data.name}</span>
      <span className={styles['mass-list-item-count']}>({data.total})</span>
      <span className={styles['mass-list-item-status']}>{statusText}</span>
      <span className={styles['mass-list-item-action']}
onClick={handleDetail}>群详情</span>
    </div>
  )
}
export default MassDetailModal