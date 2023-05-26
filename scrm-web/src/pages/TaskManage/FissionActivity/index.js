import { Button, Form, Modal } from 'antd'
import { useAntdTable, useRequest } from 'ahooks'
import { useNavigate } from 'react-router'
import { PlusOutlined } from '@ant-design/icons'
import { PageContent } from 'layout'
import { useModalHook } from 'src/hooks'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import { MySelectModal } from 'components/MySelect'
import ActivityDetail from './ActivityDetail'
import { actionRequestHookOptions } from 'services/utils'
import {
  RemoveMaketFission,
  GetMaketFissionList,
  StopMaketFission,
  PromoteActivity,
} from 'services/modules/marketFission'
import { STATUS_OPTIONS, STATUS_EN_VAL } from './constants'

export default () => {
  const [searchForm] = Form.useForm()
  const navigate = useNavigate()
  const {
    openModal,
    closeModal,
    modalInfo,
    visibleMap,
    setConfirm,
    confirmLoading,
  } = useModalHook(['detail', 'promote'])
  const {
    tableProps,
    run: runTable,
    search,
    params: searchParams,
  } = useAntdTable(GetMaketFissionList, {
    form: searchForm,
    pageSize: 10,
  })

  const getFirstPage = () => {
    const [pager, formVal] = searchParams
    runTable(
      {
        ...pager,
        current: 1,
      },
      formVal
    )
  }
  const { run: runRemoveActivity } = useRequest(RemoveMaketFission, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        getFirstPage()
      },
    }),
  })

  const { run: runStopActivity } = useRequest(StopMaketFission, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: () => {
        getFirstPage()
      },
    }),
  })

  const { run: runPromoteActivity } = useRequest(PromoteActivity, {
    manual: true,
    onBefore() {
      setConfirm(true)
    },
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: () => {
        setConfirm(false)
        closeModal()
        getFirstPage()
      },
      failFn: () => {
        setConfirm(false)
      },
    }),
  })
  console.log("22");

  const onAdd = () => {
    navigate(`/taskManage/list/add`)
  }

  const onEditRecord = (record) => {
    navigate(`/taskManage/list/edit/${record.id}`)
  }

  const onDetailRecord = (record) => {
    openModal('detail', record)
  }

  const onRemoveRecord = (record) => {
    Modal.confirm({
      type: 'warning',
      title: '提示',
      content: `确定要删除活动"${record.name}"吗`,
      centered: true,
      onOk: () => {
        runRemoveActivity({
          id: record.id,
        })
      },
    })
  }

  const onStopRecord = (record) => {
    Modal.confirm({
      type: 'warning',
      title: '提示',
      content: `确定要结束此活动"${record.name}"吗`,
      centered: true,
      onOk: () => {
        runStopActivity({
          id: record.id,
        })
      },
    })
  }

  const onPromoteRecord = (record) => {
    openModal('promote', record)
  }

  const onPromoteOk = (vals = []) => {
    runPromoteActivity({
      extCustomerIds: vals.map((ele) => ele.extId),
      taskId: modalInfo.data.id,
    })
  }

  const columns = [
    {
      title: '活动名称',
      dataIndex: 'name',
      width: 220,
      ellipsis: true,
    },
    {
      title: '状态',
      width: 120,
      dataIndex: 'status',
      options: STATUS_OPTIONS,
    },
    {
      title: '添加客户数',
      width: 120,
      dataIndex: 'count',
    },
    {
      title: '创建时间',
      width: 160,
      dataIndex: 'createdAt',
    },
    {
      title: '结束时间',
      width: 160,
      dataIndex: 'endTime',
    },
  ]

  const searchConfig = [
    {
      type: 'input',
      label: '活动名称',
      name: 'name',
      eleProps: {
        placeholder: '请输入活动名称',
      },
    },
  ]
  return (
    <PageContent>
      <MySelectModal
        title="推广活动"
        type="customer"
        visible={visibleMap.promoteVisible}
        onOk={onPromoteOk}
        confirmLoading={confirmLoading}
        onCancel={closeModal}
      />
      <ActivityDetail
        visible={visibleMap.detailVisible}
        data={modalInfo.data}
        title="活动详情"
        onCancel={closeModal}
      />
      <SearchForm
        form={searchForm}
        configList={searchConfig}
        onSearch={search.submit}
        onReset={search.reset}
      />
      <TableContent
        {...tableProps}
        rowKey="id"
        scroll={{ x: 1000 }}
        columns={columns}
        operationCol={{ width: 180 }}
        actions={[
          {
            title: '详情',
            onClick: onDetailRecord,
          },
          {
            title: '删除',
            // 进行中不能删除，只能先结束
            visible: (record) =>
              `${STATUS_EN_VAL.START}` !== `${record.status}`,
            onClick: onRemoveRecord,
          },
          {
            title: '推广',
            // 进行中不能删除，只能先结束
            visible: (record) => `${STATUS_EN_VAL.END}` !== `${record.status}`,
            onClick: onPromoteRecord,
          },
          {
            title: '编辑',
            onClick: onEditRecord,
            // 已结束不能编辑
            visible: (record) => `${STATUS_EN_VAL.END}` !== `${record.status}`,
          },
          {
            title: '结束活动',
            onClick: onStopRecord,
            // 只能结束进行中的活动
            visible: (record) =>
              `${STATUS_EN_VAL.START}` === `${record.status}`,
          },
        ]}
        toolBar={[
          <Button
            key="add"
            onClick={onAdd}
            type="primary"
            ghost
            icon={<PlusOutlined />}>
            创建活动
          </Button>,
        ]}
      />
    </PageContent>
  )
}
