import { useEffect, useRef } from 'react'
import moment from 'moment'
import { Form, Row, Col, DatePicker, InputNumber } from 'antd'
import GroupOwnerSelect from 'components/GroupOwnerSelect'
import DrawerForm from 'components/DrawerForm'

export default (props) => {
  const { visible,data = {}, ...rest } = props
  const formRef = useRef(null)
  useEffect(() => {
    if (visible && data.id) {
      formRef.current.setFieldsValue({
        month: moment(data.month, 'YYYY-MM'),
        target: data.target,
        staffExtId: data.staffExtId,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])
  const initialValues = {
    month: moment(),
    target: 1,
  }
  const disabledTime = (date) => {
    return moment().isAfter(date, 'months')
  }
  return (
    <DrawerForm
      visible={visible}
      {...rest}
      width={640}
      getForm={(r) => (formRef.current = r)}
      formProps={{
        initialValues,
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 18,
        },
      }}>
      <Row>
        <Col span={18}>
          <Form.Item
            label="月份"
            name="month"
            rules={[
              {
                required: true,
                message: '请选择月份',
              },
            ]}>
            <DatePicker
              picker="month"
              disabledDate={disabledTime}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={18}>
          <Form.Item
            label="员工"
            name="staffExtId"
            rules={[
              {
                required: true,
                message: '请选择员工',
              },
            ]}>
            <GroupOwnerSelect maxLength={1} placeholder={`请选择`} mode="" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={18}>
          <Form.Item
            label="本月销售目标"
            name="target"
            rules={[
              {
                required: true,
                message: '请输入销售目标',
              }
            ]}>
            <InputNumber min={0} precision={2} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </DrawerForm>
  )
}
