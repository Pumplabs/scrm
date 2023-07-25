import React, { useEffect } from 'react'
import { Form, Input } from 'antd'
import CommonModal from 'components/CommonModal'

export default (props) => {
  const { data = {}, visible, onOk, ...rest } = props
  const [form] = Form.useForm()
  useEffect(() => {
    form.setFieldsValue({
      remark: data.remark,
      description: data.description,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <CommonModal
      title="编辑资料"
      visible={visible}
      {...rest}
      onOk={form.submit}
      onClose={form.resetFields}
    >
      <Form
        form={form}
        onFinish={onOk}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}>
        <Form.Item label="备注" name="remark">
          <Input placeholder="请输入不超过20个字符" />
        </Form.Item>
        <Form.Item label="备注" name="description">
          <Input.TextArea placeholder="请输入不超过150个字符" maxLength={150} rows={6}/>
        </Form.Item>
      </Form>
    </CommonModal>
  )
}
