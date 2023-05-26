import DrawerForm from 'components/DrawerForm'
export default (props) => {
  const { visible, data = {}, onCancel, ...rest } = props
  return (
    <DrawerForm footer={false} visible={visible} onCancel={onCancel} {...rest}>
      这是新增表单
    </DrawerForm>
  )
}
