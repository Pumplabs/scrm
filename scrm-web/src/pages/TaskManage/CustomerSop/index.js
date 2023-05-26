import { useState } from 'react'
import { Button, Form, message, Modal, Switch } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useAntdTable, useRequest } from 'ahooks'
import { useNavigate } from 'react-router-dom'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import UserTag from 'components/UserTag'
import { PageContent } from 'layout'
import SopDetailDrawer from './SopDetailDrawer'
import { GetSopList, RemoveSop,BatchRemoveSop, UpdateSopStatus } from 'services/modules/customerSop'
import { actionRequestHookOptions } from 'services/utils'
import { TRIGGER_OPTIONS, STATUS_EN } from './constants'
import { useModalHook } from 'src/hooks'

export default () => {
  const [searchForm] = Form.useForm()
  const [selectedInfo, setSelectedInfo] = useState([])
  const { openModal, closeModal, visibleMap, modalInfo } = useModalHook([
    'detail',
  ])
  const {
    tableProps,
    search,
    refresh: refreshTable,
  } = useAntdTable(GetSopList, {
    pageSize: 10,
    form: searchForm,
    onBefore: () => {
      setSelectedInfo([])
    }
  })
  const { run: runRemoveData } = useRequest(RemoveSop, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: refreshTable,
    }),
  })
  const { run: runBatchRemove} = useRequest(BatchRemoveSop, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: refreshTable,
    }),
  })
  const { run: runUpdateStatusData } = useRequest(UpdateSopStatus, {
    manual: true,
    ...actionRequestHookOptions({
      getActionName: ([, {actionName} = {}]) => {
        return actionName ? actionName : '操作'
      },
      successFn: () => {
        refreshTable()
      },
    }),
  })

  const navigate = useNavigate()
  const onEditRecord = (record) => {
    navigate(`/customerSop/list/edit/${record.id}`)
  }
  const onRemoveRecord = (record) => {
    Modal.confirm({
      title: '提示',
      content: `确定要删除SOP“${record.name}”吗`,
      centered: true,
      onOk: () => {
        runRemoveData({
          id: record.id,
        })
      },
    })
  }

  const onDetailRecord = (record) => {
    openModal('detail', record)
  }

  const onAdd = () => {
    navigate(`/customerSop/list/add`)
  }

  const onRowChange = (keys, rows) => {
    setSelectedInfo([keys, rows])
  }

  const onRemove = () => {
    const [keys, rows] = selectedInfo
    const [record]=rows
    Modal.confirm({
      title: '提示',
      content: `确定要删除“${record.name}”等${keys.length}个SOP吗`,
      centered: true,
      onOk: () => {
        runBatchRemove({
          ids: keys
        })
      },
    })
  }
  const onStatusChange = (nextIsEnabled, record) => {
    const actionName = nextIsEnabled ? '启用': '禁用'
    const params = {
      id: record.id,
      status: nextIsEnabled ?  STATUS_EN.ENABLED: STATUS_EN.DISABLED
    }
    Modal.confirm({
      title: '提示',
      content: `确定要${actionName}SOP“${record.name}”吗`,
      centered: true,
      onOk: () => {
        runUpdateStatusData(params, {actionName})
      },
    })
  }

  const columns = [
    {
      title: '流程名称',
      dataIndex: 'name',
    },
    {
      title: '执行方式',
      dataIndex: 'term',
      options: TRIGGER_OPTIONS
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      render: (val, record) => (
        <Switch
          onChange={(val) => onStatusChange(val, record)}
          checked={`${val}` === `${STATUS_EN.ENABLED}`}
          checkedChildren="开启"
          unCheckedChildren="关闭"
        />
      ),
    },
    {
      title: '创建人',
      dataIndex: 'creatorCN',
      render: (val) => <UserTag data={{name: val}} />,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
  ]
  const searchConfig = [
    {
      label: '名称',
      name: 'name',
      type: 'input',
    },
  ]
  const [selectedKeys = []] = selectedInfo
  return (
    <PageContent>
      <SearchForm
        form={searchForm}
        configList={searchConfig}
        onSearch={search.submit}
        onReset={search.reset}
      />
      <SopDetailDrawer
        visible={visibleMap.detailVisible}
        data={modalInfo.data}
        onCancel={closeModal}
      />
      <TableContent
        {...tableProps}
        columns={columns}
        operationCol={{ width: 140 }}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: onRowChange,
        }}
        actions={[
          {
            title: '编辑',
            onClick: onEditRecord,
          },
          {
            title: '删除',
            onClick: onRemoveRecord,
          },
          {
            title: '详情',
            onClick: onDetailRecord,
          },
        ]}
        toolBar={[
          <Button
            key="add"
            type="primary"
            onClick={onAdd}
            ghost
            icon={<PlusOutlined />}>
            创建自动化流程
          </Button>,
           <Button
           key="remove"
           type="primary"
           onClick={onRemove}
           ghost
           icon={<DeleteOutlined />}
           disabled={!selectedKeys.length}
          >
           批量删除
         </Button>,
        ]}
      />
    </PageContent>
  )
}
