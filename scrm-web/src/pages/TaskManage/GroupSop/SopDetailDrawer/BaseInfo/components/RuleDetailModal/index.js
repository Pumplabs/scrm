import React, { useEffect, useRef, useContext } from 'react'
import { Form, Modal } from 'antd'
import { useRequest } from 'ahooks'
import { get } from 'lodash'
import { MobXProviderContext, observer } from 'mobx-react'
import CommonModal from 'components/CommonModal'
import { Table } from 'components/TableContent'
import UserTag from 'components/UserTag'
import { OpenDataEle } from 'components/OpenEle'
import StatusCell from 'pages/TaskManage/GroupSop/components/StatusCell'
import { TODO_STATUS } from 'pages/TaskManage/GroupSop/components/RuleInfoItem/constants'
import { RemindSop } from 'services/modules/groupSop'
import { actionRequestHookOptions } from 'services/utils'
import styles from './index.module.less'

export default observer((props) => {
  const { data = {}, visible, onOk, ...rest } = props
  const { UserStore = {} } = useContext(MobXProviderContext)
  const [form] = Form.useForm()
  const hasVisible = useRef()
  const { run: runRemindData } = useRequest(RemindSop, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '提醒',
    }),
  })

  useEffect(() => {
    if (hasVisible.current && visible) {
      form.resetFields()
    }
    if (!hasVisible.current && visible) {
      hasVisible.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onRemindRecord = (record) => {
    Modal.confirm({
      title: '提示',
      centered: true,
      content: (
        <>
          确定要给群主“
          <OpenDataEle
            type="userName"
            openid={record.staff.name}
            corpid={UserStore.userData.extCorpId}
          />
          ”发送提醒吗
        </>
      ),
      onOk: () => {
        runRemindData({
          executeAt: data.executeAt,
          ruleId: data.ruleId,
          staffId: record.staff.extId,
        })
      },
    })
  }

  const columns = [
    {
      title: '群主',
      dataIndex: 'staff',
      render: (val) => <UserTag data={val} />,
    },
    {
      title: '客户群数',
      dataIndex: 'chatNum',
      render: val => val > 0 ? val : 0
    },
    {
      title: '执行状态',
      dataIndex: 'sendStatus',
      render: (val) => <StatusCell value={val} />,
    },
    {
      title: '逾期状态',
      dataIndex: 'todoStatus',
      render: val => TODO_STATUS.OVERDUE === val ? '已逾期' : '未逾期'
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      width: 160,
      render: val => val ? val : '-'
    },
  ]
  const chatList = Array.isArray(data.executeDetailList)
    ? data.executeDetailList
    : []
  const successCount = chatList.length - data.notDoneNum
  return (
    <CommonModal
      visible={visible}
      {...rest}
      width={700}
      onOk={form.submit}
      bodyStyle={{
        height: 520,
        overflow: 'auto',
      }}>
      <div>
        <div className={styles['execute-stat']}>
          <span className={styles['stat-name']}>执行详情</span>
          <div className={styles['stat-content']}>
            <StatItem name="已完成" count={successCount} />
            <StatItem name="未完成" count={data.notDoneNum} />
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={chatList}
          rowKey={record => get(record, 'staff.id')}
          actions={[
            {
              title: '提醒',
              disabled: record => record.todoStatus !== TODO_STATUS.NOT_DONE,
              onClick: onRemindRecord,
            },
          ]}
        />
      </div>
    </CommonModal>
  )
})

const StatItem = ({ name, count }) => {
  return (
    <span className={styles['result-item']}>
      <span className={styles['result-item-name']}>{name}</span>
      <span className={styles['result-item-count']}>{count}</span>
    </span>
  )
}
