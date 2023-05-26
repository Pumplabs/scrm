import { useEffect, useState } from 'react'
import { Radio, TextArea, Form } from 'antd-mobile'
import MyPopup from 'components/MyPopup'
import styles from './index.module.less'
export const APPROVE_VALS = {
  PASS: 1,
  REJECT: 2,
}
export default ({ onOk, ...rest }) => {
  const [form] = Form.useForm()
  const [type, setType] = useState(APPROVE_VALS.PASS)

  useEffect(() => {
    if (!rest.visible) {
      form.setFieldsValue()
      setType(APPROVE_VALS.PASS)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest.visible])

  const onTypeChange = (val) => {
    setType(val)
  }
  const handleOk = (vals) => {
    if (typeof onOk === 'function') {
      onOk({
        ...vals,
        type
      })
    }
  }
  const radioStyle = {
    '--icon-size': '22px',
    '--font-size': '16px',
    '--gap': '8px',
  }
  const requiredInfo = type === APPROVE_VALS.REJECT
  return (
    <MyPopup title="审核" onOk={form.submit} {...rest}>
      <div className={styles['popup-content']}>
        <Form form={form} onFinish={handleOk}>
          <div className={styles['radio-ul']}>
            <Radio.Group onChange={onTypeChange} value={type}>
              <div className={styles['radio-li']}>
                <Radio value={APPROVE_VALS.PASS} style={radioStyle}>
                  通过
                </Radio>
              </div>
              <div className={styles['radio-li']}>
                <Radio value={APPROVE_VALS.REJECT} style={radioStyle}>
                  不通过
                </Radio>
              </div>
            </Radio.Group>
          </div>
          {requiredInfo ? (
            <Form.Item
              name="info"
              rules={[{ required: requiredInfo, message: '原因不能为空' }]}>
              <TextArea placeholder="请填写原因，15字以内" maxLength={15} />
            </Form.Item>
          ) : null}
        </Form>
      </div>
    </MyPopup>
  )
}
