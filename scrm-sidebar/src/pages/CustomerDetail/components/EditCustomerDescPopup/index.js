import { useEffect, useRef } from 'react'
import { TextArea, Form } from 'antd-mobile'
import MyPopup from 'components/MyPopup'
export default (props) => {
  const { onCancel, visible, onOk, data = {}, ...rest } = props
  const [form] = Form.useForm()
  const hasVisible = useRef()
  useEffect(() => {
    if (!visible && hasVisible.current) {
      form.resetFields()
    }
    if (visible && !hasVisible.current) {
      hasVisible.current = true
    }
    if (data.description && visible) {
      form.setFieldsValue({
        info: data.description,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <MyPopup title={'修改备注'} onCancel={onCancel} onOk={form.submit}
    {...rest}>
      <Form onFinish={onOk} form={form}>
        <Form.Item name="info">
          <TextArea
            showCount
            maxLength={200}
            rows={10}
            placeholder="请输入不超过200个字符..."
          />
        </Form.Item>
      </Form>
    </MyPopup>
  )
}
