import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import TableContent from 'components/TableContent'
import UserTag from 'components/UserTag'
import { useTable, useModalHook } from 'src/hooks'
import { actionRequestHookOptions } from 'services/utils'
import {
  GetGroupPageList,
  AddGroup,
  EditGroup,
} from 'services/modules/commercialOpportunity'
import StageConfigDrawer from './StageConfigDrawer'
import AddGroupDrawer from './components/AddGroupDrawer'
export default () => {
  const { modalInfo, openModal, closeModal, visibleMap } = useModalHook([
    'add',
    'edit',
    'config',
  ])
  const {
    tableProps,
    refresh: refreshGroup,
    toFirst,
  } = useTable(GetGroupPageList, {
    fixedParams: {
      typeCode: 'OPPORTUNITY_STAGE',
    },
  })
  const { run: runAddGroup } = useRequest(AddGroup, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: () => {
        refreshGroup()
        closeModal()
      },
    }),
  })
  const { run: runEditGroup } = useRequest(EditGroup, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '编辑',
      successFn: () => {
        refreshGroup()
        closeModal()
      },
    }),
  })

  const onAdd = () => {
    openModal('add')
  }

  const onAddGroupOk = (vals) => {
    if (modalInfo.type === 'add') {
      runAddGroup({
        name: vals.name,
      })
    } else {
      runEditGroup({
        name: vals.name,
        id: modalInfo.data.id,
      })
    }
  }

  const onConfigRecord = (record) => {
    openModal('config', record)
  }
  const onEditRecord = (record) => {
    openModal('edit', record)
  }

  const columns = [
    {
      title: '分组名称',
      dataIndex: 'name',
    },
    {
      title: '创建人',
      dataIndex: 'creatorCN',
      render: (val, record) =>
        record.isSystem ? '--' : <UserTag data={{ name: val }} />,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
  ]
  return (
    <>
      <AddGroupDrawer
        title={visibleMap.editVisible ? '编辑分组' : '添加分组'}
        visible={visibleMap.addVisible || visibleMap.editVisible}
        data={modalInfo.data}
        onOk={onAddGroupOk}
        onCancel={closeModal}
      />
      <StageConfigDrawer
        title="阶段配置"
        visible={visibleMap.configVisible}
        data={modalInfo.data}
        footer={null}
        onCancel={closeModal}
      />
      <TableContent
        {...tableProps}
        columns={columns}
        toolBar={[
          <Button
            key="add"
            type="primary"
            onClick={onAdd}
            ghost
            icon={<PlusOutlined />}>
            添加分组
          </Button>,
        ]}
        actions={[
          {
            title: '阶段配置',
            onClick: onConfigRecord,
          },
          {
            title: '编辑',
            onClick: onEditRecord,
          },
        ]}
      />
    </>
  )
}
