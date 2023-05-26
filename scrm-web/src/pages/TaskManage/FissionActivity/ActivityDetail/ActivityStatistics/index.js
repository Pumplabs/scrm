import { useEffect } from 'react'
import {  Form } from 'antd'
import { useAntdTable, useRequest } from 'ahooks'
import { isEmpty } from 'lodash'
import StaticsBox from 'components/StaticsBox'
import { Table } from 'components/TableContent'
import WeChatCell from 'components/WeChatCell'
import UsersTagCell from 'components/UsersTagCell'
import InviteModal from './InviteModal'
import { useModalHook } from 'src/hooks'
import { NUM_CN } from 'src/utils/constants'
import SearchForm from 'components/SearchForm'
import {
  GetCustomerJoinActivityData,
  GetActivityStatistics,
} from 'services/modules/marketFission'
import { formatNumber } from 'src/utils'
import { LOSE_STATUS_OPTIONS, LEVEL_OPTIONS } from './constants'

export default ({ data = {} }) => {
  const [searchForm] = Form.useForm()
  const { openModal, closeModal, modalInfo, visibleMap } = useModalHook([
    'detail',
  ])
  const {
    tableProps,
    run: runGetMakertFissionData,
    refresh,
    search,
  } = useAntdTable((pager, vals) => GetCustomerJoinActivityData(pager, {
    ...vals,
    id: data.id,
  }), {
    manual: true,
    form: searchForm,
    onSuccess() {
      if (!isEmpty(modalInfo.data)) {
        const data = tableProps.dataSource.find(ele => ele.id === modalInfo.data.id)
        if (data) {
          openModal(modalInfo.type,data)
        }
      }
    }
  })
  const { data: activityStatisticsData = {}, run: runGetActivityStatistics } =
    useRequest(GetActivityStatistics, {
      manual: true,
    })

  useEffect(() => {
    if (data.id) {
      runGetActivityStatistics({
        id: data.id,
      })
      runGetMakertFissionData(
        {},
        {
          // "extCorpId": "",
          // "finishStage": 0,
          // "hasLose": false,
          // "name": "",
          id: data.id,
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const columns = [
    {
      title: '客户名称',
      width: 160,
      dataIndex: 'customer',
      render: (val) => val ? <WeChatCell data={val} /> : null
    },
    {
      title: '所属员工',
      width: 120,
      dataIndex: 'staffList',
      render: (val) =><UsersTagCell dataSource={val} />
    },
    {
      title: '邀请来源',
      width: 120,
      dataIndex: 'origin',
      render: (val) => val ? <WeChatCell data={val} /> : '-',
    },
    {
      title: '流失状态',
      width: 160,
      options: LOSE_STATUS_OPTIONS,
      dataIndex: 'hasLose',
    },
    {
      title: '完成状态',
      width: 100,
      dataIndex: 'doneStatus',
      render: (_, record) => {
        const doneArr = Array.isArray(record.finishDetails) ? record.finishDetails : []
        const isDone = doneArr.every(ele => ele.hasFinish)
        return isDone ? '已完成' : '未完成'
      }
    },
    {
      title: '已完成任务阶段',
      width: 160,
      dataIndex: 'finishStage',
      render: (val) => NUM_CN[val] ? `${NUM_CN[val]}阶段` : '-',
    },
    {
      title: '邀请好友数',
      width: 100,
      dataIndex: 'inviteNum',
    },
    {
      title: '助力成功数',
      width: 100,
      dataIndex: 'successNum',
    },
  ]

  const onDetailRecord = (record) => {
    openModal('detail', record)
  }

  // const customerList = useMemo(() => {
  //   return Array.isArray(activityData.customer) ? activityData.customer : []
  // }, [activityData])

  const searchConfig = [
    {
      label: '客户昵称',
      name: 'name',
    },
    {
      type: 'select',
      label: '流失状态',
      name: 'lossStatus',
      eleProps: {
        options: LOSE_STATUS_OPTIONS,
      },
    },
    {
      type: 'select',
      label: '已完成任务阶段',
      name: 'finishStage',
      eleProps: {
        options: LEVEL_OPTIONS,
      },
    },
  ]

  return (
    <div>
      <InviteModal
        title="邀请详情"
        data={modalInfo.data}
        refresh={refresh}
        onCancel={closeModal}
        visible={visibleMap.detailVisible}
        footer={null}
      />
      <StaticsBox
        dataSource={[
          {
            desc: '参与客户数',
            label: formatNumber(activityStatisticsData.customerNum),
          },
          {
            desc: '裂变客户数',
            label: formatNumber(activityStatisticsData.addCustomerNum),
          },
          {
            desc: '流失客户数',
            label: formatNumber(activityStatisticsData.loseCustomerNum),
          },
          {
            desc: '今日新增客户数',
            label: formatNumber(activityStatisticsData.todayAddCustomerNum),
          },
        ]}
      />
      <div>
        <div>
          <SearchForm
            wrapStyle={{ boxShadow: 'none', marginBottom: 0 }}
            form={searchForm}
            configList={searchConfig}
            onSearch={search.submit}
            onReset={search.reset}
          />
        </div>
        <Table
          columns={columns}
          {...tableProps}
          scroll={{ x: 800 }}
          actions={[
            {
              title: '邀请详情',
              onClick: onDetailRecord,
            },
          ]}
        />
      </div>
    </div>
  )
}
