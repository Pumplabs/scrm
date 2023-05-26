import React, { useEffect, useRef, useContext, useMemo } from 'react'
import { Form, Modal } from 'antd'
import { useRequest } from 'ahooks'
import { MobXProviderContext, observer } from 'mobx-react'
import CommonModal from 'components/CommonModal'
import { Table } from 'components/TableContent'
import UserTag from 'components/UserTag'
import { OpenDataEle } from 'components/OpenEle'
import StatusCell from 'pages/TaskManage/GroupSop/components/StatusCell'
import { SEND_STATUS, TODO_STATUS } from 'pages/TaskManage/GroupSop/components/RuleInfoItem/constants'
import { GetExecuteDetail, RemindSop } from 'services/modules/customerSop'
import { actionRequestHookOptions } from 'services/utils'
import styles from './index.module.less'
import { get } from 'lodash'

export default observer((props) => {
  const { data = {}, visible, onOk, ...rest } = props
  const { UserStore = {} } = useContext(MobXProviderContext)
  const [form] = Form.useForm()
  const hasVisible = useRef(false)
  const { run: runGetExecuteDetail, data: customerList = [], loading: customerLoading, cancel: cancelGetExecuteDetail } = useRequest(GetExecuteDetail, {
    manual: true,
  })
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
    if (data.ruleId) {
      runGetExecuteDetail({
        ruleId: data.ruleId,
        executeAt: data.executeAt
      })
    }
    if (!visible && customerLoading) {
      cancelGetExecuteDetail()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onRemindRecord = (record) => {
    Modal.confirm({
      title: '提示',
      content: <>
      <span>确定要给员工“<OpenDataEle type="userName" openid={get(record, 'staff.name')} corpid={UserStore.userData.extCorpId}/>”发送提醒吗</span>
      </>,
      centered: true,
      onOk: () => {
        runRemindData({
          "executeAt": data.executeAt,
          "ruleId": data.ruleId,
          "staffId": get(record, 'staff.extId')
        })
      },
    })
  }

  const columns = [
    {
      title: '员工',
      dataIndex: 'staff',
      render: (val) => <UserTag data={val} />,
    },
    {
      title: '客户数',
      dataIndex: 'customerNum',
      render: (val) => val > 0 ? val : 0
    },
    {
      title: '执行状态',
      dataIndex: 'sendStatus',
      render: (val) => <StatusCell value={val}/>
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
  const successCount = customerList.length - data.notDoneNum
  const tableData = useMemo(() => {
    return customerList.map((item, idx) => ({
      ...item,
      id: `${get(item, 'staff.id')}_${idx}`
    }))
  }, [customerList])
  console.log("data", data)
  return (
    <CommonModal
      visible={visible}
      {...rest}
      width={680}
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
          dataSource={tableData}
          loading={customerLoading}
          scroll={{y: 240}}
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
