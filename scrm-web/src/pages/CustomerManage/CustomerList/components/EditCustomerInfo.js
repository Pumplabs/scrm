import { useEffect, useRef } from 'react'
import { Form, Input, Row, Col, Card, DatePicker } from 'antd'
import moment from 'moment'

import DrawerForm from 'components/DrawerForm'
import { PHONE_REG, EMAIL_REG } from 'src/utils/reg'

export default (props) => {
  const formRef = useRef()
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
  useEffect(() => {
    if (visible) {
      refillForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const refillForm = () => {
    let formVals = {
      phoneNumber: data.phoneNumber,
      email: data.email,
      corpName: data.corpName,
      birthday: data.birthday ? moment(data.birthday, 'YYYY-MM-DD') : null,
      address: data.address,
    }
    formRef.current.setFieldsValue(formVals)
  }
  const handleOk = (values) => {
    if (typeof onOk === 'function') {
      onOk({
        ...values,
      })
    }
  }

  return (
    <DrawerForm
      {...rest}
      visible={visible}
      getForm={(r) => (formRef.current = r)}
      width={780}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}>
      <Card title="基本信息" style={{ marginBottom: 32 }} bordered={false}>
        <Row>
          <Col span={24}>
            <Form.Item
              label="电话"
              name="phoneNumber"
              rules={[
                {
                  pattern: PHONE_REG,
                  required: false,
                  message: '电话格式不正确',
                },
              ]}>
              <Input allowClear={true} placeholder="请输入电话" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="生日" name="birthday">
              <DatePicker placeholder="请选择生日" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                {
                  required: false,
                  pattern: EMAIL_REG,
                  message: '请输入邮箱',
                },
              ]}>
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="地址" name="address">
              <Input placeholder="请输入地址" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="企业" name="corpName">
              <Input placeholder="请输入企业" />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    </DrawerForm>
  )
}
