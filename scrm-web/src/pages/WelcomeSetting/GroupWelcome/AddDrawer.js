import { useRef, useState, useEffect } from 'react'
import { Form, Col, Row, Switch } from 'antd'
import BraftEditor from 'braft-editor'
import DrawerForm from 'components/DrawerForm'
import MySelect from 'components/MySelect'
import {
  MsgEditor,
  MsgPreview,
  registerNickNameExension,
  getFillRichText,
} from 'components/WeChatMsgEditor'
import {
  getFillMedia,
  getMediaFileUrls,
  getMsgRules,
} from 'components/WeChatMsgEditor/utils'
const editorId = 'group-editor'
registerNickNameExension(editorId)

const msgRules = getMsgRules({
  isRichText: true,
  rules: [
    {
      type: 'noEmpty',
      message: '请输入内容',
    },
    { type: 'maxText', message: '内容字数已超过限制' },
  ],
})
export default (props) => {
  const { visible, data = {}, ...rest } = props
  const [msgList, setMsgList] = useState([])
  const form = useRef(null)

  const refillForm = async () => {
    if (data.msg) {
      const { text, media } = data.msg
      const fileUrls = await getMediaFileUrls(media)
      const msgContent = {
        text: getFillRichText(text, editorId),
        media: getFillMedia(media, fileUrls),
      }
      onMsgChange(msgContent)
      if (form.current) {
        form.current.setFieldsValue({
          msg: msgContent,
          noticeOwner: data.isNoticeOwner,
          groups: Array.isArray(data.groupChatList) ? data.groupChatList : [],
        })
      }
    }
  }

  const onMsgChange = (val) => {
    const { text, media: mediaList = [] } = val
    setMsgList([
      {
        type: 'text',
        text: text ? text.toText() : [],
      },
      ...mediaList,
    ])
  }

  useEffect(() => {
    if (visible && rest.modalType === 'edit') {
      refillForm()
    } else {
      setMsgList([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const getForm = (ref) => {
    form.current = ref
  }

  return (
    <DrawerForm
      visible={visible}
      {...rest}
      width={1000}
      getForm={getForm}
      formProps={{
        labelCol: {
          span: 5,
        },
        wrapperCol: {
          span: 19,
        },
        initialValues: {
          noticeOwner: true,
          msg: {
            text: BraftEditor.createEditorState('', {
              editorId,
            }),
          },
        },
      }}>
      <div style={{ paddingRight: 400, position: 'relative' }}>
        <div style={{ position: 'absolute', right: 0, top: 0 }}>
          <MsgPreview mediaList={msgList} />
        </div>
        <Row>
          <Col span={24}>
            <Form.Item
              label="内容"
              name="msg"
              rules={msgRules}
              extra="附件只支持1张图片或1个视频或1个链接">
              <MsgEditor
                onChange={onMsgChange}
                editorProps={{
                  editorId,
                  ninameLabel: '客户昵称',
                }}
                attachmentRules={{
                  max: 1,
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="使用群聊"
              name="groups"
              rules={[
                {
                  required: true,
                  type: 'array',
                  message: '请选择使用群聊',
                },
              ]}>
              <MySelect
                title="选择群聊"
                placeholder="请选择"
                type="group"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="是否通知群主"
              name="noticeOwner"
              rules={[
                {
                  required: true,
                  message: '请选择使用群聊',
                },
              ]}
              valuePropName="checked">
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </DrawerForm>
  )
}
