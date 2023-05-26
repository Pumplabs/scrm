import CustomerDrawer from 'components/CommonDrawer'
import BaseInfo from './BaseInfo'

export default (props) => {
  const { visible, data = {}, onCancel, ...rest } = props
  return (
    <CustomerDrawer
      footer={false}
      visible={visible}
      onCancel={onCancel}
      title={data.name}
      width={1100}
      {...rest}>
       <BaseInfo data={data} visible={visible} />
    </CustomerDrawer>
  )
}
