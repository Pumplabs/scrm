import { useEffect, useRef, useState } from 'react'
import { Form, Radio, Input, Row } from 'antd'
import CommonModal from 'components/CommonModal'
import { ORDER_STATUS_VALS } from '../../../constants'

export default (props) => {
  const { visible, onOk, ...rest } = props
  const hasVisibleRef = useRef()
  const [approveForm] = Form.useForm()
  const [approveType, setApproveType] = useState(ORDER_STATUS_VALS.CONFIRM)
  const initVals = {
    remark: '',
  }

  useEffect(() => {
    if (visible && !hasVisibleRef.current) {
      hasVisibleRef.current = true
    }
    if (!visible && hasVisibleRef.current) {
      setApproveType(ORDER_STATUS_VALS.CONFIRM)
      approveForm.resetFields()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onRadioChange = (e) => {
    setApproveType(e.target.value)
  }

  const handleOk = (vals) => {
    if (typeof onOk === 'function') {
      onOk({
        ...vals,
        type: approveType,
      })
    }
  }

  return (
    <CommonModal visible={visible} onOk={approveForm.submit} {...rest}>
      <Form initialValues={initVals} form={approveForm} onFinish={handleOk}>
        <Form.Item>
          <Radio.Group value={approveType} onChange={onRadioChange}>
            <Radio value={ORDER_STATUS_VALS.CONFIRM}>通过</Radio>
            <Radio value={ORDER_STATUS_VALS.REJECT}>不通过</Radio>
          </Radio.Group>
        </Form.Item>
        {ORDER_STATUS_VALS.REJECT === approveType ? (
          <Form.Item
            name="remark"
            rules={[
              {
                required: true,
                message: '请输入原因',
              },
            ]}>
            <Input.TextArea placeholder="请输入原因" maxLength={15} />
          </Form.Item>
        ) : null}
      </Form>
    </CommonModal>
  )
}
