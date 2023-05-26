import { useRef, useState, useEffect } from 'react'
import { Form, Input, Switch, Row, Col, Select, InputNumber } from 'antd'
import BraftEditor from 'braft-editor'
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
import MySelect from 'components/MySelect'
import { refillUsers } from 'components/MySelect/utils'
import TagSelect from 'components/TagSelect'
import DrawerForm from 'components/DrawerForm'
import { CHANNEL_CODE_NAME } from 'utils/fields'
import RemarkItem from '../RemarkItem'
import styles from './index.module.less'

const { Option } = Select
const editorId = 'channelCode'
const ReadNode = ({ value }) => <span>{value}</span>
registerNickNameExension(editorId)

const msgRule = getMsgRules({
  rules: [
    {
      type: 'noEmpty',
      message: '请输入发送内容',
    },
    { type: 'maxText', message: '发送内容字数已超过限制' },
  ],
  isRichText: true,
})

export default (props) => {
  const {
    visible,
    defaultGroupId,
    groupList = [],
    data = {},
    onOk,
    isEdit,
    ...rest
  } = props
  const formRef = useRef(null)
  const [msgList, setMsgList] = useState([])
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [backUserIds, setBackUserIds] = useState([])
  const [openLimit, setOpenLimit] = useState(false)

  useEffect(() => {
    if (!visible) {
      setMsgList([])
      setSelectedUserIds([])
      setBackUserIds([])
      setOpenLimit(false)
    } else if (isEdit) {
      refillForm(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, isEdit])

  const refillForm = async (detailData = {}) => {
    const msgData = detailData.replyInfo ? detailData.replyInfo : {}
    const fileUrls = await getMediaFileUrls(msgData.media)
    const msgContent = {
      text: getFillRichText(msgData.text, editorId),
      media: getFillMedia(msgData.media, fileUrls),
    }
    const userArr = refillUsers({
      userArr: detailData.staffs,
      key: 'id',
    })
    const backUserArr = refillUsers({
      userArr: detailData.backOutStaffs,
      key: 'id',
    })
    setSelectedUserIds(userArr.map((ele) => ele.key))
    setBackUserIds(backUserArr.map((ele) => ele.key))
    const initialValues = {
      name: detailData.name,
      groupId: detailData.groupId,
      staffArr: userArr,
      backUsers: backUserArr,
      dailyAddCustomerLimit: detailData.dailyAddCustomerLimit,
      customerTags: Array.isArray(detailData.customerTags)
        ? detailData.customerTags
        : [],
      skipVerify: detailData.skipVerify,
      msg: msgContent,
      customerRemark: detailData.customerRemark
    }
    onMsgChange(msgContent)
    if (formRef.current) {
      formRef.current.setFieldsValue(initialValues)
    }
    setOpenLimit(detailData.dailyAddCustomerLimitEnable)
  }

  const onMsgChange = (value) => {
    const { text, media: mediaList = [] } = value
    setMsgList([
      {
        type: 'text',
        text: text ? text.toText() : [],
      },
      ...mediaList,
    ])
  }

  const onBackUserChange = (arr) => {
    setBackUserIds(arr.map((item) => `user_${item.id}`))
  }

  const onUserChange = (arr) => {
    setSelectedUserIds(arr.map((item) => `user_${item.id}`))
  }

  const onOpenLimitChange = (checked) => {
    setOpenLimit(checked)
  }

  const handleOk = (vals) => {
    if (typeof onOk === 'function') {
      onOk({
        ...vals,
        dailyAddCustomerLimitEnable: openLimit,
        customerRemarkEnable: true,
      })
    }
  }
  const initialValues = {
    skipVerify: true,
    groupId: defaultGroupId,
    msg: {
      text: BraftEditor.createEditorState('', {
        editorId,
      }),
    },
  }

  return (
    <DrawerForm
      visible={visible}
      onOk={handleOk}
      {...rest}
      width={1000}
      getForm={(r) => (formRef.current = r)}
      formProps={{
        initialValues,
        wrapperCol: {
          span: 12
        }
      }}>
      <Row>
        <Col span={24}>
          <Form.Item
            label="渠道码名称"
            name="name"
            rules={[
              {
                required: true,
                message: '请输入渠道码名称',
              },
            ]}>
            {isEdit ? (
              <ReadNode />
            ) : (
              <Input
                maxLength={CHANNEL_CODE_NAME}
                placeholder={`请输入不超过${CHANNEL_CODE_NAME}个字符`}
              />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="所属分组"
            name="groupId"
            rules={[
              {
                required: true,
                message: '请选择所属分组',
              },
            ]}>
            <Select
              allowClear={true}
              optionFilterProp="label"
              placeholder="请选择">
              {groupList.map((ele) => (
                <Option key={ele.id} value={ele.id}>
                  {ele.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="使用员工"
            name="staffArr"
            rules={[
              {
                required: true,
                type: 'array',
                message: '请选择使用员工',
              },
            ]}>
            <MySelect
              type="user"
              title="选择员工"
              placeholder="请选择使用员工"
              onlyChooseUser={true}
              disabledValues={backUserIds}
              onChange={onUserChange}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="备选员工" name="backUsers">
            <MySelect
              type="user"
              title="选择员工"
              placeholder="请选择备选员工"
              onlyChooseUser={true}
              onChange={onBackUserChange}
              disabledValues={selectedUserIds}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="自动通过好友"
            name="skipVerify"
            valuePropName="checked"
            labelCol={{
              span: 4,
            }}>
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Form.Item label="开启添加好友上限" labelCol={{ span: 8 }}>
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
              checked={openLimit}
              onChange={onOpenLimitChange}
            />
          </Form.Item>
          <Form.Item
            label="每天最多添加好友数"
            name="dailyAddCustomerLimit"
            labelCol={{ span: 8 }}
            style={openLimit ? {} : { display: 'none' }}
            rules={[
              {
                required: openLimit,
                message: '请输入上限数',
              },
            ]}>
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入上限数"
              min={1}
              precision={0}
              max={Number.MAX_SAFE_INTEGER}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="客户标签" name="customerTags">
            <TagSelect style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="客户备注" name="customerRemark">
            <RemarkItem />
          </Form.Item>
        </Col>
      </Row>
      <div className={styles['welcome-setting']}>
        <p className={styles['welcome-setting-title']}>设置欢迎语</p>
        <div className={styles['preview-section']}>
          <MsgPreview mediaList={msgList} />
        </div>
        <div className={styles['welcome-setting-body']}>
          <Form.Item
            label="发送内容"
            name="msg"
            labelCol={{
              span: 4
            }}
            wrapperCol={{
              span: 20
            }}
            rules={msgRule}>
            <MsgEditor
              editorProps={{
                editorId,
                ninameLabel: '客户昵称',
              }}
              onChange={onMsgChange}
            />
          </Form.Item>
        </div>
      </div>
    </DrawerForm>
  )
}
