import React from 'react'
import { Drawer, Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons'

export default (props) => {
  const { onCancel, onOk, children, confirmLoading, okButtonProps = {}, ...rest } = props

  return (
    <Drawer
      placement="right"
      width={620}
      closable={false}
      maskClosable={false}
      onClose={onCancel}
      footer={
        <Footer
          onCancel={onCancel}
          confirmLoading={confirmLoading}
          onOk={onOk}
          okButtonProps={okButtonProps}
        />
      }
      extra={
        <CloseOutlined onClick={onCancel} />
      }
      {...rest}
    >
      {children}
    </Drawer>
  )
}

const Footer = ({ onOk, onCancel, confirmLoading, okButtonProps }) => {
  return (
    <div style={{ textAlign: "right" }}>
      <Button style={{ marginRight: 8 }}
        onClick={onCancel}>取消</Button>
      <Button
        type="primary"
        ghost
        onClick={onOk}
        loading={confirmLoading}
        {...okButtonProps}
      >确定</Button>
    </div>
  )
}