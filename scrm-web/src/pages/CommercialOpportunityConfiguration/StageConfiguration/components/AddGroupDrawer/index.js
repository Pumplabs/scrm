import { useEffect, useRef } from 'react'
import { Form, Input, Row, Col } from 'antd'
import CommonModal from 'components/CommonModal'

export default (props) => {
  const { visible, data = {}, onOk, ...rest } = props
  const [form] = Form.useForm()
  const preVisible = useRef(visible)
  useEffect(() => {
    if (visible && data.name) {
      form.setFieldsValue({
        name: data.name,
      })
    }
    if (!visible && preVisible.current !== visible) {
      form.resetFields()
    }
    preVisible.current = visible
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])
  return (
    <CommonModal visible={visible} {...rest} width={540} onOk={form.submit}>
      <Form
        form={form}
        labelCol={{
          span: 4
        }}
        onFinish={onOk}>
        <Row>
          <Col span={24}>
            <Form.Item
              label="分组名称"
              name="name"
              rules={[
                {
                  required: true,
                  message: '请输入分组名称',
                },
              ]}>
              <Input placeholder="请输入分组名称" maxLength={20} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CommonModal>
  )
}
