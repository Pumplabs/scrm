import { useEffect, useRef } from 'react'
import { Form, Row, Col, InputNumber } from 'antd'
import CommonModal from 'components/CommonModal'
import { calcPrice, calcDiscount } from '../../utils'

export default ({ visible, data = {}, onOk, ...rest }) => {
  const [form] = Form.useForm()
  const hasVisible = useRef(false)
  useEffect(() => {
    if (!visible && hasVisible.current) {
      form.resetFields()
    }
    if (visible && !hasVisible.current) {
      hasVisible.current = false
    }
    if (visible) {
      form.setFieldsValue({
        newPrice: data.newPrice,
        discount: data.discount,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])
  const onValuesChange = (vals)=> {
    const [key] = Object.keys(vals)
    switch(key) {
      case 'newPrice':
        form.setFieldsValue({
          discount: calcDiscount(vals[key], data.price)
        })
        break;
      case 'discount':
        form.setFieldsValue({
          newPrice: calcPrice(data.price, vals[key])
        })
        break;
      default:
        break;
    }
  }
  return (
    <CommonModal visible={visible} {...rest} onOk={form.submit}>
      <Form
        form={form}
        onFinish={onOk}
        initialValues={{
          discount: 100,
        }}
        onValuesChange={onValuesChange}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}>
        <Row>
          <Col span={24}>
            <Form.Item
              label="产品名称"
            >
              {data.name}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="产品价格">
              {data.price}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="优惠价格" name="newPrice">
              <InputNumber
                min={0}
                max={data.price}
                precision={2}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="折扣" name="discount">
              <InputNumber min={1} max={100} precision={0} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="描述" >
              {data.profile}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CommonModal>
  )
}
