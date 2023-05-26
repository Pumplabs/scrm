import { message, Button, Form, Modal, Tooltip } from 'antd'
import { useAntdTable, useRequest } from 'ahooks'
import { useNavigate } from 'react-router'
import moment from 'moment'
import cls from 'classnames'
import {
  PlusOutlined,
  ExportOutlined,
  InfoCircleFilled,
} from '@ant-design/icons'
import { get } from 'lodash'
import { PageContent } from 'layout'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import { MsgCell } from 'components/WeChatMsgEditor'
import { DepNames } from 'components/DepName'
import UserTag from 'components/UserTag'
import MsgDrawer from './MsgDrawer'
import StatusItem from './StatusItem'
import {
  GetCustomerMassPageList,
  CancelMass,
  RemindMass,
  ExportMass,
} from 'services/modules/customerMass'
import {
  getRequestError,
  exportByLink,
  actionRequestHookOptions,
} from 'services/utils'
import { SEND_STATUS_VAL } from './constants'
import { useModalHook } from 'src/hooks'
import { getMassName } from './utils'
import styles from './index.module.less'

export default () => {
  const [searchForm] = Form.useForm()
  const navigate = useNavigate()
  const {
    tableProps,
    search,
    refresh,
    params: searchParams,
  } = useAntdTable(GetCustomerMassPageList, {
    form: searchForm,
    pageSize: 10,
  })
  const { run: runCancelMass } = useRequest(CancelMass, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '取消发送操作',
      successFn: () => {
        refresh()
      },
    }),
  })
  const { run: runRemindMass } = useRequest(RemindMass, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '提醒',
    }),
  })
  const { run: runExportMass } = useRequest(ExportMass, {
    manual: true,
    onSuccess: (res) => {
      exportByLink(res)
      message.info('正在导出中...')
    },
    onError: (e) => getRequestError(e, '导出异常'),
  })

  const { openModal, closeModal, modalInfo, visibleMap } = useModalHook([
    'massContent',
  ])
  const onDetailRecord = (record) => {
    navigate(`/customerMass/detail/${record.id}`)
  }

  const onRemindRecord = (record) => {
    Modal.confirm({
      title: '提示',
      content: '确认后将会给所有未发送成员发送提醒通知，是否发送',
      centered: true,
      onOk: () => {
        runRemindMass({
          staffExtId: '',
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
        runCancelMass({
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
    navigate(`/customerMass/add`)
  }

  const onEditRecord = (record) => {
    navigate(`/customerMass/edit/${record.id}`)
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
      width: 120,
      ellipsis: true,
      fixed: 'left',
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
      dataIndex: 'staff',
      render: (val) => <UserTag data={val} />,
    },
    // {
    //   title: '创建人所属部门',
    //   width: 160,
    //   dataIndex: 'creatorOrgCN',
    //   render: (_, record) => {
    //     const val = get(record, 'staff.deptIds')
    //     return <DepNames jsonStr={val} />
    //   },
    // },
    {
      title: '已发送成员',
      width: 120,
      dataIndex: 'sendStaffCount',
    },
    {
      title: '送达客户',
      width: 120,
      dataIndex: 'sendCustomer',
    },
    {
      title: '未发送成员',
      width: 120,
      dataIndex: 'noSendStaffCount',
    },
    {
      title: '未送达客户',
      width: 120,
      dataIndex: 'noSendCustomer',
    },
  ]
  const searchConfig = [
    {
      label: '创建人',
      type: 'userSelect',
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
        scroll={{ x: 1200 }}
        columns={columns}
        operationCol={{ width: 180, maxActionCount: 2 }}
        actions={[
          {
            title: '提醒发送',
            visible: (record) =>
              record.status === SEND_STATUS_VAL.SUCCESS &&
              record.noSendCustomer > 0,
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
