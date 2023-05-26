import { useState, useEffect, useRef } from 'react'
import { Form, Row, Col, Select, Input } from 'antd'
import DrawerForm from 'components/DrawerForm'
import TagSelect from 'components/TagSelect'
import { MsgEditor, MsgPreview } from 'components/WeChatMsgEditor'
import {
  getMsgRules,
  getFillEditorForm,
} from 'components/WeChatMsgEditor/utils'
import styles from './modal.module.less'

const msgRules = getMsgRules({
  rules: [
    {
      type: 'noEmpty',
      message: '请输入话术内容',
    },
    { type: 'maxText', message: '话术内容字数已超过限制' },
  ],
})
export default (props) => {
  const {
    visible,
    data = {},
    modalType,
    groupList,
    defaultGroupId,
    ...rest
  } = props
  const [msgList, setMsgList] = useState([])
  const form = useRef(null)

  const refillForm = async () => {
    const msgContent = await getFillEditorForm({ msg: data.msg })
    onMsgChange(msgContent)
    if (form.current) {
      form.current.setFieldsValue({
        name: data.name,
        msg: msgContent,
        groupId: data.groupId,
        tags: Array.isArray(data.tagList) ? data.tagList : [],
      })
    }
  }

  const onMsgChange = (val) => {
    const { text, media: mediaList = [] } = val
    setMsgList([
      {
        type: 'text',
        text,
      },
      ...mediaList,
    ])
  }

  useEffect(() => {
    if (data.id && modalType === 'editScript') {
      refillForm()
    } else {
      setMsgList([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id])

  useEffect(() => {
    if (!visible) {
      setMsgList([])
    }
  }, [visible])

  const getForm = (ref) => {
    form.current = ref
  }

  return (
    <DrawerForm
      visible={visible}
      width={840}
      {...rest}
      getForm={getForm}
      formProps={{
        initialValues: {
          groupId: defaultGroupId,
          msg: {
            text: '',
          },
        },
      }}>
      <div className={styles['modalContent']}>
        <div className={styles['preview-section']}>
          <MsgPreview mediaList={msgList} />
        </div>
        <Row>
          <Col span={24}>
            <Form.Item
              name="name"
              label="话术名称"
              rules={[
                {
                  required: true,
                  message: '请输入话术名称',
                },
              ]}>
              <Input placeholder="请输入话术名称" maxLength={30}/>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="msg" label="内容" rules={msgRules}>
              <MsgEditor
                onChange={onMsgChange}
                editorType="text"
                editorProps={{
                  maxLength: 600,
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              name="groupId"
              label="分组"
              rules={[
                {
                  required: true,
                  message: '请选择分组',
                },
              ]}>
              <Select placeholder="请选择分组">
                {groupList.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name="tags" label="话术标签">
              <TagSelect
                placeholder="请选择话术标签"
                style={{ width: '100%' }}
                tagType="material"
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </DrawerForm>
  )
}
