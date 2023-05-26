import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import cls from 'classnames'
import { useParams } from 'react-router-dom'
import { QuestionCircleOutlined, SyncOutlined } from '@ant-design/icons'
import {
  Tabs,
  Input,
  Form,
  Button,
  Divider,
  Modal,
  Select,
  Tooltip,
  message,
} from 'antd'
import { observer, MobXProviderContext } from 'mobx-react'
import { useNavigate } from 'react-router-dom'
import { useAntdTable, useRequest } from 'ahooks'
import { get } from 'lodash'
import moment from 'moment'
import { PageContent } from 'src/layout'
import { resolveJson } from 'utils'
import { DepNames } from 'components/DepName'
import OpenEle, { OpenDataEle } from 'components/OpenEle'
import UserTag from 'components/UserTag'
import GroupChatCover from 'components/GroupChatCover'
import { Table } from 'components/TableContent'
import GroupOwnerSelect from 'components/GroupOwnerSelect'
import { MsgPreview, MsgCell } from 'components/WeChatMsgEditor'
import StaticsBox from 'components/StaticsBox'
import MassModal from './MassModal'
import {
  actionRequestHookOptions,
  getRequestError,
  exportByLink,
} from 'services/utils'
import { getMsgList } from 'components/WeChatMsgEditor/utils'
import { useModalHook } from 'src/hooks'
import {
  GetGroupMassDetail,
  GetChatDetail,
  GetGroupOwnerList,
  GetOwnerDetail,
  RemindUser,
  ExportChatDetail,
  ExportChatOwnerDetail,
} from 'services/modules/groupMass'
import { getMassName } from 'src/pages/CustomerMass/utils'
import { UNSET_GROUP_NAME } from 'src/utils/constants'
import styles from './index.module.less'

// 客户发送状态下拉框值
const CUSTOMER_SEND_STATUS_OPTIONS = [
  {
    label: '未发送',
    value: 0,
  },
  {
    label: '已发送',
    value: 1,
  },
  {
    label: '已失败',
    value: -1,
  },
]

const { TabPane } = Tabs
const MSG_SEND_STATUS_OPTIONS = [
  {
    label: '已发送',
    value: 1,
  },
  {
    label: '未发送',
    value: 0,
  },
]

export default observer(() => {
  const { UserStore } = useContext(MobXProviderContext)
  const { id: massId } = useParams()
  const chatRefreshTime = useRef('')
  const ownerRefreshTime = useRef('')
  const [msgList, setMsgList] = useState([])
  const navigate = useNavigate()
  const {
    run: runGroupMass,
    data: massData = {},
    loading,
  } = useRequest(GetGroupMassDetail, {
    manual: true,
    onFinally: async (_, data) => {
      if (!data || !data.id) {
        message.error('您访问的群发消息不存在')
        backToList()
      }
      const mList = await getMsgList(massData.msg)
      setMsgList(mList)
    },
    onError: (e) => {
      getRequestError(e, '您访问的群发消息不存在')
      backToList()
    },
  })
  const {
    run: runGetChatDetail,
    tableProps: chatTableProps,
    refresh: refreshChat,
    params: customerParams = [],
  } = useAntdTable(GetChatDetail, {
    onBefore: () => {
      chatRefreshTime.current = moment().format('YYYY-MM-DD HH:mm:ss')
    },
    manual: true,
  })

  const {
    run: runGetOwnerDetail,
    tableProps: ownerTableProps,
    refresh: refreshOwnerTable,
    params: ownerParams = [],
  } = useAntdTable(GetOwnerDetail, {
    onBefore: () => {
      ownerRefreshTime.current = moment().format('YYYY-MM-DD HH:mm:ss')
    },
    manual: true,
  })
  const { run: runRemindUser } = useRequest(RemindUser, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '提醒操作',
    }),
  })
  const { run: runExportChatDetail } = useRequest(ExportChatDetail, {
    manual: true,
    onSuccess: (res) => {
      if (res) {
        exportByLink(res)
        message.info('正在导出中...')
      } else {
        message.error('导出失败')
      }
    },
    onError: (e) => getRequestError(e, '导出失败'),
  })
  const { run: runExportChatOwnerDetail } = useRequest(ExportChatOwnerDetail, {
    manual: true,
    onSuccess: (res) => {
      if (res) {
        exportByLink(res)
        message.info('正在导出中...')
      } else {
        message.error('导出失败')
      }
    },
    onError: (e) => getRequestError(e, '导出失败'),
  })

  useEffect(() => {
    if (massId) {
      runGroupMass({
        id: massId,
      })
      runGetChatDetail(
        {},
        {
          templateId: massId,
        }
      )
      runGetOwnerDetail(
        {},
        {
          templateId: massId,
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [massId])

  const onCustomerFromValueChange = (vals = {}) => {
    const [pager = {}] = customerParams
    runGetChatDetail(pager, {
      ...vals,
      templateId: massId,
    })
  }

  const onCustomerReset = () => {
    onCustomerFromValueChange()
  }

  const onOwnerFromValueChange = (vals = {}) => {
    const [pager = {}] = ownerParams
    runGetOwnerDetail(pager, {
      ...vals,
      templateId: massId,
    })
  }

  const onOwnerFormReset = () => {
    onOwnerFromValueChange()
  }

  const onCustomerExport = () => {
    const [_, formVals] = customerParams
    runExportChatDetail(formVals)
  }

  const onOwnerExport = () => {
    const [_, formVals] = ownerParams
    runExportChatOwnerDetail(formVals)
  }

  const onRemindOwner = (record) => {
    Modal.confirm({
      title: '提示',
      content: (
        <>
          确定要提醒“
          <OpenDataEle
            type="userName"
            openid={get(record, 'ownerInfo.name')}
            corpid={UserStore.userData.extCorpId}
          />
          ”发送消息吗
        </>
      ),
      centered: true,
      onOk: () => {
        runRemindUser({
          staffExtId: get(record, 'ownerInfo.extId'),
          templateId: massId,
        })
      },
    })
  }

  const backToList = () => {
    navigate(`/customerGroupMass`)
  }

  // const massObjStr = useMemo(() => {
  //   // extStaffIds
  //   if (Array.isArray(massData.chatNames) && massData.chatNames.length) {
  //     return massData.chatNames[0]
  //   } else {
  //     return '暂无'
  //   }
  // }, [massData.chatNames])

  const extStaffIds = Array.isArray(massData.extStaffIds)
    ? massData.extStaffIds
    : []
  return (
    <PageContent showBack={true} backUrl={`/customerGroupMass`} loading={loading}>
      <div className={styles['detail-page']}>
        <div className={styles['detail-page-header']}>基本信息</div>
        <div className={styles['detail-page-body']}>
          <div className={styles.preViewContainer}>
            <p style={{ textAlign: 'center', marginBottom: 10 }}>
              客户收到的消息
            </p>
            <MsgPreview mediaList={msgList} />
          </div>
          <DescItem label="群发名称">{getMassName(massData)}</DescItem>
          <DescItem label="创建者">
            <UserTag data={massData.creatorInfo} />
          </DescItem>
          <DescItem label="创建时间">{massData.createdAt}</DescItem>
          <DescItem label="群主">
            <div className={styles['group-owner-section']}>
              {extStaffIds.map((ele) => (
                <span key={ele} className={styles['group-owner-ele']}>
                  <OpenEle type="userName" openid={ele} key={ele} />
                </span>
              ))}
            </div>
          </DescItem>
          <DescItem label="群发内容">
            <MsgCell data={massData.msg} maxHeight="auto" />
          </DescItem>
        </div>
      </div>
      <div className={styles['data-detail-section']}>
        <div className={styles['card-header']}>数据统计</div>
        <div
          className={cls({
            [styles['dataStatics-container']]: true,
            clear: true,
          })}>
          <StaticsBox
            dataSource={[
              {
                label: `${massData.sendStaffCount || 0}人`,
                desc: '已发送群主',
              },
              {
                label: `${massData.noSendStaffCount || 0}人`,
                desc: '未发送群主',
              },
            ]}
            className={styles['data-box']}
          />
          <StaticsBox
            dataSource={[
              {
                label: `${massData.sendChatCount || 0}`,
                desc: '已送达群聊',
              },
              {
                label: `${massData.noSendChatCount || 0}`,
                desc: '未送达群聊',
              },
            ]}
            className={styles['data-box']}
          />
        </div>
      </div>
      <div className={styles['other-detail']}>
        <div>
          <Tabs defaultActiveKey="customerGroup">
            <TabPane tab="客户群接收详情" key="customerGroup">
              <CustomerTabPane
                tableProps={chatTableProps}
                refreshTime={chatRefreshTime.current}
                onRefresh={refreshChat}
                onFromValueChange={onCustomerFromValueChange}
                onReset={onCustomerReset}
                onExport={onCustomerExport}
              />
            </TabPane>
            <TabPane tab="群主发送详情" key="sendDetail">
              <GroupOwnerTabPane
                tableProps={ownerTableProps}
                refreshTime={ownerRefreshTime.current}
                onRefresh={refreshOwnerTable}
                onFromValueChange={onOwnerFromValueChange}
                onReset={onOwnerFormReset}
                onExport={onOwnerExport}
                onRemindOwner={onRemindOwner}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </PageContent>
  )
})

const DescItem = ({ label, children }) => {
  return (
    <div className={styles['desc-item']}>
      <div className={styles['desc-item-label']}>{label}</div>
      <div className={styles['desc-item-content']}>{children}</div>
    </div>
  )
}

const GroupOwnerTabPane = (props) => {
  const {
    tableProps,
    onRefresh,
    refreshTime,
    onFromValueChange,
    onReset,
    onExport,
    onRemindOwner,
  } = props
  const { openModal, closeModal, visibleMap, modalInfo } = useModalHook([
    'detail',
  ])

  const columns = [
    {
      title: '群主',
      dataIndex: 'ownerInfo',
      render: (val) => <UserTag data={val} />,
    },
    {
      title: '群主所属部门',
      dataIndex: 'name3',
      render: (val, record) => (
        <DepNames dataSource={resolveJson(get(record, 'ownerInfo.deptCN'))} />
      ),
    },
    {
      title: '群发发送状态',
      dataIndex: 'sendStatus',
      render: (val) => val ? '已发送' : '未发送'
    },
    {
      title: (
        <>
          本次群发群聊总数
          <Tooltip title="包含本月接收消息达到上限的群聊">
            <QuestionCircleOutlined style={{ marginLeft: 4 }} />
          </Tooltip>
        </>
      ),
      dataIndex: 'total',
    },
    {
      title: '已发送群聊数',
      dataIndex: 'sendCount',
    },
    {
      title: '确认发送时间',
      dataIndex: 'sendTime',
    },
  ]

  const onMassRecord = (record) => {
    openModal('detail', record)
  }
  return (
    <TabPaneDetail
      onExport={onExport}
      onValuesChange={onFromValueChange}
      summary={`共${tableProps.pagination.total}个群主`}
      onReset={onReset}
      refreshTime={refreshTime}
      onRefresh={onRefresh}
      search={
        <>
          <Form.Item label="群主" name="ownerExtId">
            <GroupOwnerSelect
              request={GetGroupOwnerList}
              allowClear={true}
              placeholder="请选择群主"
              style={{ width: 200 }}
              mode=""
              optionLabelProp="label"
            />
          </Form.Item>
          <Form.Item label="群主发送状态" name="hasSend">
            <Select
              placeholder="请选择群主发送状态"
              style={{ width: 200 }}
              allowClear={true}
              options={MSG_SEND_STATUS_OPTIONS}></Select>
          </Form.Item>
        </>
      }>
      <MassModal
        data={modalInfo.data}
        visible={visibleMap.detailVisible}
        onCancel={closeModal}
      />
      <Table
        columns={columns}
        {...tableProps}
        rowKey={(record) => get(record, 'ownerInfo.name')}
        actions={[
          {
            title: '提醒发送',
            visible: record => !record.sendStatus,
            onClick: onRemindOwner,
          },
          {
            title: '群发详情',
            onClick: onMassRecord,
          },
        ]}
      />
    </TabPaneDetail>
  )
}
const CustomerTabPane = (props) => {
  const navigate = useNavigate()
  const {
    tableProps,
    onRefresh,
    refreshTime,
    onFromValueChange,
    onReset,
    onExport,
  } = props

  const columns = [
    {
      title: '群聊名称',
      dataIndex: 'name',
      render: (val = UNSET_GROUP_NAME, record) => (
        <div className={styles['group-name-cell']}>
          <GroupChatCover
            className={styles['group-avatar']}
            size={28}
            width={40}
          />
          <span>{`${val}` ? val : UNSET_GROUP_NAME}</span>
          <span style={{ marginLeft: 4 }}>({record.total})</span>
        </div>
      ),
    },
    {
      title: '群主',
      dataIndex: 'ownerInfo',
      render: (val) => <UserTag data={val} />,
    },
    {
      title: '群主所属部门',
      dataIndex: 'name3',
      render: (val, record) => (
        <DepNames dataSource={resolveJson(get(record, 'ownerInfo.deptCN'))} />
      ),
    },
    {
      title: (
        <>
          消息送达状态
          <Tooltip title="客户群接收达上限或者员工未选择给该群聊都会造成消息发送失败">
            <QuestionCircleOutlined style={{ marginLeft: 4 }} />
          </Tooltip>
        </>
      ),
      dataIndex: 'sendStatus',
      render: (val) => {
        const item = CUSTOMER_SEND_STATUS_OPTIONS.find(
          (ele) => ele.value === val
        )
        return item ? item.label : '-'
      },
    },
    {
      title: '群聊创建时间',
      dataIndex: 'createdAt',
    },
  ]
  return (
    <TabPaneDetail
      onExport={onExport}
      onValuesChange={onFromValueChange}
      refreshTime={refreshTime}
      onRefresh={onRefresh}
      onReset={onReset}
      summary={`共${tableProps.pagination.total}个群聊`}
      search={
        <>
          <Form.Item label="搜索群聊" name="chatName">
            <Input placeholder="请输入要搜索群聊" />
          </Form.Item>
          <Form.Item label="群主" name="ownerExtId">
            <GroupOwnerSelect
              request={GetGroupOwnerList}
              allowClear={true}
              placeholder="请选择群主"
              style={{ width: 200 }}
              mode=""
              optionLabelProp="label"
            />
          </Form.Item>
          <Form.Item label="送达状态" name="status">
            <Select
              placeholder="请选择消息送达状态"
              style={{ width: 200 }}
              allowClear={true}
              options={CUSTOMER_SEND_STATUS_OPTIONS}
            />
          </Form.Item>
        </>
      }>
      <Table
        columns={columns}
        rowKey="id"
        actions={
          [
            {
              title: '群详情',
              onClick: (record) => {
                // 跳转到群详情
                navigate(`/groupList/detail/${record.id}`)
              },
            },
          ]
        }
        {...tableProps}
      />
    </TabPaneDetail>
  )
}

const TabPaneDetail = ({
  onExport,
  children,
  onRefresh,
  search,
  onValuesChange,
  refreshTime,
  onReset,
  summary,
}) => {
  return (
    <div className={styles['detail-tabpane']}>
      <div className={styles['detail-tabpane-header']}>
        <div className={styles['detail-aggregate']}>
          <span className={styles['deatil-aggregate-name']}>{summary}</span>
          <Divider type="vertical" />
          <span className={styles['refresh-action']} onClick={onRefresh}>
            <SyncOutlined style={{ marginRight: 2 }} />
            更新数据
          </span>
          <span style={{ marginLeft: 8 }}>
            更新于<span style={{ padding: '0px 2px' }}>:</span>
            {refreshTime}
          </span>
        </div>
        <div className={styles['detail-tabpane-extra']}>
          <Button type="primary" ghost onClick={onExport}>
            导出Excel
          </Button>
        </div>
      </div>
      <div className={styles['detail-tabpane-search']}>
        <Form
          // name=""
          // labelCol={{ span: 8 }}
          // wrapperCol={{ span: 16 }}
          // initialValues={{ remember: true }}
          layout="inline"
          onValuesChange={onValuesChange}
          autoComplete="off"
          onReset={onReset}>
          {search}

          <Form.Item className={styles['detail-tabpane-resetBtn']}>
            <Button htmlType="reset">重置</Button>
          </Form.Item>
        </Form>
      </div>
      <div>{children}</div>
    </div>
  )
}
