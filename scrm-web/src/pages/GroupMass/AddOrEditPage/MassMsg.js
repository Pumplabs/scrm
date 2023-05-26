import TextAreaWithCount from 'components/TextAreaWithCount'
import { MsgEditor, MsgPreview } from 'components/WeChatMsgEditor'
export default (props) => {
  const { text, media: mediaList = [] } = props.value || {}
  const textArr = text
    ? [
        {
          type: 'text',
          text,
        },
      ]
    : []
  return (
    <div style={{ position: 'relative' }}>
      <MsgEditor
        editorType="text"
        editorProps={{
          maxLength: 600,
        }}
        {...props}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          transform: 'translate(300px, -140px)',
        }}>
        <p style={{ textAlign: 'center', marginBottom: 4 }}>客户收到的消息</p>
        <MsgPreview mediaList={[...textArr, ...mediaList]} />
      </div>
    </div>
  )
}
