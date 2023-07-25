import { useContext, useEffect } from 'react'
import { Form, Button, Modal, message, Divider } from 'antd'
import { useRequest } from 'ahooks'
import { get } from 'lodash'
import { MobXProviderContext, observer } from 'mobx-react'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import UserTag from 'components/UserTag'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import AddProduct from './components/AddDrawer'
import { getFileUrl } from 'src/utils'
import { useModalHook, useTable } from 'src/hooks'
import DetailDrawer from './components/DetailDrawer'
import CategorySelect from './components/CategorySelect'
import { actionRequestHookOptions } from 'services/utils'
import {
  BatchRemoveProduct,
  EditProduct,
  GetProductList,
  AddProdcut,
} from 'services/modules/productList'
import { formatNumber } from 'src/utils'
import { PRODUCT_STATUS_VALS } from '../constants'

const coverTableList = async (dataSource) => {
  let fileUrls = {}
  let fileIds = []
  dataSource.forEach((ele) => {
    const files = Array.isArray(ele.atlas) ? ele.atlas : []
    if (files.length) {
      const [fileItem] = ele.atlas
      fileIds = [...fileIds, fileItem.id]
    }
  })


  fileUrls = await getFileUrl({
    ids: fileIds,
  })
  return dataSource.map((ele) => {
    const files = Array.isArray(ele.atlas) ? ele.atlas : []
    if (files.length) {
      const [fileItem] = files
      const url = fileUrls[fileItem.id]
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

export default observer(({ status, onRefresh, changeTab, needRefresh }) => {
  const isSalf = PRODUCT_STATUS_VALS.SALF === status
  const isDraft = PRODUCT_STATUS_VALS.DRAFT === status
  const { UserStore } = useContext(MobXProviderContext)
  const [searchForm] = Form.useForm()
  const { search, tableProps, refresh, selectedRows, selectedKeys, toFirst } =
    useTable(GetProductList, {
      pageSize: 10,
      selected: !isSalf,
      form: searchForm,
      handleList: coverTableList,
      fixedParams: {
        status,
      },
    })
  const {
    openModal,
    closeModal,
    visibleMap,
    modalInfo,
    requestConfirmProps,
    confirmLoading,
  } = useModalHook(['add', 'edit', 'detail', 'copy'])
  const { run: runAddData } = useRequest(AddProdcut, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '添加',
      successFn: (res, [params = {}] = {}) => {
        if (params.status !== status) {
          onRefresh(params.status)
          if (params.status === PRODUCT_STATUS_VALS.DRAFT) {
            changeTab(PRODUCT_STATUS_VALS.DRAFT)
          }
        }
        refresh()
        closeModal()
      },
    }),
  })
  const { run: runEditProduct } = useRequest(EditProduct, {
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
  const { run: runBatchRemoveData } = useRequest(BatchRemoveProduct, {
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
    const { files, editorJson, attrs = [], ...rest } = values
    const hasUploading = files.some((ele) => ele.status === 'uploading')
    if (hasUploading) {
      message.warning('文件正在上传中，请稍后...')
      return
    }
    let params = {
      atlas: files.map((fileItem) => ({
        id: fileItem.isOld ? fileItem.uid : get(fileItem, 'response.data.id'),
        name: fileItem.name,
      })),
      imbue: attrs.map((ele) => ({
        name: ele.name,
        value: ele.value,
      })),
      ...rest,
      description: editorJson,
    }
    if (modalInfo.type === 'add' || modalInfo.type === 'copy') {
      runAddData(params)
    } else if (modalInfo.type === 'edit') {
      params.id = modalInfo.data.id
      params.status = status
      runEditProduct(params)
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
            ”等{len}个产品吗
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
      content: `确定删除产品“${record.name}”吗`,
      onOk: () => {
        runBatchRemoveData({
          ids: [record.id],
        })
      },
    })
  }

  const handleEditParamsByRecord = (record) => {
    return {
      atlas: record.atlas,
      code: record.code,
      description: record.description,
      id: record.id,
      imbue: record.imbue,
      name: record.name,
      price: record.price,
      productTypeId: record.productTypeId,
      profile: record.profile,
    }
  }

  const onHitSalfRecord = (record) => {
    Modal.confirm({
      title: '提示',
      content: `确定要上架产品“${record.name}”吗`,
      onOk: () => {
        runEditProduct(
          {
            ...handleEditParamsByRecord(record),
            status: PRODUCT_STATUS_VALS.SALF,
          },
          { actionName: '操作' }
        )
      },
    })
  }
  const onSoldOutRecord = (record) => {
    Modal.confirm({
      title: '提示',
      content: `确定要下架产品“${record.name}”吗`,
      onOk: () => {
        runEditProduct(
          {
            ...handleEditParamsByRecord(record),
            status: PRODUCT_STATUS_VALS.OFF,
          },
          { actionName: '操作' }
        )
      },
    })
  }

  const onDetailRecord = (record) => {
    openModal('detail', record)
  }

  const onCopyRecord = (record) => {
    openModal('copy', record)
  }

  const columns = [
    {
      title: '产品名称',
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: '缩略图',
      dataIndex: 'dataScope',
      width: 100,
      render: (_, record) => {
        if (record.filePath) {
          return (
            <img
              src={record.filePath}
              alt=""
              style={{ maxWidth: 80, maxHeight: 80 }}
            />
          )
        } else {
          return '无'
        }
      },
    },
    {
      title: '分类',
      dataIndex: 'productType',
      render: (val) => (val ? val.name : ''),
    },
    {
      title: '价格',
      dataIndex: 'price',
      render: (val) =>
        `¥ ${formatNumber(val, {
          padPrecision: 2,
        })}`,
    },
    {
      title: '浏览',
      dataIndex: 'views',
      render: (val) => (val ? val : '-'),
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
  const searchConfig = [
    {
      type: 'input',
      label: '产品名称',
      name: 'name',
    },
    {
      type: 'select',
      label: '分类',
      name: 'productTypeId',
      renderEle: () => <CategorySelect />,
    },
  ]
  return (
    <>
      <AddProduct
        title={`${modalInfo.type === 'edit' ? '编辑' : '添加'}产品`}
        onCancel={closeModal}
        onOk={onAddOk}
        visible={
          visibleMap.addVisible ||
          visibleMap.editVisible ||
          visibleMap.copyVisible
        }
        data={modalInfo.data}
        confirmLoading={confirmLoading}
        isCopy={visibleMap.copyVisible}
        isEdit={visibleMap.editVisible}
      />
      <DetailDrawer
        title="产品详情"
        data={modalInfo.data}
        onCancel={closeModal}
        visible={visibleMap.detailVisible}
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
        operationCol={{ width: isSalf ? 140 : 220 }}
        actions={[
          {
            title: '上架',
            visible: () => !isSalf,
            onClick: onHitSalfRecord,
          },
          {
            title: '下架',
            visible: () => isSalf,
            onClick: onSoldOutRecord,
          },
          {
            title: '编辑',
            visible: () => !isSalf,
            onClick: onEditRecord,
          },
          {
            title: '删除',
            visible: () => !isSalf,
            disabled: (record) => record.id === UserStore.userData.extId,
            onClick: onRemoveRecord,
          },
          {
            title: '详情',
            onClick: onDetailRecord,
          },
          {
            title: '复制',
            onClick: onCopyRecord,
          },
        ]}
        toolBar={[
          <Button
            key="add"
            type="primary"
            onClick={onAdd}
            ghost
            icon={<PlusOutlined />}>
            添加产品
          </Button>,
          !isSalf ? (
            <Button
              key="remove"
              type="primary"
              onClick={onBatchRemove}
              ghost
              disabled={selectedKeys.length === 0}
              icon={<DeleteOutlined />}>
              删除产品
            </Button>
          ) : null,
        ]}
      />
    </>
  )
})
