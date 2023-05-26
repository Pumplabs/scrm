import { useEffect, useState, useContext } from 'react'
import {
  Button,
  Divider,
  Tooltip,
  message,
  Empty,
  Radio,
  Select,
  DatePicker,
  Input,
  Tag,
} from 'antd'
import moment from 'moment'
import {
  QuestionCircleOutlined,
  EditOutlined,
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { useRequest, useAntdTable } from 'ahooks'
import { useParams } from 'react-router'
import { observer, MobXProviderContext } from 'mobx-react'
import { get, isEmpty } from 'lodash'
import { PageContent } from 'layout'
import { Table } from 'components/TableContent'
import OpenEle from 'components/OpenEle'
import GroupChatCover from 'components/GroupChatCover'
import StaticsBox from 'components/StaticsBox'
import CustomerDetailDrawer from 'pages/CustomerManage/CustomerList/components/DetailDrawer'
import {
  GetGroupById,
  GetGroupStatics,
  GetChatGroupMember,
  ExportGroupMember,
  ExportStaticsData,
} from 'services/modules/customerChatGroup'
import { MarkGroupChatTag } from 'services/modules/groupChatTag'
import LineChart from './LineChart'
import UserTag from 'components/UserTag'
import WeChatCell, { WeChatEle } from 'components/WeChatCell'
import MarkTagDrawer from '../MarkTagDrawer'
import { useModalHook } from 'src/hooks'
import { actionRequestHookOptions, exportByLink, getRequestError } from 'services/utils'
import { UNSET_GROUP_NAME } from 'utils/constants'
import { USER_TYPE_NAMES, USER_TYPE_EN, JOIN_TYPE_NAMES } from './constants'
import styles from './index.module.less'

const TIPS = {
  TOTAL_CUSTOMER: '群内的全部客户数',
  TODAY_ADD: '今日群内新增的人数，包括员工数',
  TODAY_LOSS: '今日群内流失的人数，包括员工数',
}

const CHART_TYPE_OPTS = {
  // 总人数
  TOTAL: 'total',
  // 客户总数
  TOTAL_CUSTOMER: 'customerNum',
  // 入群人数
  ADD_GROUP_COUNT: 'joinMemberNum',
  // 退群人数
  EXIT_GROUP_COUNT: 'quitMemberNum',
  // 活跃人数
  ACTIVE_COUNT: 'activeMemberNum',
}
const TIMES_VALS = {
  TODAY: 1,
  WEEK: 2,
  MONTH: 3,
}
const TIMES_OPTIONS = [
  {
    label: '近一周',
    value: TIMES_VALS.WEEK,
  },
  {
    label: '近一个月',
    value: TIMES_VALS.MONTH,
  },
]
const TABLE_TYPE_VALS = {
  USER: 1,
  DATE: 2,
}
const { RangePicker } = DatePicker
const MemberItem = observer(({ record }) => {
  const { UserStore } = useContext(MobXProviderContext)
  const corpName = UserStore ? UserStore.userData.corpName : ''
  return (
    <WeChatEle
      userName={record.name}
      avatarUrl={record.memberAvatarUrl}
      corpName={corpName}
    />
  )
})
export default () => {
  const [chartType, setChartType] = useState(CHART_TYPE_OPTS.TOTAL)
  const [chartDimension, setChartDimension] = useState({
    shortcutTime: TIMES_VALS.WEEK,
    times: [moment(), moment()],
  })
  const [tableType, setTableType] = useState(TABLE_TYPE_VALS.USER)
  const [tableSearchVals, setTableSearchVals] = useState({})
  const [memberSearchText, setMemberSearchText] = useState('')
  const { id: groupId } = useParams()
  const {
    run: runGetGroupData,
    data: groupData = {},
    refresh,
  } = useRequest(GetGroupById, {
    manual: true,
    onSuccess: (res) => {
      if (res.extChatId) {
        runGetChatGroupMember()
      }
    },
  })
  const { run: runExportGroupMember } = useRequest(ExportGroupMember, {
    manual: true,
    onSuccess: (res) => {
      exportByLink(res)
      message.info('正在导出中...')
    },
    onError: (e) => getRequestError(e, '导出异常'),
  })
  const {
    run: runGetGroupStatics,
    data: groupStatics,
    loading: lineChartLoading,
  } = useRequest(GetGroupStatics, {
    manual: true,
  })
  const { run: runMarkGroupChatTag } = useRequest(MarkGroupChatTag, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: () => {
        closeModal()
        refresh()
      },
    }),
    onBefore: () => {
      setConfirm()
    },
    onFinally: () => {
      setConfirm(false)
    },
  })

  const { run: runGetChatGroupMember, tableProps: memberTableProps } =
    useAntdTable(
      (pager, vals = {}) =>
        GetChatGroupMember(pager, {
          ...vals,
          extChatId: groupData.extChatId,
        }),
      {
        manual: true,
      }
    )
  const {
    run: runGetChatGroupMemberByTime,
    tableProps: memberTableByTimeProps,
    params: memberTimeParams,
  } = useAntdTable(
    (pager, vals = {}) =>
      GetGroupStatics(pager, {
        ...vals,
        id: groupId,
      }),
    {
      manual: true,
    }
  )
  const {
    openModal,
    closeModal,
    modalInfo,
    visibleMap,
    setConfirm,
    confirmLoading,
  } = useModalHook(['editTag', 'customerDetail'])

  useEffect(() => {
    if (groupId) {
      runGetGroupData({
        id: groupId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId])

  useEffect(() => {
    runGetGroupStatics(
      {
        current: 1,
        pageSize: 99999,
      },
      { times: chartDimension.times, id: groupId }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartDimension])

  useEffect(() => {
    if (tableType === TABLE_TYPE_VALS.DATE && isEmpty(memberTimeParams)) {
      runGetChatGroupMemberByTime({
        current: 1,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableType])

  const onChartTypeChange = (e) => {
    const val = e.target.value
    setChartType(val)
  }
  const onTimesChange = (val) => {
    let rangeTime = []
    switch (val) {
      case TIMES_VALS.TODAY:
        rangeTime = [moment(), moment()]
        break
      case TIMES_VALS.WEEK:
        rangeTime = [moment().subtract(6, 'days'), moment()]
        break
      case TIMES_VALS.MONTH:
        rangeTime = [moment().subtract(29, 'days'), moment()]
        break
      default:
        break
    }
    setChartDimension({
      shortcutTime: val,
      times: rangeTime,
    })
  }
  const onRangeTimeChange = (val) => {
    setChartDimension({
      shortcutTime: undefined,
      times: val,
    })
  }
  const onResetDimension = () => {
    onTimesChange(TIMES_VALS.TODAY)
  }
  const onTableRadioChange = (e) => {
    const val = e.target.value
    setTableType(val)
  }
  const onTimeSearchChange = (val) => {
    setTableSearchVals({
      ...tableSearchVals,
      times: val,
    })
    runGetChatGroupMemberByTime({
      times: val,
    })
  }
  const onInputSearchChange = (e) => {
    const val = e.target.value
    setMemberSearchText(val)
    runGetChatGroupMember(
      {
        current: 1,
        pageSize: tableProps.pagination.pageSize,
      },
      {
        memberName: val,
      }
    )
  }

  const onExportTable = () => {
    let params = {
      extChatId: groupData.extChatId,
    }
    if (tableType === TABLE_TYPE_VALS.USER) {
      params = {
        ...params,
        memberName: memberSearchText,
      }
      runExportGroupMember(params)
    } else {
      params = {
        ...params,
        times: tableSearchVals.times,
      }
      ExportStaticsData({
        id: groupId,
        times: tableSearchVals.times,
      })
    }
  }

  const onEditTag = () => {
    const tags = Array.isArray(groupData.tags) ? groupData.tags : []
    openModal('editTag', {
      selectedTags: tags,
    })
  }

  const onEditTagOk = (tags, keys) => {
    runMarkGroupChatTag({
      groupChatExtIds: [groupData.extChatId],
      tagIds: keys,
    })
  }

  const disabledDate = (current) => {
    return current.isAfter(moment(), 'day')
  }
  const tableColumnByUsers = [
    {
      title: '成员昵称',
      dataIndex: 'name',
      width: 180,
      render: (val, record) => {
        if (record.type === USER_TYPE_EN.CORP_USER) {
          return <MemberItem record={record} />
        }
        if (!record.invitor) {
          return (
            <WeChatEle
              showCorpName={false}
              userName={
                <>
                  {record.name}
                  <Tooltip title="该客户未添加企业任意员工，暂时无法获取客户头像">
                    <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                  </Tooltip>
                </>
              }
              avatarUrl={record.memberAvatarUrl}
            />
          )
        }
        return (
          <WeChatCell
            data={{
              name: val,
              avatarUrl: record.memberAvatarUrl,
              corpName: record.memberExtCorpName,
            }}
          />
        )
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      render: (val) => USER_TYPE_NAMES[val],
    },
    {
      title: '入群时间',
      dataIndex: 'joinTime',
      render: (val) =>
        val ? moment(val * 1000).format('YYYY-MM-DD HH:mm:ss') : '',
    },
    {
      title: '入群方式',
      dataIndex: 'joinScene',
      render: (val) => JOIN_TYPE_NAMES[val],
    },
    {
      title: '邀请员工',
      dataIndex: 'invitor',
      render: (val) => {
        if (val) {
          return (
            <UserTag
              data={{
                name: val,
              }}
            />
          )
        } else {
          return '-'
        }
      },
    }
  ]

  const tableColumnByDate = [
    {
      title: '日期',
      key: 'createDate',
      dataIndex: 'createDate',
    },
    {
      title: '总人数',
      dataIndex: 'total',
    },
    {
      title: '客户人数',
      dataIndex: 'customerNum',
    },
    {
      title: '入群人数',
      dataIndex: 'joinMemberNum',
    },
    {
      title: '退群人数',
      dataIndex: 'quitMemberNum',
    },
    {
      title: '活跃人数',
      dataIndex: 'activeMemberNum',
    },
  ]
  const tableColumns =
    tableType === TABLE_TYPE_VALS.USER ? tableColumnByUsers : tableColumnByDate
  const tableProps =
    tableType === TABLE_TYPE_VALS.USER
      ? memberTableProps
      : memberTableByTimeProps

  const staticData = groupStatics ? groupStatics.list : []
  return (
    <PageContent showBack={true} backUrl={`/groupList`}>
      <MarkTagDrawer
        title="编辑标签"
        visible={visibleMap.editTagVisible}
        onOk={onEditTagOk}
        onCancel={closeModal}
        confirmLoading={confirmLoading}
        data={modalInfo.data}
      />
      <CustomerDetailDrawer
        title="客户详情"
        visible={visibleMap.customerDetailVisible}
        data={modalInfo.data}
        onCancel={closeModal}
      />
      <div className={styles['detail-page']}>
        <div className={styles['basic-info-section']}>
          <div className={styles['group-basic-info']}>
            <div className={styles['basic-header']}>
              <div className={styles['basic-info-box']}>
                <GroupChatCover className={styles['group-cover']} />
                <p className={styles['group-name']}>
                  {groupData.name || UNSET_GROUP_NAME}
                </p>
                <div className={styles['group-extra-text']}>
                  群主:
                  <span className={styles['group-owner-item']}>
                    <img
                      alt=""
                      src={get(groupData, 'ownerInfo.avatarUrl')}
                      className={styles['group-owner-avatar']}
                    />
                    <span className={styles['group-owner-name']}>
                      <OpenEle
                        type="userName"
                        openid={get(groupData, 'ownerInfo.name')}
                      />
                    </span>
                  </span>
                  <Divider type="vertical" />共{groupData.total}位群成员
                </div>
              </div>
              <div className={styles['group-tags-section']}>
                <span className={styles['group-tag-label']}>群聊标签</span>
                {Array.isArray(groupData.tags)
                  ? groupData.tags.map((ele) => (
                      <Tag
                        key={ele.id}
                        className={styles['tag-ele']}
                        >
                        {ele.name}
                      </Tag>
                    ))
                  : null}
                <span
                  className={styles['group-tag-action']}
                  onClick={onEditTag}>
                  <EditOutlined />
                  编辑
                </span>
              </div>
              <StaticsBox
                dataSource={[
                  {
                    label: `${groupData.total || 0}人`,
                    desc: '总人数',
                  },
                  {
                    label: `${groupData.customerNum || 0}人`,
                    desc: (
                      <span>
                        总客户数
                        <Tooltip title={TIPS.TOTAL_CUSTOMER}>
                          <QuestionCircleOutlined
                            className={styles['group-overview-tip']}
                          />
                        </Tooltip>
                      </span>
                    ),
                  },
                  {
                    label: `${groupData.todayJoinMemberNum || 0}人`,
                    desc: (
                      <span>
                        今日新增{' '}
                        <Tooltip title={TIPS.TODAY_ADD}>
                          <QuestionCircleOutlined
                            className={styles['group-overview-tip']}
                          />
                        </Tooltip>
                      </span>
                    ),
                  },
                  {
                    label: `${groupData.todayQuitMemberNum || 0}人`,
                    desc: (
                      <span>
                        今日流失{' '}
                        <Tooltip title={TIPS.TODAY_LOSS}>
                          <QuestionCircleOutlined
                            className={styles['group-overview-tip']}
                          />
                        </Tooltip>
                      </span>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
        <div className={styles['chart-section']}>
          <p className={styles['chart-section-title']}>图表数据</p>
          <div className={styles['chart-radio-section']}>
            <Radio.Group onChange={onChartTypeChange} value={chartType}>
              <Radio.Button value={CHART_TYPE_OPTS.TOTAL}>总人数</Radio.Button>
              <Radio.Button value={CHART_TYPE_OPTS.TOTAL_CUSTOMER}>
                客户总数
              </Radio.Button>
              <Radio.Button value={CHART_TYPE_OPTS.ADD_GROUP_COUNT}>
                入群人数
              </Radio.Button>
              <Radio.Button value={CHART_TYPE_OPTS.EXIT_GROUP_COUNT}>
                退群人数
              </Radio.Button>
            </Radio.Group>
          </div>
          <div>
            <span className={styles['chart-dimension-item']}>
              <Select
                style={{ width: 120 }}
                onChange={onTimesChange}
                value={chartDimension.shortcutTime}
                placeholder="请选择">
                {TIMES_OPTIONS.map((ele) => (
                  <Select.Option value={ele.value} key={ele.value}>
                    {ele.label}
                  </Select.Option>
                ))}
              </Select>
            </span>
            <span className={styles['chart-dimension-item']}>
              <span className={styles['chart-dimension-label']}>选择时间</span>
              <RangePicker
                onChange={onRangeTimeChange}
                value={chartDimension.times}
                allowClear={true}
                disabledDate={disabledDate}
              />
            </span>
            <span className={styles['chart-dimension-item']}>
              <Button onClick={onResetDimension}>重置</Button>
            </span>
          </div>
          <div style={{ borderBottom: '2px solid #eaeaea', marginBottom: 16 }}>
            <LineChart
              dataSource={staticData}
              loading={lineChartLoading}
              valueKey={chartType}
            />
          </div>
          <div className={styles['table-section']}>
            <div className={styles['table-radio-section']}>
              <Radio.Group onChange={onTableRadioChange} value={tableType}>
                <Radio.Button value={TABLE_TYPE_VALS.USER}>
                  按成员查看
                </Radio.Button>
                <Radio.Button value={TABLE_TYPE_VALS.DATE}>
                  按日期查看
                </Radio.Button>
              </Radio.Group>
            </div>
            <div>
              <Table
                title={() => (
                  <div className={styles['table-header']}>
                    <div>
                      {tableType === TABLE_TYPE_VALS.USER ? (
                        <span>
                          共{memberTableProps.pagination.total}个成员
                          <Divider type="vertical" />
                          <Input
                            style={{ width: 240 }}
                            allowClear={true}
                            suffix={<SearchOutlined />}
                            placeholder="请输入要搜索的成员名称"
                            onChange={onInputSearchChange}
                            value={memberSearchText}
                          />
                        </span>
                      ) : (
                        <span>
                          <span>选择时间：</span>
                          <RangePicker
                            disabledDate={disabledDate}
                            onChange={onTimeSearchChange}
                            value={tableSearchVals.times}
                          />
                        </span>
                      )}
                    </div>
                    <Button
                      className={styles['table-exportBtn']}
                      type="primary"
                      ghost
                      onClick={onExportTable}>
                      导出Excel
                    </Button>
                  </div>
                )}
                {...tableProps}
                columns={tableColumns}
                rowKey="id"
              />
            </div>
          </div>
        </div>
      </div>
    </PageContent>
  )
}

const EditItem = ({ label, onClick, children }) => {
  return (
    <div className={styles['edit-item']}>
      <span
        className={styles.itemLabel}
        style={{ display: 'table-cell', width: 80 }}>
        {label}
      </span>
      <div style={{ display: 'table-cell' }}>
        {children}
        <span onClick={onClick} className={styles.itemAction}>
          <EditOutlined className={styles.editIcon} />
          编辑
        </span>
      </div>
    </div>
  )
}
