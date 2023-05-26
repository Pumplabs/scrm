import { useEffect } from 'react'
import { Modal, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import CommonDrawer from 'components/CommonDrawer'
import { Table } from 'components/TableContent'
import StatusItem from './StatusItem'
import EditStatusModal from './EditStatusModal'
import { useModalHook, useTable } from 'src/hooks'
import { formatColorStr } from 'components/MyColorPicker/utils'
import {
  AddStatus,
  EditStatus,
  RemoveStatus,
  GetConfigList,
} from 'services/modules/commercialOpportunityConfiguration'
import { actionRequestHookOptions } from 'services/utils'
const TYPE_CODE = 'OPPORTUNITY_STAGE'

export default (props) => {
  const { visible, data = {}, ...rest } = props
  const { openModal, closeModal, visibleMap, modalInfo, confirmLoading, requestConfirmProps, } = useModalHook([
    'add',
    'edit',
  ])
  const {
    run: runGetConfigList,
    refresh,
    toFirst,
    tableProps
  } = useTable(GetConfigList, {
    manual: true,
  })
  const { run: runAddStatus } = useRequest(AddStatus, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: ()=> {
        refresh()
        closeModal()
      },
    }),
  })
  const { run: runEditStatus } = useRequest(EditStatus, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '编辑',
      successFn: ()=> {
        refresh()
        closeModal()
      },
    }),
  })
  const { run: runRemoveStatus } = useRequest(RemoveStatus, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: toFirst,
    }),
  })

  useEffect(() => {
    if (visible && data.id) {
      runGetConfigList({}, {
        groupId: data.id,
        typeCode: TYPE_CODE,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, data.id])

  const onAdd = () => {
    openModal('add')
  }
  const onAddStatusOk = (vals) => {
    let params = {
      color: formatColorStr(vals.color, 1),
      groupId: data.id,
      code: modalInfo.data.code,
      isSystem: false,
      name: vals.name,
      sort: 1,
      typeCode: TYPE_CODE,
    }
    if (modalInfo.type === 'add') {
      runAddStatus(params)
    } else {
      params.id = modalInfo.data.id
      runEditStatus(params)
    }
  }

  const onEditRecord = (record) => {
    openModal('edit',record)
  }

  const onRemoveRecord = (record) => {
    Modal.confirm({
      title: '提示',
      content: `确定要删除阶段"${record.name}"吗`,
      onOk: () => {
        runRemoveStatus({
          id: record.id
        })
      },
    })
  }

  const columns = [
    {
      title: '阶段名称',
      dataIndex: 'name',
    },
    {
      title: '阶段颜色',
      dataIndex: 'color',
      render: (val, record) => {
        return (
          <StatusItem
            name={record.name}
            color={val}
          />
        )
      },
    },
    {
      title: '关联数量',
      dataIndex: 'relateCount',
      render: (val) => val || 0,
    },
  ]
  return (
    <CommonDrawer visible={visible} {...rest}>
      <EditStatusModal
        title={visibleMap.addVisible ? '添加阶段' : '修改阶段'}
        visible={visibleMap.addVisible || visibleMap.editVisible}
        onCancel={closeModal}
        confirmLoading={confirmLoading}
        onOk={onAddStatusOk}
        data={modalInfo.data}
      />
      <Button onClick={onAdd} type="primary" icon={<PlusOutlined />}>
        添加阶段
      </Button>
      <Table
        {...tableProps}
        columns={columns}
        actions={[
          {
            title: '编辑',
            disabled: (record) => record.isSystem,
            onClick: onEditRecord,
          },
          {
            title: '删除',
            disabled: (record) => record.isSystem || record.relateCount > 0,
            onClick: onRemoveRecord,
          },
        ]}
      />
    </CommonDrawer>
  )
}
