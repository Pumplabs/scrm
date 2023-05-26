import { Input, Form, Row, Col, Switch } from 'antd'
import { isEmpty } from 'lodash'
import MySelect from 'components/MySelect'
import { PictureUpload, UploadImgBtn } from 'components/CommonUpload'
import { MsgEditor } from 'components/WeChatMsgEditor'
import MsgPreview from 'components/WeChatMsgEditor/components/MsgPreview'
import { COVER_IMG_TYPES } from 'src/utils/constants'

export default ({
  mediaList = [],
  isEdit,
  immediatelyInvited,
  onImmediatelyInvitedChange,
}) => {
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }
  return (
    <div style={{ paddingRight: 400, minHeight: 600, position: 'relative' }}>
      <div style={{ position: 'absolute', right: 20, top: 0 }}>
        <MsgPreview mediaList={mediaList} />
      </div>
      <Row>
        <Col span={24}>
          <Form.Item
            label="邀请文案"
            name="official"
            rules={[
              {
                required: true,
                message: '请输入邀请文案',
                validator: async (rule, value = {}) => {
                  const { text } = value
                  const isEmptyValue = isEmpty(value) || !text
                  if (rule.required && isEmptyValue) {
                    throw new Error('请输入邀请文案')
                  } else {
                    Promise.resolve()
                  }
                },
              },
            ]}>
            <MsgEditor
              editorType="text"
              footer={null}
              editorProps={{
                maxLength: 600,
                placeholder: '请输入邀请文案',
              }}
              // wrapStyle={{
              //   background: '#f4f4f4',
              // }}
              // style={{ resize: 'none', height: 300 }}
              // maxLength={600}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="链接标题"
            name="title"
            rules={[
              {
                required: true,
                message: '请输入链接标题',
              },
            ]}>
            <Input maxLength={100} placeholder="请输入链接标题" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="链接摘要"
            name="summary"
            rules={[
              {
                required: true,
                message: '请输入链接摘要',
              },
            ]}>
            <Input.TextArea
              maxLength={150}
              rows={4}
              placeholder="请输入链接摘要"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="链接封面"
            name="files"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: true,
                type: 'array',
                message: '请上传链接封面',
              },
            ]}
            extra={
              <div>
                1. 仅支持上传{COVER_IMG_TYPES.join('、')}类型文件
                <br />
                2. 文件大小不超过2M
              </div>
            }>
            <PictureUpload
              listType="picture-inline"
              maxCount={1}
              validOptions={{
                maxFileSize: 2,
                maxFileTotalLen: 2,
                acceptTypeList: COVER_IMG_TYPES,
              }}
              onBeforeUpload={(_, flag) => flag}>
              <UploadImgBtn title="上传封面" />
            </PictureUpload>
          </Form.Item>
        </Col>
      </Row>
      {!isEdit ? (
        <>
          <Row>
            <Col span={24}>
              <Form.Item label="邀请客户" required={true}>
                <Switch
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                  checked={immediatelyInvited}
                  onChange={onImmediatelyInvitedChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={!immediatelyInvited ? 0 : 24}>
              <Form.Item
                label=" "
                name="inviteUsers"
                colon={false}
                required={false}
                rules={[
                  {
                    required: immediatelyInvited,
                    message: '请选择被邀请客户',
                  },
                ]}
            >
                <MySelect
                  type="customer"
                  title="选择客户"
                  placeholder="选择客户"
                />
              </Form.Item>
            </Col>
          </Row>
        </>
      ) : null}

    </div>
  )
}
