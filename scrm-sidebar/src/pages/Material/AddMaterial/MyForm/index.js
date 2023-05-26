import { Form } from 'antd-mobile'
import cls from 'classnames'
import styles from './index.module.less'
const MyForm = ({ children, className, ...rest }) => {
  return (
    <Form
      className={cls({
        [styles['form']]: true,
        [className]: className,
      })}
      {...rest}>
      {children}
    </Form>
  )
}
const FormItem = ({ children, className, ...props }) => {
  return (
    <Form.Item
      className={cls({
        [styles['form-item']]: true,
        [className]: className,
      })}
      required={false}
      {...props}>
      {children}
    </Form.Item>
  )
}
MyForm.Item = FormItem
export default MyForm
