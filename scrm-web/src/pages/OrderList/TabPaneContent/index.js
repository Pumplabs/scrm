import { useEffect, useContext } from 'react'
import { Form, Button, Modal, message } from 'antd'
import { useRequest } from 'ahooks'
import { get } from 'lodash'
import cls from 'classnames'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { observer, MobXProviderContext } from 'mobx-react'
import UserTag from 'components/UserTag'
import WeChatCell from 'components/WeChatCell'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import AddOrderDrawer from './components/AddOrderDrawer'
import OrderDetailModal from './components/OrderDetailModal'
import ApproveOrderDrawer from './components/ApproveOrderDrawer'
import { getFileUrl, formatNumber } from 'src/utils'
import { useModalHook, useTable } from 'src/hooks'
import { actionRequestHookOptions } from 'services/utils'
import {
  GetOrderList,
  SaveOrder,
  EditOrder,
  RemoveOrder,
} from 'services/modules/orderList'
import {
  ORDER_STATUS_VALS,
  ORDER_STATUS_OPTIONS,
  ORDER_STATUS_NAMES,
} from '../constants'
import { getOrderAmount } from './utils'
import styles from './index.module.less'

const coverTableList = async (dataSource) => {
  let fileUrls = {}
  let fileIds = []
  dataSource.forEach((ele) => {
    if (ele.atlas && ele.atlas.length) {
      const [idItem] = ele.atlas
      fileIds = [...fileIds, idItem]
    }
  })
  fileUrls = await getFileUrl({
    ids: fileIds,
  })
  return dataSource.map((ele) => {
    if (ele.atlas && ele.atlas.length) {
      const [idItem] = ele.atlas
      const url = fileUrls[idItem]
      if (url) {
        return {
          ...ele,
          filePath: url,
        }
      } else {
        return ele
      }
    } else {
      return ele
    }
  })
}

export default observer(({ status = '', onRefresh, needRefresh }) => {
  const { UserStore } = useContext(MobXProviderContext)
  const [searchForm] = Form.useForm()
  const {
    openModal,
    closeModal,
    visibleMap,
    modalInfo,
    requestConfirmProps,
    confirmLoading,
  } = useModalHook(['add', 'edit', 'detail', 'copy', 'approve'])
  const { search, tableProps, refresh, selectedRows, selectedKeys, toFirst } =
    useTable(GetOrderList, {
      pageSize: 10,
      selected: true,
      form: searchForm,
      handleList: coverTableList,
      fixedParams:
        status === 'all'
          ? {}
          : {
              status,
            }
    })
  const { run: runAddData } = useRequest(SaveOrder, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '添加',
      successFn: (res, [params = {}] = {}) => {
        if (params.status !== status) {
          onRefresh(params.status)
        }
        refresh()
        closeModal()
      },
    }),
  })
  const { run: runEditOrder } = useRequest(EditOrder, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      getActionName: ([, { actionName } = {}]) =>
        actionName ? actionName : '编辑',
      successFn: (res, [params = {}] = {}) => {
        if (params.status !== status) {
          onRefresh(params.status)
        }
        refresh()
        closeModal()
      },
    }),
  })
  const { run: runBatchRemoveData } = useRequest(RemoveOrder, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        toFirst()
      },
    }),
  })

  useEffect(() => {
    if (needRefresh) {
      refresh()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needRefresh])

  const onAdd = () => {
    openModal('add')
  }

  const onAddOk = (values) => {
    const {
      files = [],
      description,
      products = [],
      collectionAmount,
      users = [],
      customers = [],
      discount,
    } = values
    const hasUploading = files.some((ele) => ele.status === 'uploading')
    if (hasUploading) {
      message.warning('文件正在上传中')
      return
    }
    const orderAmount = getOrderAmount(products, discount)
    let params = {
      attachments: files.map((fileItem) => ({
        id: fileItem.isOld ? fileItem.uid : get(fileItem, 'response.data.id'),
        name: fileItem.name,
      })),
      description,
      collectionAmount,
      customerExtId: customers[0].extId,
      discount: discount / 100,
      orderAmount,
      managerStaffExtId: users[0].extId,
      productList: products.map((item) => ({
        discount: item.discount / 100,
        productName: item.name,
        productNum: item.count,
        productPrice: item.price,
        remark: item.profile
      })),
    }
    if (modalInfo.type === 'add' || modalInfo.type === 'copy') {
      runAddData(params)
    } else if (modalInfo.type === 'edit') {
      const modalData = modalInfo.data
      params = {
        ...params,
        id: modalData.id,
        status: modalData.status,
        orderCode: modalData.orderCode,
      }
      runEditOrder(params)
    }
  }

  const onApproveOk = (vals) => {
    const record = modalInfo.data
    const params = handleBaseParams(record, {
      status: vals.type,
      auditFailedMsg: vals.remark,
    })
    runEditOrder(params, {
      actionName: '操作',
    })
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
            {record.orderCode}
            ”等{len}个订单吗
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

  const onEditRecord = (record) => {
    openModal('edit', record)
  }

  const onRemoveRecord = (record) => {
    Modal.confirm({
      title: '提示',
      centered: true,
      content: `确定删除订单“${record.orderCode}”吗`,
      onOk: () => {
        runBatchRemoveData({
          ids: [record.id],
        })
      },
    })
  }

  const handleBaseParams = (record, opts = {}) => {
    const {
      attachments = [],
      orderProductList,
      orderAmount,
      managerStaffExtId,
      description,
      discount,
      collectionAmount,
      customerExtId,
    } = record
    const files = Array.isArray(attachments) ? attachments : []
    const productList = Array.isArray(orderProductList) ? orderProductList : []
    return {
      attachments: files,
      description,
      collectionAmount,
      customerExtId,
      discount,
      orderAmount,
      managerStaffExtId,
      productList: productList.map((item) => ({
        id: item.id,
        orderId: record.id,
        discount: item.discount,
        productName: item.productName,
        productNum: item.productNum,
        productPrice: item.productPrice,
        remark: item.remark,
      })),
      id: record.id,
      orderCode: record.orderCode,
      ...opts
    }
  }
  const onDoneRecord = (record) => {
    const params = handleBaseParams(record, {
      status: record.status,
      collectionAmount: record.orderAmount,
    })
    Modal.confirm({
      title: '提示',
      content: `确定要完成订单"${record.orderCode}"吗`,
      onOk: () => {
        runEditOrder(params, {
          actionName: '操作',
        })
      },
    })
  }

  const onApproveRecord = (record) => {
    openModal('approve', record)
  }

  const onDetailRecord = (record) => {
    openModal('detail', record)
  }

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderCode',
      ellipsis: true,
      render: (val) => (val ? val : '-'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (val) => <StautsItem status={val} />,
    },
    {
      title: '客户',
      width: 160,
      dataIndex: 'customer',
      render: (val) => <WeChatCell data={val} />,
    },
    {
      title: '金额',
      dataIndex: 'orderAmount',
      render: (val) =>
        formatNumber(val, {
          padPrecision: 2,
        }),
    },
    {
      title: '已收款',
      dataIndex: 'collectionAmount',
      render: (val) =>
        val
          ? formatNumber(val, {
              padPrecision: 2,
            })
          : '-',
    },
    {
      title: '负责人',
      dataIndex: 'managerStaff',
      render: (val) => <UserTag data={val} />,
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
  const statusSearchConfig =
    status === 'all'
      ? [
          {
            type: 'select',
            label: '订单状态',
            name: 'status',
            eleProps: {
              options: ORDER_STATUS_OPTIONS,
            },
          },
        ]
      : []
  const searchConfig = [
    {
      type: 'input',
      label: '订单编号',
      name: 'orderCode',
    },
    ...statusSearchConfig,
  ]
  return (
    <>
      <AddOrderDrawer
        title={`${modalInfo.type === 'edit' ? '编辑' : '添加'}订单`}
        onCancel={closeModal}
        onOk={onAddOk}
        visible={
          visibleMap.addVisible ||
          visibleMap.editVisible ||
          visibleMap.copyVisible
        }
        data={modalInfo.data}
        confirmLoading={confirmLoading}
        isEdit={visibleMap.editVisible || visibleMap.copyVisible}
      />
      <OrderDetailModal
        title="订单详情"
        data={modalInfo.data}
        onCancel={closeModal}
        visible={visibleMap.detailVisible}
      />
      <ApproveOrderDrawer
        title="审核"
        visible={visibleMap.approveVisible}
        data={modalInfo.data}
        confirmLoading={confirmLoading}
        onOk={onApproveOk}
        onCancel={closeModal}
      />
      <SearchForm
        configList={searchConfig}
        onSearch={search.submit}
        onReset={search.reset}
        form={searchForm}
      />
      <TableContent
        {...tableProps}
        columns={columns}
        operationCol={{ width: 160 }}
        actions={[
          {
            title: '审核',
            visible: (record) => ORDER_STATUS_VALS.INIT === record.status,
            onClick: onApproveRecord,
          },
          {
            title: '修改',
            visible: (record) =>
              record.status === ORDER_STATUS_VALS.REJECT &&
              get(record, 'creatorStaff.extId') === UserStore.userData.extId,
            onClick: onEditRecord,
          },
          {
            title: '完成订单',
            visible: (record) => record.status === ORDER_STATUS_VALS.CONFIRM,
            onClick: onDoneRecord,
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
            创建订单
          </Button>,
          <Button
            key="remove"
            type="primary"
            onClick={onBatchRemove}
            ghost
            disabled={selectedKeys.length === 0}
            icon={<DeleteOutlined />}>
            删除订单
          </Button>,
        ]}
      />
    </>
  )
})

const StautsItem = ({ status }) => {
  return (
    <span
      className={cls({
        [styles['status-item']]: true,
        [styles['init']]: ORDER_STATUS_VALS.INIT === status,
        [styles['done']]: ORDER_STATUS_VALS.DONE === status,
        [styles['confirm']]: ORDER_STATUS_VALS.CONFIRM === status,
        [styles['cancel']]: ORDER_STATUS_VALS.CANCEL === status,
        [styles['reject']]: ORDER_STATUS_VALS.REJECT === status,
      })}>
      {ORDER_STATUS_NAMES[status]}
    </span>
  )
}
