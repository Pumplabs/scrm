import { useEffect, useRef } from 'react'
import { Form, Input, Row, Col } from 'antd'
import DrawerForm from 'components/DrawerForm'

export default (props) => {
  const { data = {}, visible, ...rest } = props
  const formRef = useRef()

  useEffect(() => {
    if (visible && data.name) {
      if (formRef.current) {
        formRef.current.setFieldsValue({
          name: data.name,
          description: data.description,
        })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <DrawerForm
      {...rest}
      visible={visible}
      getForm={(r) => (formRef.current = r)}>
      <Row>
        <Col span={24}>
          <Form.Item
            label="分类名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入分类名称',
              },
            ]}>
            <Input placeholder="请输入分类名称" maxLength={20} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="分类描述" name="description">
            <Input.TextArea
              placeholder="请输入分类描述"
              maxLength={150}
              rows={4}
            />
          </Form.Item>
        </Col>
      </Row>
    </DrawerForm>
  )
}
