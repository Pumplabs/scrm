import { useEffect, useRef } from 'react'
import { Form, Input } from 'antd'
import CommonModal from 'components/CommonModal'

export default (props) => {
  const { visible, onOk, ...rest } = props
  const [replyForm] = Form.useForm()
  const hasVisible = useRef(null)

  useEffect(() => {
    if (visible && hasVisible.current) {
      replyForm.resetFields()
    }
    if (!hasVisible.current && visible) {
      hasVisible.current = visible
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <CommonModal {...rest} onOk={replyForm.submit} visible={visible}>
      <Form
        form={replyForm}
        onFinish={onOk}
        initialValues={{
          text: '',
        }}>
        <Form.Item
          name="text"
          required={[
            {
              required: true,
              messsage: '请输入回复内容',
            },
          ]}>
          <Input.TextArea placeholder="请输入回复内容" maxLength={200} />
        </Form.Item>
      </Form>
    </CommonModal>
  )
}
