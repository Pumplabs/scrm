import { useEffect, useRef, useState } from 'react'
import { Form, Input, Spin, Row, Col, Button, InputNumber, Space } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import DrawerForm from 'components/DrawerForm'
import { PictureUpload, UploadImgBtn } from 'components/CommonUpload'
import CategorySelect from '../CategorySelect'
import Editor from 'src/pages/SaleOperations/TrackMaterial/Article/ArticleEditor/ArticleContentEditor'
import { WX_IMG_FILE_TYPE, WX_IMG_FILE_SIZE } from 'src/utils/constants'
import { getFileUrl } from 'src/utils'
import { PRODUCT_STATUS_VALS } from '../../../constants'
import styles from './index.module.less'

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e
  }
  return e && e.fileList
}

export default (props) => {
  const formRef = useRef()
  const editorRef = useRef()
  const saveTypeRef = useRef()
  const [dataLoading, setDataLoading] = useState(false)
  const {
    data = {},
    menuData = [],
    visible,
    onOk,
    onCancel,
    confirmLoading,
    isEdit,
    isCopy,
    ...rest
  } = props

  useEffect(() => {
    if (!visible) {
      saveTypeRef.current = ''
      setDataLoading(false)
    }
    if (visible && (isEdit || isCopy)) {
      refillForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const refillForm = async () => {
    const { imbue = [], atlas = [] } = data
    const fileList = Array.isArray(atlas) ? atlas: []
    if (fileList.length) {
      setDataLoading(true)
    }
    const fileIds = fileList.map(ele => ele.id)
    const fileUrls = await getFileUrl({
      ids: fileIds,
    })
    formRef.current.setFieldsValue({
      name: data.name,
      files: fileList.map((ele) => ({
        uid: ele.id,
        isOld: true,
        url: fileUrls[ele.id],
        name: ele.name
      })),
      productTypeId: data.productTypeId,
      price: data.price,
      profile: data.profile,
      attrs: Array.isArray(imbue) ? imbue : [],
    })
    if (editorRef.current && data.description) {
      editorRef.current.txt.setJSON(data.description)
    }
    setDataLoading(false)
  }
  const onSaveDraft = () => {
    saveTypeRef.current = PRODUCT_STATUS_VALS.DRAFT
    formRef.current.submit()
  }
  const onCreate = () => {
    saveTypeRef.current = PRODUCT_STATUS_VALS.SALF
    formRef.current.submit()
  }

  const handleOk = (values) => {
    const editorJson = editorRef.current ? editorRef.current.txt.getJSON() : []
    if (typeof onOk === 'function') {
      onOk({
        ...values,
        editorJson,
        status: saveTypeRef.current,
      })
    }
  }

  const getButtonProps = (type) => {
    if (confirmLoading) {
      if (saveTypeRef.current === type) {
        return {
          loading: confirmLoading,
        }
      } else {
        return {
          disabled: true,
        }
      }
    } else {
      return {}
    }
  }

  const footerProps = isEdit
    ? {}
    : {
        footer: (
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={onCancel}>取消</Button>
              <Button
                type="primary"
                ghost
                onClick={onSaveDraft}
                {...getButtonProps(PRODUCT_STATUS_VALS.DRAFT)}>
                保存为草稿
              </Button>
              <Button
                type="primary"
                ghost
                onClick={onCreate}
                {...getButtonProps(PRODUCT_STATUS_VALS.SALF)}>
                创建
              </Button>
            </Space>
          </div>
        ),
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
      {...footerProps}>
      <Spin spinning={dataLoading}>
        <Row>
          <Col span={24}>
            <Form.Item
              label="产品名称"
              name="name"
              rules={[
                {
                  required: true,
                  message: '请输入产品名称',
                },
              ]}>
              <Input placeholder="请输入产品名称" maxLength={20} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="分类"
              name="productTypeId"
              rules={[
                {
                  required: true,
                  message: '请选择产品分类',
                },
              ]}>
              <CategorySelect placeholder="请选择产品分类" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="产品图册"
              name="files"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                {
                  required: true,
                  type: 'array',
                  message: '请上传产品图册',
                },
              ]}
              extra={
                <div>
                  1. 仅支持上传{WX_IMG_FILE_TYPE.join('、')}类型文件
                  <br />
                  2. 文件大小不超过{WX_IMG_FILE_SIZE}M
                </div>
              }>
              <PictureUpload
                maxCount={3}
                multiple={true}
                listType="picture-card"
                validOptions={{
                  maxFileSize: WX_IMG_FILE_SIZE,
                  maxFileTotalLen: 3,
                  acceptTypeList: WX_IMG_FILE_TYPE,
                }}
                onBeforeUpload={(_, flag) => flag}>
                <UploadImgBtn title="上传产品图册" />
              </PictureUpload>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="价格"
              name="price"
              rules={[
                {
                  required: true,
                  message: '请输入价格',
                },
              ]}>
              <InputNumber
                min={0}
                step={0.01}
                placeholder="请输入价格"
                precision={2}
                style={{ width: 200 }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="产品简介"
              name="profile"
              rules={[
                {
                  required: false,
                  message: '请输入产品简介',
                },
              ]}>
              <Input.TextArea
                placeholder="请输入产品简介"
                maxLength={500}
                rows={6}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="产品描述" name="description">
              <Editor
                placeholder="请输入产品描述"
                getEditorRef={(ref) => {
                  editorRef.current = ref
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="产品属性">
              <Form.List name="attrs">
                {(fields, { add, remove }) => (
                  <div className={styles['attrs-container']}>
                    <Button
                      type="primary"
                      ghost
                      className={styles['add-attr-btn']}
                      onClick={() => {
                        add({
                          name: '',
                          value: '',
                        })
                      }}>
                      添加属性
                    </Button>
                    {fields.map((field, fieldIdx) => (
                      <div key={fieldIdx} className={styles['attrs-form-item']}>
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              name={[field.name, 'name']}
                              label="属性"
                              labelCol={{span: 4}}
                              rules={[
                                {
                                  required: true,
                                  validator: async (rule, value) => {
                                    const attrList =
                                      formRef.current.getFieldValue('attrs')
                                    if (!value) {
                                      throw new Error('请输入属性')
                                    } else {
                                      const isExist = attrList.some(
                                        (ele, eleIdx) =>
                                          ele.name === value &&
                                          eleIdx !== fieldIdx
                                      )
                                      if (isExist) {
                                        throw new Error('属性已存在')
                                      } else {
                                        Promise.resolve()
                                      }
                                    }
                                  },
                                },
                              ]}>
                              <Input placeholder="请输入不超过20个字符" maxLength={20}/>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={24}>
                            <Form.Item
                              name={[field.name, 'value']}
                              labelCol={{span: 4}}
                              label="属性值"
                              rules={[
                                {
                                  required: true,
                                  message: '请输入属性值',
                                },
                              ]}>
                              <Input placeholder="请输入不超过20个字符" maxLength={20}/>
                            </Form.Item>
                          </Col>
                        </Row>
                        <DeleteOutlined
                          className={styles['remove-action']}
                          onClick={() => {
                            remove(fieldIdx)
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Form.List>
            </Form.Item>
          </Col>
        </Row>
      </Spin>
    </DrawerForm>
  )
}
