import React, { useEffect, useRef, useImperativeHandle } from 'react'
import { Drawer, Button, Form } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { uniqueId } from 'lodash'
const getPreTitle = (modalType) => {
  switch (modalType) {
    case 'add':
      return '新增'
    case 'edit':
      return '编辑'
    default:
      return ''
  }
}
export default (props) => {
  const [form] = Form.useForm();
  const { modalType, getForm,  name, onCancel, onOk, children, formProps, visible, confirmLoading, ...rest } = props
  const formName = useRef(uniqueId("form"))

  useEffect(() => {
    if (typeof getForm === 'function') {
      getForm(form)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (visible) {
      form.resetFields()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel()
    }
  }

  const handleFinish = (values) => {
    if (typeof onOk === 'function') {
      onOk(values)
    }
  }

  return (
    <Drawer
      title={`${getPreTitle(modalType)}${name}`}
      placement="right"
      width={620}
      visible={visible}
      closable={false}
      maskClosable={false}
      onClose={handleCancel}
      footer={
        <Footer
          onCancel={handleCancel}
          confirmLoading={confirmLoading}
          onOk={form.submit}
        />
      }
      extra={
        <CloseOutlined onClick={handleCancel} />
      }
      {...rest}
    >
      <Form
        form={form}
        name={formName.current}
        scrollToFirstError={true}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        autoComplete="off"
        onFinish={handleFinish}
        {...formProps}
      >
        {children}
      </Form>
    </Drawer>
  )
}

const Footer = ({ onOk, onCancel, confirmLoading }) => {
  return (
    <div style={{ textAlign: "right" }}>
      <Button style={{ marginRight: 8 }}
        onClick={onCancel}>取消</Button>
      <Button
        type="primary"
        ghost
        onClick={onOk}
        loading={confirmLoading}
      >确定</Button>
    </div>
  )
}