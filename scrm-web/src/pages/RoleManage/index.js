import { Form, Button, Modal } from 'antd'
import { useRequest } from 'ahooks'
import { MobXProviderContext, observer } from 'mobx-react'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import UserTag from 'components/UserTag'
import DepName from 'components/DepName'
import { OpenDataEle } from 'components/OpenEle'
import TableContent from 'components/TableContent'
import { MySelectModal } from 'components/MySelect'
import AddRoleDrawer from './AddDrawer'
import { PageContent } from 'layout'
import { useModalHook, useTable } from 'src/hooks'
import { actionRequestHookOptions } from 'services/utils'
import {
  GetRoleTableList,
  AddRole,
  RemoveRole,
  BatchRemoveRole,
} from 'services/modules/roleManage'
import { useContext } from 'react'
export default observer(() => {
  const { tableProps, refresh, selectedRows, selectedKeys, toFirst } = useTable(
    GetRoleTableList,
    {
      pageSize: 10,
      selected: true,
    }
  )
  const {
    openModal,
    closeModal,
    visibleMap,
    modalInfo,
    requestConfirmProps,
    confirmLoading,
  } = useModalHook(['add'])
  const { run: runAddData } = useRequest(AddRole, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '添加',
      successFn: () => {
        refresh()
        closeModal()
      },
    }),
  })
  const { run: runRemoveData } = useRequest(RemoveRole, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        toFirst()
      },
    }),
  })
  const { run: runBatchRemoveData } = useRequest(BatchRemoveRole, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        toFirst()
      },
    }),
  })
  const { UserStore } = useContext(MobXProviderContext)

  const onAdd = () => {
    openModal('add')
  }

  const onAddOk = (values) => {
    if (modalInfo.type === 'add') {
      runAddData({
        ...values,
        roleKey: 'admin',
        "roleSort": 0,
        "status": 0,
      })
    }
  }

  const onBatchRemove = () => {
    const [record] = selectedRows
    const len = selectedRows.length
    if (len === 1) {
      onRemoveRecord(record)
    } else {
      Modal.confirm({
        title: '提示',
        centered: true,
        content: (
          <>
            确定删除“
            {record.name}
            ”等{len}个角色吗
          </>
        ),
        onOk: () => {
          runRemoveData({
            ids: selectedKeys,
          })
        },
      })
    }
  }
  const onRemoveRecord = (record) => {
    Modal.confirm({
      title: '提示',
      centered: true,
      content: `确定删除角色“${record.name}”吗`,
      onOk: () => {
        runRemoveData({
          id: record.id,
        })
      },
    })
  }
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '数据范围',
      dataIndex: 'dataScope',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      render: (val) => <UserTag data={val ? { name: val } : {}} />,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
  ]
  return (
    <PageContent>
      <AddRoleDrawer
        title="新增角色"
        onCancel={closeModal}
        onOk={onAddOk}
        visible={visibleMap.addVisible || visibleMap.editVisible}
        data={modalInfo.data}
        confirmLoading={confirmLoading}
      />
      <TableContent
        {...tableProps}
        rowSelection={{
          ...tableProps.rowSelection,
          getCheckboxProps: (record) => {
            return {
              disabled: record.id === UserStore.userData.extId,
            }
          },
        }}
        columns={columns}
        actions={[
          {
            title: '删除',
            disabled: (record) => record.id === UserStore.userData.extId,
            onClick: onRemoveRecord,
          },
        ]}
        toolBar={[
          <Button
            key="add"
            type="primary"
            onClick={onAdd}
            ghost
            icon={<PlusOutlined />}>
            添加角色
          </Button>,
          <Button
            key="remove"
            type="primary"
            onClick={onBatchRemove}
            ghost
            disabled={selectedKeys.length === 0}
            icon={<DeleteOutlined />}>
            删除角色
          </Button>,
        ]}
      />
    </PageContent>
  )
})
