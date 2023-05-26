import CustomerDrawer from 'components/CommonDrawer'
import { MsgPreview } from 'components/WeChatMsgEditor'

export default ({ visible, onCancel, data = {}, ...rest }) => {
  return (
    <CustomerDrawer
      footer={false}
      visible={visible}
      onCancel={onCancel}
      bodyStyle={{
        paddingRight: 0
      }}
      width={420}
      {...rest}
    >
      <MsgPreview
        mediaList={data.mediaArr}
        style={{margin: "0 auto"}}
      />
    </CustomerDrawer>
  )
}