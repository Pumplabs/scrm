import { useContext, useMemo } from 'react'
import { Form, Button, Modal } from 'antd'
import { useRequest } from 'ahooks'
import { get } from 'lodash'
import { MobXProviderContext, observer } from 'mobx-react'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import UserTag from 'components/UserTag'
import { DepNames } from 'components/DepName'
import { OpenDataEle } from 'components/OpenEle'
import TableContent from 'components/TableContent'
import { MySelectModal } from 'components/MySelect'
import { PageContent } from 'layout'
import { useModalHook, useTable } from 'src/hooks'
import { actionRequestHookOptions } from 'services/utils'
import {
  GetAdminList,
  AddAdmin,
  RemoveAdmin,
  BatchRemoveAdmin,
} from 'services/modules/adminList'

export default observer(() => {
  const { tableProps, refresh, selectedRows, selectedKeys, toFirst } = useTable(
    GetAdminList,
    {
      pageSize: 10,
      selected: true,
      gridParams: {
        roleKey: 'enterpriseAdmin',
      },
    }
  )
  const {
    openModal,
    closeModal,
    visibleMap,
    requestConfirmProps,
    confirmLoading,
  } = useModalHook(['add'])
  const { run: runAddData } = useRequest(AddAdmin, {
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
  const { run: runRemoveData } = useRequest(RemoveAdmin, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        toFirst()
      },
    }),
  })
  const { run: runBatchRemoveData } = useRequest(BatchRemoveAdmin, {
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

  const onAddOk = (users = []) => {
    runAddData({
      roleId: '1',
      extStaffIds: users.map((item) => item.extId),
    })
  }

  const onBatchRemove = () => {
    const [record] = selectedRows
    const len = selectedRows.length
    const adminName = get(record, 'staff.name')
    if (len === 1) {
      onRemoveRecord(record)
    } else {
      Modal.confirm({
        title: '提示',
        centered: true,
        content: (
          <>
            确定删除“
            <OpenDataEle
              type="userName"
              openid={adminName}
              corpid={UserStore.userData.extCorpId}
            />
            ”等{len}个管理员吗
          </>
        ),
        onOk: () => {
          runBatchRemoveData({
            ids: selectedKeys,
          })
        },
      })
    }
  }
  const onRemoveRecord = (record) => {
    const adminName = get(record, 'staff.name')
    Modal.confirm({
      title: '提示',
      centered: true,
      content: (
        <>
          确定删除管理员“
          <OpenDataEle
            type="userName"
            openid={adminName}
            corpid={UserStore.userData.extCorpId}
          />
          ”吗
        </>
      ),
      onOk: () => {
        runRemoveData({
          id: record.id,
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
      title: '部门',
      dataIndex: 'operatorType',
      render: (_, record) => (
        <DepNames dataSource={get(record, 'staff.departmentList')} />
      ),
    },
    {
      title: '创建人',
      dataIndex: 'creatorStaff',
      render: (val) => <UserTag data={val} />,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
  ]

  return (
    <PageContent>
      <MySelectModal
        baseSearchParams={{
          excludeRoleKey: 'enterpriseAdmin',
        }}
        type="user"
        onlyChooseUser={true}
        visible={visibleMap.addVisible}
        onCancel={closeModal}
        onOk={onAddOk}
        title="选择人员"
        valueKey="id"
        confirmLoading={confirmLoading}
      />
      <TableContent
        {...tableProps}
        rowSelection={{
          ...tableProps.rowSelection,
          getCheckboxProps: (record) => {
            return {
              disabled: get(record, 'staff.extId') === UserStore.userData.extId,
            }
          },
        }}
        columns={columns}
        actions={[
          {
            title: '删除',
            disabled: (record) =>
              get(record, 'staff.extId') === UserStore.userData.extId,
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
            添加管理员
          </Button>,
          <Button
            key="remove"
            type="primary"
            onClick={onBatchRemove}
            ghost
            disabled={selectedKeys.length === 0}
            icon={<DeleteOutlined />}>
            删除管理员
          </Button>,
        ]}
      />
    </PageContent>
  )
})
