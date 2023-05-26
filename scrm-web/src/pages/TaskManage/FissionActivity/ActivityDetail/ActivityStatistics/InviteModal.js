import { useEffect } from 'react'
import { Modal } from 'antd'
import cls from 'classnames'
import { useAntdTable, useRequest } from 'ahooks'
import CommonModal from 'components/CommonModal'
import UserTag from 'components/UserTag'
import WeChatCell from 'components/WeChatCell'
import { Table } from 'components/TableContent'
import {
  GetCustomerInviteData,
  AwardPrice,
  GetActivityStatistics,
} from 'services/modules/marketFission'
import { actionRequestHookOptions } from 'services/utils'
import { NUM_CN } from 'utils/constants'
import styles from './index.module.less'

export default ({ visible, data = {}, refresh, ...rest }) => {
  const { tableProps, run: runGetTableData } = useAntdTable(
    (pager, vals = {}) =>
      GetCustomerInviteData(pager, {
        ...vals,
        extCustomerId: data.customer.extId,
        taskId: data.taskId,
      }),
    {
      manual: true,
    }
  )
  const { run: runRedeemData } = useRequest(AwardPrice, {
    manual: true,
    ...actionRequestHookOptions({
      successFn: refresh,
      actionName: '兑奖',
    }),
  })

  const { data: activityStatisticsData = {}, run: runGetActivityStatistics } =
    useRequest(GetActivityStatistics, {
      manual: true,
    })

  const onRedeemRecord = (record) => {
    Modal.confirm({
      title: '提示',
      content: `确定要进行兑奖操作吗`,
      centered: true,
      onOk: () => {
        runRedeemData({
          id: record.id,
        })
      },
    })
  }

  useEffect(() => {
    if (visible) {
      if (data.customer) {
        runGetTableData({})
        runGetActivityStatistics({
          extCustomerId: data.customer.extId,
          id: data.taskId,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'customer',
      render: (val) => (val ? <WeChatCell data={val} /> : null),
    },
    {
      title: '助力状态',
      dataIndex: 'hasFirst',
      render: (val, record) => {
        return val ? '成功' : '失败'
      },
    },
    {
      title: '流失状态',
      dataIndex: 'hasDeleted',
      render: (val) => {
        return val ? '已流失' : '未流失'
      },
    },
    {
      title: '添加员工时间',
      dataIndex: 'createdAt',
    },
  ]
  const taskColumns = [
    {
      title: '阶段名称',
      dataIndex: 'stage',
      render: (val) => `${NUM_CN[val]}阶段任务`,
    },
    {
      title: '完成状态',
      dataIndex: 'hasFinish',
      render: (val) => (val ? '已完成' : '未完成'),
    },
    {
      title: '兑奖客服',
      dataIndex: 'staff',
      render: (val) => (val ? <UserTag data={val} /> : null),
    },
    {
      title: '兑奖时间',
      dataIndex: 'prizeAt',
    },
  ]
  return (
    <CommonModal
      {...rest}
      visible={visible}
      bodyStyle={{
        height: 500,
        overflow: 'auto',
      }}
      className={styles['invite-modal']}>
      <div className={styles['data-section']}>
        <p className={styles['data-section-title']}>任务完成状态</p>
        <Table
          columns={taskColumns}
          {...tableProps}
          dataSource={data.finishDetails}
          actions={[
            {
              render: (record) => {
                const hasPrize = record.hasPrize
                return (
                  <span
                    className={cls({
                      [styles['read-action']]: !record.hasFinish || hasPrize,
                      [styles['cell-action']]: true,
                    })}
                    onClick={() => {
                      if (record.hasFinish && !hasPrize) {
                        onRedeemRecord(record)
                      }
                    }}>
                    {hasPrize ? '已兑奖' : '兑奖'}
                  </span>
                )
              },
            },
          ]}
          pagination={false}
        />
      </div>
      <div className={styles['data-section']}>
        <p className={styles['data-section-title']} style={{ marginBottom: 0 }}>
          参与客户数据
        </p>
        <Table
          className={styles['invite-talbe']}
          title={() => {
            return (
              <div className={styles['invite-statics']}>
                <StaticsItem
                  label="邀请好友总数"
                  value={activityStatisticsData.addCustomerNum}
                />
                <StaticsItem
                  className={styles.success}
                  label="助力成功数"
                  value={activityStatisticsData.successNum}
                />
                <StaticsItem
                  className={styles.fail}
                  label="流失数"
                  value={activityStatisticsData.loseCustomerNum}
                />
              </div>
            )
          }}
          columns={columns}
          {...tableProps}
        />
      </div>
    </CommonModal>
  )
}

const StaticsItem = ({ label, value, className }) => {
  return (
    <span
      className={cls({
        [styles['invite-statics-item']]: true,
        [className]: className,
      })}>
      <span className={styles['invite-statics-item-label']}>{label}</span>
      <span className={styles['invite-statics-item-value']}>{value}</span>
    </span>
  )
}
