import { useEffect, useRef } from 'react'
import { Form, Input, TextArea, Stepper } from 'antd-mobile'
import MyPopup from 'components/MyPopup'
import ChooseProductPopup from '../ChooseProductPopup'
import { useModalHook } from 'src/hooks'
import styles from './index.module.less'

export default (props) => {
  const { onOk, visible, data = {}, ...rest } = props
  const hasVisible = useRef(false)
  const [form] = Form.useForm()
  const { openModal, closeModal, visibleMap } = useModalHook(['chooseProduct'])
  useEffect(() => {
    if (visible && !hasVisible.current) {
      hasVisible.current = true
    }
    if (!visible && hasVisible.current) {
      form.resetFields()
    }
    if (visible && data.id) {
      form.setFieldsValue({
        name: data.name,
        price: data.price,
        discount: data.discount,
        count: data.count,
        info: data.info,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onSelectProduct = () => {
    openModal('chooseProduct')
  }

  const onChooseProductOk = (arr) => {
    const [item] = arr
    // 回填
    form.setFieldsValue({
      name: item.name,
      price: item.price * 1,
    })
    closeModal()
  }

  const formInitialValues = {
    name: '',
    price: 0,
    discount: 100,
    count: 1,
    info: '',
  }
  return (
    <>
      <MyPopup {...rest} onOk={form.submit} visible={visible}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onOk}
          initialValues={formInitialValues}>
          <Form.Item
            label={
              <p className={styles['product-name-label']}>
                产品名称
                <span
                  className={styles['select-lib-text']}
                  onClick={onSelectProduct}>
                  从产品库选择
                </span>
              </p>
            }
            name="name"
            required={false}
            rules={[
              {
                required: true,
                message: '产品名称不能为空',
              },
            ]}>
            <Input placeholder="产品名称不超过15个字符" maxLength={15} />
          </Form.Item>
          <Form.Item
            label="单价"
            name="price"
            normalize={(val) => {
              const [prefix = '', suffix = ''] = `${val}`.split('.')
              if (prefix.length && suffix.length > 2) {
                return `${prefix}.${suffix.substr(0, 2)}` * 1
              } else {
                return val
              }
            }}>
            <Input
              type="number"
              precision={2}
              min={0}
              max={Number.MAX_SAFE_INTEGER}
            />
          </Form.Item>
          <Form.Item label="折扣(%)" name="discount">
            <Stepper digits={0} min={0} max={100} />
          </Form.Item>
          <Form.Item label="数量" name="count">
            <Stepper digits={0} min={1} />
          </Form.Item>
          <Form.Item label="备注" name="info">
            <TextArea placeholder="产品备注，不超过30个字" />
          </Form.Item>
        </Form>
      </MyPopup>
      <ChooseProductPopup
        visible={visibleMap.chooseProductVisible}
        onOk={onChooseProductOk}
        onCancel={closeModal}
      />
    </>
  )
}
