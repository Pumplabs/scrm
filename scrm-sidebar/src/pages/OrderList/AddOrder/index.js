import { useRef, useContext, useMemo, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { observer, MobXProviderContext } from 'mobx-react'
import { toJS } from 'mobx'
import { decode } from 'js-base64'
import { useRequest } from 'ahooks'
import { uniqueId } from 'lodash'
import { Button, Form, ActionSheet, Input, TextArea, Toast } from 'antd-mobile'
import { RightOutline, UploadOutline } from 'antd-mobile-icons'
import { UploadFormItem } from 'components/UploadFile'
import OpenEle from 'components/OpenEle'
import CustomerText from 'components/CustomerText'
import ChooseCustomersPopup from './components/ChooseCustomers'
import ChooseProductPopup from './components/ChooseProductPopup'
import AddProductPopup from './components/AddProductPopup'
import { useModalHook, useBack } from 'src/hooks'
import { encodeUrl, formatNumber } from 'src/utils'
import { ATTACH_TYPES } from 'components/UploadFile/constants'
import { actionRequestHookOptions, getRequestError } from 'services/utils'
import { AddOrder, GetOrderDetail, EditOrder } from 'services/modules/order'
import MyTable from '../MyTable'
import { STATUS_VALS } from '../constants'
import { decodeUrl } from 'src/utils/paths'
import styles from './index.module.less'

const fileTypes = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.ppt',
  '.xlsx',
  '.pptx',
  '.jpg',
  'jpeg',
  '.png',
]
// const acceptFileTypes = [...IMG_TYPES, ...VIDEO_TYPES]
export default observer(() => {
  const { ModifyStore, UserStore } = useContext(MobXProviderContext)
  const [form] = Form.useForm()
  const { id: parId } = useParams()
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const toastRef = useRef()
  const searchParams = useMemo(
    () => (search ? decodeUrl(search) : {}),
    [search]
  )
  const onBack = () => {
    ModifyStore.clearOrderData()
    const url = searchParams.backUrl || '/orderList'
    navigate(url)
  }
  useBack({
    onBack,
  })
  const { run: runAddOrder } = useRequest(AddOrder, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: onBack,
    }),
  })
  const { run: runEditOrder } = useRequest(EditOrder, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '编辑',
      successFn: onBack,
    }),
  })
  const orderId = useMemo(() => {
    return parId ? decode(parId) : ''
  }, [parId])
  useBack({
    onBack,
  })
  const { data: orderData = {}, run: runGetOrderDetail } = useRequest(
    GetOrderDetail,
    {
      manual: true,
      onBefore: () => {
        toastRef.current = Toast.show({
          icon: 'loading',
          duration: 0,
        })
      },
      onFinally: () => {
        if (toastRef.current) {
          toastRef.current.close()
          toastRef.current = null
        }
      },
      onError: (e) => {
        getRequestError(e, '查询失败')
        onBack()
      },
      onSuccess: () => {
        const { creatorStaff, attachments, customer, orderProductList } =
          orderData
        const attachmentList = Array.isArray(attachments) ? attachments : []
        const productList = Array.isArray(orderProductList)
          ? orderProductList.map((ele) => ({
              id: ele.id,
              name: ele.productName,
              discount: ele.discount * 100,
              price: ele.productPrice,
              count: ele.productNum,
              info: ele.remark,
            }))
          : []
        const nextOrderData = {
          // 客户
          customers: customer ? [customer] : [],
          // 员工
          users: creatorStaff ? [creatorStaff] : [],
          // 产品
          products: productList,
          // 文件
          files: attachmentList.map((ele) => ({
            type: ATTACH_TYPES.FILE,
            uid: ele.id,
            content: {
              fileId: ele.id,
              name: ele.name,
            },
          })),
          // 折扣
          discount: orderData.discount * 100,
          // 金额
          collectionAmount: orderData.collectionAmount,
          // 描述
          description: orderData.description,
        }
        ModifyStore.updateOrderData(nextOrderData)
        // 获取到值
        form.setFieldsValue({
          customers: nextOrderData.customers,
          users: nextOrderData.users,
          discount: nextOrderData.discount,
          files: nextOrderData.files,
          products: nextOrderData.products,
          orderAmount: nextOrderData.orderAmount,
          description: nextOrderData.description,
          collectionAmount: nextOrderData.collectionAmount,
        })
      },
    }
  )

  const isEdit = pathname.startsWith('/editOrder')
  useEffect(() => {
    if (orderId && ModifyStore.orderData.init) {
      runGetOrderDetail({
        id: orderId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, ModifyStore.orderData.init])
  useEffect(() => {
    if (form && !isEdit && UserStore.userData.id) {
      let users = []
      // userData.isAdmin
      const orderData = toJS(ModifyStore.orderData)
      if (ModifyStore.orderData.init && !UserStore.userData.isAdmin) {
        users = [toJS(UserStore.userData)]
        ModifyStore.updateOrderData({
          users,
        })
      } else {
        users = orderData.users
      }
      form.setFieldsValue({
        users,
        customers: orderData.customers,
        discount: orderData.discount,
        files: orderData.files,
        products: orderData.products,
        orderAmount: orderData.orderAmount,
        description: orderData.description,
        collectionAmount: orderData.collectionAmount,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserStore.userData.id])

  useEffect(() => {
    return () => {
      if (toastRef.current) {
        toastRef.current.close()
        toastRef.current = null
      }
    }
  }, [])

  const customers = useMemo(() => {
    return toJS(ModifyStore.orderData.customers)
  }, [ModifyStore.orderData.customers])
  const users = useMemo(() => {
    return toJS(ModifyStore.orderData.users)
  }, [ModifyStore.orderData.users])
  const products = useMemo(() => {
    return toJS(ModifyStore.orderData.products)
  }, [ModifyStore.orderData.products])
  const files = useMemo(() => {
    return toJS(ModifyStore.orderData.files)
  }, [ModifyStore.orderData.files])
  const discount = useMemo(() => {
    return ModifyStore.orderData.discount
  }, [ModifyStore.orderData.discount])
  // const orderNum = useMemo(() => {
  //   return ModifyStore.orderData.orderNu
  // }, [ModifyStore.orderData.orderNum])
  // const description = useMemo(() => {
  //   return ModifyStore.orderData.description
  // }, [ModifyStore.orderData.description])
  const totalOrderAmount = useMemo(() => {
    return products.reduce((total, ele) => {
      const price = (ele.price * ele.count * ele.discount) / 100
      return total + price
    }, 0)
  }, [products])

  const { openModal, closeModal, visibleMap, modalInfo } = useModalHook([
    'chooseProduct',
    'addProduct',
    'editProduct',
    'chooseCustomer',
    'action',
  ])

  const currentPath = useMemo(() => {
    return `${pathname}${search ? '?' + search : ''}`
  }, [pathname, search])

  // 订单金额
  const orderAmount = totalOrderAmount * (discount / 100)

  const onAddProduct = () => {
    openModal('addProduct')
  }

  const onSelectedCustomer = () => {
    openModal('chooseCustomer')
  }

  const onSelectUser = () => {
    navigate(
      `/selectUser?${encodeUrl({
        backUrl: currentPath,
        mode: 'order',
      })}`
    )
  }

  // const onFileChange = ({ files = [] }) => {
  //   console.log('files', files)
  //   // setFiles(files)
  //   ModifyStore.updateOrderData('files', files)
  // }

  const onValuesChange = (vals) => {
    ModifyStore.updateOrderData(vals)
  }

  const onChooseProductOk = (arr) => {
    ModifyStore.updateOrderData('products', arr)
    closeModal()
    form.setFieldsValue({
      products: arr,
    })
  }

  const onChooseCustomersOk = (arr) => {
    form.setFieldsValue({
      customers: arr,
    })
    ModifyStore.updateOrderData('customers', arr)
    closeModal()
  }

  const onAddProductOk = (vals) => {
    let arr = []
    if (modalInfo.type === 'addProduct') {
      arr = [
        ...products,
        {
          id: uniqueId('productId'),
          isNew: true,
          ...vals,
        },
      ]
    } else {
      arr = products.map((ele) => {
        if (ele.id === modalInfo.data.id) {
          return {
            ...ele,
            ...vals,
          }
        } else {
          return ele
        }
      })
    }
    ModifyStore.updateOrderData('products', arr)
    form.setFieldsValue({
      products: arr,
    })
    closeModal()
  }

  const onFinish = (vals = {}) => {
    const hasUploadingFile = files.some((item) => item.status === 'uploading')
    if (hasUploadingFile) {
      Toast.show({
        content: '有文件正在上传中，请稍后再试...',
        icon: <UploadOutline />,
      })
      return
    }
    let params = {
      attachments: files.map((ele) => ({
        id: ele.content.fileId,
        name: ele.content.name,
      })),
      collectionAmount: vals.collectionAmount,
      customerExtId: customers[0].extId,
      description: vals.description,
      discount: discount / 100,
      managerStaffExtId: users[0].extId,
      orderAmount: totalOrderAmount * (discount / 100),
      // productIds: products.map((ele) => ele.id),
      productList: products.map((ele) => {
        let data = {
          productName: ele.name,
          productPrice: ele.price,
          discount: ele.discount / 100,
          productNum: ele.count,
          remark: ele.info,
          // "orderId": "",
          // "productId": "",
        }
        if (!ele.isNew) {
          data = {
            ...data,
            id: ele.id,
          }
        }
        if (isEdit) {
          data = {
            ...data,
            orderId: orderData.id,
          }
        }
        return data
      }),
      status: orderData.status,
    }
    // console.log(params)
    if (isEdit) {
      params = {
        ...params,
        id: orderData.id,
        status: STATUS_VALS.WAIT_CHECK,
        auditFailedMsg: '',
      }
      runEditOrder(params)
    } else {
      runAddOrder(params)
    }
  }

  const onTableAction = (record) => {
    openModal('action', record)
  }

  const onActionOk = (action) => {
    if (action.key === 'edit') {
      openModal('editProduct', modalInfo.data)
    } else {
      const arr = products.filter((ele) => ele.id !== modalInfo.data.id)
      ModifyStore.updateOrderData('products', arr)
      form.setFieldsValue({
        products: arr,
      })
      closeModal()
    }
  }

  const checkCollectionAmount = (_, value) => {
    if (value > orderAmount) {
      return Promise.reject(new Error('收款金额不能大于订单金额'))
    } else {
      return Promise.resolve()
    }
  }

  const productColumns = [
    {
      title: '产品',
      dataIndex: 'name',
    },
    {
      title: '单价',
      dataIndex: 'price',
    },
    {
      title: '折扣(%)',
      dataIndex: 'discount',
    },
    {
      title: '数量',
      dataIndex: 'count',
    },
  ]
  const initialValues = {
    discount,
  }
  const actions = [
    {
      text: <span className={styles['edit-action']}>修改产品信息</span>,
      key: 'edit',
    },
    {
      text: <span className={styles['remove-action']}>移除产品</span>,
      key: 'remove',
    },
  ]
  return (
    <div>
      <ActionSheet
        visible={visibleMap.actionVisible}
        actions={actions}
        onClose={closeModal}
        onAction={onActionOk}
      />
      <ChooseProductPopup
        visible={visibleMap.chooseProductVisible}
        onCancel={closeModal}
        selectedList={products}
        onOk={onChooseProductOk}
      />
      <ChooseCustomersPopup
        visible={visibleMap.chooseCustomerVisible}
        onCancel={closeModal}
        selectedList={customers}
        onOk={onChooseCustomersOk}
      />
      <AddProductPopup
        data={modalInfo.data}
        title={visibleMap.addProductVisible ? '新增产品' : '修改产品信息'}
        visible={visibleMap.addProductVisible || visibleMap.editProductVisible}
        onCancel={closeModal}
        onOk={onAddProductOk}
      />
      <Form
        layout="horizontal"
        form={form}
        onValuesChange={onValuesChange}
        onFinish={onFinish}
        footer={
          <Button block type="submit" color="primary" size="large">
            {isEdit ? '保存订单' : '创建订单'}
          </Button>
        }
        initialValues={initialValues}>
        <Form.Item
          name="customers"
          label="客户"
          childElementPosition="right"
          required={false}
          rules={[{ required: true, message: '请选择客户' }]}>
          <SelectText onClick={onSelectedCustomer}>
            {(value) => (
              <>
                {Array.isArray(value) && value.length
                  ? customers.map((ele) => (
                      <CustomerText key={ele.extId} data={ele} />
                    ))
                  : '请选择客户'}
              </>
            )}
          </SelectText>
        </Form.Item>
        <Form.Item
          name="users"
          label="负责人"
          required={false}
          childElementPosition="right"
          rules={[{ required: true, message: '请选择负责人' }]}>
          <SelectText
            onClick={UserStore.userData.isAdmin ? onSelectUser : undefined}>
            {users.length
              ? users.map((ele) => (
                  <OpenEle type="userName" openid={ele.extId} key={ele.extId} />
                ))
              : '请选择负责人'}
          </SelectText>
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              type: 'array',
              message: '请选择产品',
            },
          ]}
          name="products"
          valuePropName="dataSource">
          <MyTable
            columns={productColumns}
            onAction={onTableAction}
            rowDesc={(record) =>
              record.info ? (
                <div className={styles['row-desc']}>{record.info}</div>
              ) : null
            }
            footer={
              <div className={styles['product-btns']}>
                <Button
                  color="primary"
                  fill="outline"
                  shape="rounded"
                  onClick={onAddProduct}>
                  添加新产品
                </Button>
              </div>
            }
          />
        </Form.Item>
        <Form.Item
          name="discount"
          label="折扣"
          childElementPosition="right"
          required={false}
          rules={[{ required: true, message: '请输入折扣' }]}>
          <Input type="number" max={100} min={1} placeholder="请输入" />
        </Form.Item>
        <Form.Item
          label="订单金额"
          childElementPosition="right"
          required={false}>
          <span className={styles['orderAmountSign']}>¥</span>
          {`${formatNumber(orderAmount)}`}
        </Form.Item>
        <Form.Item
          name="collectionAmount"
          label="收款金额"
          childElementPosition="right"
          required={false}
          rules={[
            {
              required: true,
              validator: checkCollectionAmount,
            },
          ]}>
          <Input
            type="number"
            max={Number.MAX_SAFE_INTEGER}
            min={0}
            placeholder="请输入"
            className={styles['collectionAmountInput']}
          />
        </Form.Item>
        <Form.Item name="description" label="订单描述" layout="vertical">
          <TextArea placeholder="请填写订单描述吧，120字以内" maxLength={120} />
        </Form.Item>
        <Form.Item
          className={styles['file-form-item']}
          name="files"
          valuePropName="fileList"
          label="附件（最多上传9个附件）"
          required={false}
          layout="vertical">
          <UploadFormItem
            showLabel={false}
            acceptTypeList={fileTypes}
            className={styles['file-upload']}
            previewFile={true}
            attachmentConfig={{
              showTrackMaterial: false,
              showNormalMaterial: false,
            }}
          />
        </Form.Item>
      </Form>
    </div>
  )
})

const SelectText = ({ children, onClick, value }) => {
  return (
    <p className={styles['user-select-item']} onClick={onClick}>
      {typeof children === 'function' ? children(value) : children}
      {typeof onClick === 'function' ? (
        <RightOutline className={styles['select-icon']} />
      ) : null}
    </p>
  )
}
