import { useAntdTable, useRequest } from 'ahooks'
import { useNavigate } from 'react-router'
import moment from 'moment'
import { get } from 'lodash'
import {
  PlusOutlined,
  ExportOutlined,
  InfoCircleFilled,
} from '@ant-design/icons'
import { Button, Form, Tooltip, Modal, message } from 'antd'
import { PageContent } from 'layout'
import { useModalHook } from 'src/hooks'
import { DepNames } from 'components/DepName'
import UserTag from 'components/UserTag'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import { MsgCell } from 'components/WeChatMsgEditor'
import MsgDrawer from 'pages/CustomerMass/MsgDrawer'
import StatusItem from '../CustomerMass/StatusItem'
import {
  actionRequestHookOptions,
  getRequestError,
  exportByLink,
} from 'services/utils'
import {
  GetGroupMassPageList,
  RemindUser,
  CancelGroupMass,
  ExportMass,
} from 'services/modules/groupMass'
import { getMassName } from '../CustomerMass/utils'
import { SEND_STATUS_VAL } from './constants'
import { getRecordStatus } from './utils'
import styles from './index.module.less'

export default () => {
  const [searchForm] = Form.useForm()
  const navigate = useNavigate()
  const { openModal, closeModal, modalInfo, visibleMap } = useModalHook([
    'massContent',
  ])
  const {
    tableProps,
    refresh: refreshTable,
    search,
    params: searchParams,
  } = useAntdTable(GetGroupMassPageList, {
    form: searchForm,
    pageSize: 10,
  })
  const { run: runRemindUser } = useRequest(RemindUser, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: () => {},
    }),
  })
  const { run: runExportMass } = useRequest(ExportMass, {
    manual: true,
    onSuccess: (res) => {
      if (res) {
        exportByLink(res)
        message.info('正在导出中...')
      } else {
        message.error('导出失败')
      }
    },
    onError: (e) => getRequestError(e, '导出异常'),
  })

  const { run: runCancelGroupMass } = useRequest(CancelGroupMass, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: () => {
        refreshTable()
      },
    }),
  })
  const onDetailRecord = (record) => {
    navigate(`/customerGroupMass/detail/${record.id}`)
  }

  const onRemindRecord = (record) => {
    Modal.confirm({
      title: '提示',
      content: '确认后将会给所有未发送成员发送提醒通知，是否发送？',
      centered: true,
      onOk: () => {
        runRemindUser({
          templateId: record.id,
        })
      },
    })
  }

  const onCancelSendRecord = (record) => {
    Modal.confirm({
      title: '提示',
      content: '确定要取消发送吗',
      centered: true,
      onOk: () => {
        runCancelGroupMass({
          id: record.id,
        })
      },
    })
  }

  const onExport = () => {
    const [, formVals] = searchParams
    runExportMass(formVals)
  }

  const onAdd = () => {
    navigate(`/customerGroupMass/add`)
  }

  const onEditRecord = (record) => {
    navigate(`/customerGroupMass/edit/${record.id}`)
  }

  const onExpandRecord = (mediaArr) => {
    openModal('massContent', {
      mediaArr,
    })
  }

  const columns = [
    {
      title: '群发名称',
      dataIndex: 'name1',
      ellipsis: true,
      width: 120,
      fixed: true,
      render: (_, record) => {
        const str = getMassName(record)
        return (
          <Tooltip placement="topLeft" title={str}>
            <span>{str}</span>
          </Tooltip>
        )
      },
    },
    {
      title: '群发内容',
      dataIndex: 'msg',
      width: 220,
      render: (val) => {
        return <MsgCell data={val} onExpand={onExpandRecord} />
      },
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      width: 100,
      render: (_, record) => {
        return (
          <>
            <StatusItem data={record} statusVals={SEND_STATUS_VAL} />
            {record.failMsg ? (
              <Tooltip title={record.failMsg}>
                <InfoCircleFilled className={styles['error-text']} />
              </Tooltip>
            ) : null}
          </>
        )
      },
    },
    {
      title: '发送类型',
      width: 120,
      dataIndex: 'hasSchedule',
      render: (val) => (val ? '定时发送' : '立即发送'),
    },
    {
      title: '发送时间',
      width: 160,
      dataIndex: 'sendTime',
    },
    {
      title: '创建人',
      width: 120,
      dataIndex: 'creatorInfo',
      render: (val) => <UserTag data={val} />,
    },
    {
      title: '创建人所属部门',
      width: 160,
      ellipsis: true,
      dataIndex: 'deptCN',
      render: (_, record) => {
        return <DepNames jsonStr={get(record, 'creatorInfo.deptIds')} />
      },
    },
    {
      title: '已发送群主',
      width: 120,
      dataIndex: 'sendStaffCount',
    },
    {
      title: '已送达群聊',
      width: 120,
      dataIndex: 'sendChatCount',
    },
    {
      title: '未送达群主',
      width: 120,
      dataIndex: 'noSendStaffCount',
    },
    {
      title: '未送达群聊',
      width: 120,
      dataIndex: 'noSendChatCount',
    },
  ]
  const searchConfig = [
    {
      type: 'input',
      label: '群发名称',
      ellipsis: true,
      name: 'name',
    },
    {
      type: 'userSelect',
      label: '创建人',
      eleProps: {
        valueKey: 'extId',
      },
      name: 'creatorExtIds',
    },
    {
      type: 'rangTime',
      label: '发送时间',
      name: 'createTime',
    },
  ]
  return (
    <PageContent>
      <SearchForm
        form={searchForm}
        onSearch={search.submit}
        onReset={search.reset}
        configList={searchConfig}
      />
      <MsgDrawer
        title="群发内容"
        visible={visibleMap.massContentVisible}
        data={modalInfo.data}
        onCancel={closeModal}
      />
      <TableContent
        {...tableProps}
        rowKey="id"
        // tableLayout="auto"
        scroll={{ x: 1200 }}
        columns={columns}
        operationCol={{ width: 180, maxActionCount: 2 }}
        actions={[
          {
            title: '提醒发送',
            visible: (record) => record.status === SEND_STATUS_VAL.SUCCESS && record.noSendChatCount > 0,
            // 未取消的且发送时间大于30分钟
            onClick: onRemindRecord,
          },
          {
            title: '详情',
            onClick: onDetailRecord,
            visible: (record) => record.status !== SEND_STATUS_VAL.FAIL,
          },
          {
            title: '编辑',
            // 如果尚未发送过且未取消，则可以编辑
            onClick: onEditRecord,
            visible: (record) => record.status === SEND_STATUS_VAL.WAIT_SEND,
          },
          {
            title: '取消发送',
            // 未发送过
            onClick: onCancelSendRecord,
            visible: (record) => record.status === SEND_STATUS_VAL.WAIT_SEND,
          },
        ]}
        toolBar={[
          <Button key="add" onClick={onAdd} type="primary" ghost>
            <PlusOutlined />
            创建群发
          </Button>,
          // <Button key="remove" onClick={onExport} type="primary" ghost>
          //   <ExportOutlined />
          //   导出
          // </Button>,
        ]}
      />
    </PageContent>
  )
}
