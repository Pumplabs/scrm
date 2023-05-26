import { Button, Modal } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import TableContent from 'components/TableContent'
import { PageContent } from 'layout'
import ModifyCodeDrawer from './components/ModifyCategoryDrawer'
import { useModalHook, useTable } from 'src/hooks'
import { actionRequestHookOptions } from 'services/utils'
import {
  AddCategory,
  EditCategory,
  BatchRemoveCategory,
  GetCategoryTableList,
} from 'services/modules/productCategory'

export default () => {
  const {
    openModal,
    closeModal,
    visibleMap,
    modalInfo,
    confirmLoading,
    requestConfirmProps,
  } = useModalHook(['add', 'edit'])
  const {
    tableProps,
    refresh: refreshTable,
    toFirst,
    selectedKeys,
    selectedRows,
  } = useTable(GetCategoryTableList, {
    selected: true,
  })

  const { run: runBatchRemoveCategory } = useRequest(BatchRemoveCategory, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        toFirst()
      },
    }),
  })
  const { run: runAddCategory } = useRequest(AddCategory, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: () => {
        refreshTable()
        closeModal()
      },
    }),
  })
  const { run: runEditCategory } = useRequest(EditCategory, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '编辑',
      successFn: () => {
        refreshTable()
        closeModal()
      },
    }),
  })

  const onEditRecord = (data) => {
    openModal('edit', data)
  }

  const onRemoveRecord = (data) => {
    Modal.confirm({
      centered: true,
      title: '提示',
      content: `确定要删除分类"${data.name}"吗?`,
      onOk: () => {
        runBatchRemoveCategory({
          ids: [data.id],
        })
      },
    })
  }

  const onAdd = () => {
    openModal('add')
  }

  const onBatchRemoveCategory = () => {
    const rowLen = selectedRows.length
    const [record] = selectedRows
    if (rowLen === 1) {
      onRemoveRecord(record)
    } else {
      Modal.confirm({
        title: '提示',
        content: `确定要是删除"${record.name}"等${rowLen}个分类吗`,
        centered: true,
        onOk: () => {
          runBatchRemoveCategory({
            ids: selectedKeys,
          })
        },
      })
    }
  }

  const onAddCategoryOk = (vals) => {
    if (modalInfo.type === 'add') {
      runAddCategory(vals)
    } else {
      runEditCategory({
        ...vals,
        id: modalInfo.data.id,
      })
    }
  }

  const columns = [
    {
      dataIndex: 'name',
      title: '分类名称',
    },
    {
      title: '分类描述',
      dataIndex: 'description',
    },
    {
      dataIndex: 'productNum',
      title: '产品数量',
    },
  ]

  return (
    <PageContent>
      <ModifyCodeDrawer
        name="分类"
        modalType={modalInfo.type}
        data={modalInfo.data}
        visible={visibleMap.addVisible || visibleMap.editVisible}
        onOk={onAddCategoryOk}
        onCancel={closeModal}
        confirmLoading={confirmLoading}
      />
      <TableContent
        {...tableProps}
        scroll={{ x: 1200 }}
        columns={columns}
        operationCol={{ width: 120 }}
        rowSelection={{
          ...tableProps.rowSelection,
          getCheckboxProps: (record) => {
            return {
              disabled: record.productNum > 0,
            }
          },
        }}
        actions={[
          {
            title: '编辑',
            onClick: onEditRecord,
          },
          {
            title: '删除',
            disabled: record => record.productNum > 0,
            onClick: onRemoveRecord,
          },
        ]}
        toolBar={[
          <Button key="add" onClick={onAdd} type="primary" ghost>
            <PlusOutlined />
            添加分类
          </Button>,
          <Button
            key="remove"
            onClick={onBatchRemoveCategory}
            type="primary"
            ghost
            disabled={!selectedKeys.length}>
            <DeleteOutlined />
            批量删除
          </Button>,
        ]}
      />
    </PageContent>
  )
}
