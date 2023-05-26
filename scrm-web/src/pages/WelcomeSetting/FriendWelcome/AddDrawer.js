import { useState, useRef, useEffect } from 'react'
import { Form, Col, Row } from 'antd'
import DrawerForm from 'components/DrawerForm'
import MySelect from 'components/MySelect'
import BraftEditor from 'braft-editor'
import { MsgEditor, MsgPreview, registerNickNameExension, getFillRichText,} from 'components/WeChatMsgEditor'
import {
  getFillMedia,
  getMediaFileUrls,
  getMsgRules
} from 'components/WeChatMsgEditor/utils'
import { refillUsers } from 'components/MySelect/utils'

const msgRules = getMsgRules({
  rules: [
    {
      type: 'noEmpty',
      message: '请输入内容',
    },
    { type: 'maxText', message: '内容字数已超过限制' },
  ],
  isRichText: true,
})
const editorId = 'friend-editor'
registerNickNameExension(editorId)
export default (props) => {
  const form = useRef(null)
  const { visible, data = {}, ...rest } = props
  const [msgList, setMsgList] = useState([])
  const refillForm = async () => {
    if (data.msg) {
      const { text, media } = data.msg
      const fileUrls = await getMediaFileUrls(media)
      const users = refillUsers({
        userArr: data.staffList,
        depArr: data.departmentList,
      })
      if (form.current) {
        form.current.setFieldsValue({
          msg: {
            text: getFillRichText(text, editorId),
            media: getFillMedia(media, fileUrls),
          },
          users,
        })
      }
    }
  }

  useEffect(() => {
    if (visible && rest.modalType === 'edit') {
      refillForm()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const getForm = (ref) => {
    form.current = ref
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

  return (
    <DrawerForm
      visible={visible}
      {...rest}
      width={1000}
      getForm={getForm}
      formProps={{
        initialValues: {
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
              rules={msgRules}>
              <MsgEditor
                onChange={onMsgChange}
                editorProps={{
                  editorId,
                  ninameLabel: '客户昵称'
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="使用员工"
              name="users"
              rules={[
                {
                  required: true,
                  message: '请选择使用员工',
                },
              ]}>
              <MySelect title="选择员工" placeholder="请选择" type="user" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </DrawerForm>
  )
}
