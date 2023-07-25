import { useEffect, useRef, useState } from 'react'
import { Form, Button, Input, Row, Col, InputNumber } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import DrawerForm from 'components/DrawerForm'
import { Table } from 'components/TableContent'
import CommonUpload, { UploadFileBtn } from 'components/CommonUpload'
import MySelect from 'components/MySelect'
import ProductSelect from '../../ProductSelect'
import EditProductModal from './EditProductModal'
import { formatNumber } from 'src/utils'
import { useModalHook } from 'hooks'
import { calcPrice, getOrderAmount } from '../../utils'
import styles from './index.module.less'

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e
  }
  return e && e.fileList
}
const FILES_FILE_TYPE = [
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.ppt',
  '.xlsx',
  '.pptx',
]

export default (props) => {
  const formRef = useRef()
  const updateProductDataRef = useRef()
  const {
    data = {},
    menuData = [],
    visible,
    onOk,
    onCancel,
    confirmLoading,
    isEdit,
    ...rest
  } = props
  const [productDiscount, setProductDiscount] = useState(100)
  const orderAmountRef = useRef(0)
  const { openModal, closeModal, modalInfo, visibleMap } = useModalHook([
    'editProduct',
  ])
  useEffect(() => {
    if (visible && isEdit) {
      refillForm()
    }
    if (!visible) {
      orderAmountRef.current = 0
      setProductDiscount(100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onDiscountChange = (e) => {
    const value = parseFloat(e.target.value)
    setProductDiscount(value)
  }


  const handleDiscountChange = value => {

    setProductDiscount(value)
  }


  const refillForm = () => {
    const {
      collectionAmount,
      customer = {},
      description,
      attachmentIds = [],
      discount,
      managerStaff = {},
      orderAmount,
      productInfoList = [],
    } = data
    const newProducts = Array.isArray(productInfoList) ? productInfoList : []
    const orderDiscount = Number.isNaN(discount * 1) ? 0 : discount * 1
    formRef.current.setFieldsValue({
      files: attachmentIds.map((ele) => ({
        isOld: true,
        id: ele.id,
        name: ele.name,
      })),
      collectionAmount,
      customers: [customer],
      description,
      discount: orderDiscount,
      orderAmount,
      users: [
        {
          ...managerStaff,
          isUser: true,
          key: `user_${managerStaff.extId}`,
        },
      ],
      products: newProducts,
    })
    setProductDiscount(orderDiscount)
  }

  const onEditProdcut = (record) => {
    openModal('editProduct', record)
  }
  const handleOk = (values) => {
    if (typeof onOk === 'function') {
      onOk({
        ...values,
      })
    }
  }

  const onEditProductOk = (vals) => {
    closeModal()
    updateProductDataRef.current({
      ...modalInfo.data,
      ...vals,
    })
  }

  const columns = [
    {
      title: '产品名称',
      dataIndex: 'name',
    },
    {
      title: '原价',
      dataIndex: 'price',
    },
    {
      title: '优惠价格(元)',
      dataIndex: 'newPrice',
    },
    {
      title: '数量',
      dataIndex: 'count',
      width: 100,
      render: (val, record) => {
        return (
          <InputNumber
            min={1}
            max={Number.MAX_SAFE_INTEGER}
            value={val}
            precision={0}
            onChange={(val) => {
              updateProductDataRef.current({
                ...record,
                count: val,
              })
            }}
          />
        )
      },
    },
    {
      title: '折扣(%)',
      dataIndex: 'discount',
      width: 100,
      render: (val, record) => {
        return (
          <InputNumber
            min={1}
            max={100}
            precision={0}
            style={{ width: 80 }}
            value={val}
            onChange={(val) => {
              updateProductDataRef.current({
                ...record,
                discount: val,
              })
            }}
          />
        )
      },
    },
    {
      title: '描述',
      dataIndex: 'profile',
      ellipsis: true,
    },
  ]

  const initVals = {
    discount: 100,
    collectionAmount: 0
  }

  return (
    <DrawerForm
      {...rest}
      visible={visible}
      getForm={(r) => (formRef.current = r)}
      width={780}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      formProps={{
        initialValues: initVals,
      }}>
      <EditProductModal
        title="编辑产品"
        visible={visibleMap.editProductVisible}
        data={modalInfo.data}
        onCancel={closeModal}
        onOk={onEditProductOk}
      />
      <Row>
        <Col span={24}>
          <Form.Item
            label="客户"
            name="customers"
            rules={[{ required: true, message: '请选择客户' }]}>
            <MySelect
              type="allCustomer"
              valueKey="extId"
              title="选择客户"
              placeholder="选择客户"
              style={{ width: '100%' }}
              max={1}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="负责人"
            name="users"
            rules={[
              {
                required: true,
                message: '请输入产品名称',
              },
            ]}>
            <MySelect
              type="user"
              title="选择员工"
              placeholder="请选择使用员工"
              onlyChooseUser={true}
              max={1}
              valueKey="extId"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="产品"
            name="products"
            rules={[
              {
                required: true,
                message: '请选择产品',
              },
            ]}
            getValueFromEvent={(e) => {
              return Array.isArray(e)
                ? e.map((item) => {
                  let data = {
                    ...item,
                  }
                  if (!item.count) {
                    data.count = 1
                  }
                  if (!item.discount) {
                    data.discount = 100
                  }
                  data.newPrice = calcPrice(data.price, data.discount)
                  return data
                })
                : e
            }}>
            <ProductSelect>
              {({ tags, onCloseTag, updateTag, onAddTags }) => {
                updateProductDataRef.current = updateTag
                const orderAmount = getOrderAmount(tags, productDiscount)
                orderAmountRef.current = orderAmount
                return (
                  <Table
                    title={() => (
                      <Button
                        icon={<PlusOutlined />}
                        type="primary"
                        onClick={onAddTags}>
                        添加产品
                      </Button>
                    )}
                    actions={[
                      {
                        title: '编辑',
                        onClick: onEditProdcut,
                      },
                      {
                        title: '刪除',
                        onClick: onCloseTag,
                      },
                    ]}
                    columns={columns}
                    dataSource={tags}
                    operationCol={{ width: 90 }}
                    scroll={{ x: 800 }}
                    footer={() => (
                      <div className={styles['table-footer']}>
                        <Form.Item
                          label={
                            <span
                              style={{ display: 'inline-block', width: 110 }}>
                              折扣(%)
                            </span>
                          }
                          name="discount"
                          rules={[
                            {
                              required: false,
                              message: '请输入',
                            },
                          ]}
                          onChange={onDiscountChange}>
                          <InputNumber
                            placeholder="请输入"
                            disabled={tags.length === 0}
                            max={100}
                            min={1}
                            precision={0}
                            onBlur={onDiscountChange}
                            onChange={handleDiscountChange}
                          />
                        </Form.Item>
                        <div className={styles['info-item']}>
                          <span className={styles['info-item-name']}>
                            订单金额(元)
                          </span>
                          <div className={styles['info-item-content']}>
                            {formatNumber(orderAmount, {
                              padPrecision: 2,
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  />
                )
              }}
            </ProductSelect>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="已收款金额"
            name="collectionAmount"
            rules={[
              {
                required: true,
                validator: async (_, value) => {
                  const numVal = value * 1
                  if (Number.isNaN(numVal)) {
                    throw new Error('请输入收款金额')
                  } else if (value > orderAmountRef.current) {
                    throw new Error('收款金额不能大于订单金额')
                  } else {
                    return Promise.resolve()
                  }
                },
              },
            ]}>
            <InputNumber
              placeholder="请输入"
              min={0}
              max={Number.MAX_SAFE_INTEGER}
              precision={2}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="描述"
            name="description"
            rules={[
              {
                required: false,
                message: '请输入描述',
              },
            ]}>
            <Input.TextArea placeholder="请输入描述" maxLength={500} rows={6} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="附件"
            name="files"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            extra={
              <div>
                1. 仅支持上传{FILES_FILE_TYPE.join()}类型文件
                <br />
                2. 文件大小不超过20M
              </div>
            }>
            <CommonUpload
              validOptions={{
                maxFileSize: 20,
                maxFileTotalLen: 20,
                acceptTypeList: FILES_FILE_TYPE,
              }}
              onBeforeUpload={(_, flag) => flag}>
              <UploadFileBtn title="上传文件" />
            </CommonUpload>
          </Form.Item>
        </Col>
      </Row>
    </DrawerForm>
  )
}
