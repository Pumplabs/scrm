import { useContext, useState, useRef } from 'react'
import { TextArea, Button, Input, Toast, Form } from 'antd-mobile'
import { UploadOutline } from 'antd-mobile-icons'
import { toJS } from 'mobx'
import { useNavigate } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { observer, MobXProviderContext } from 'mobx-react'
import PageContent from 'components/PageContent'
import UploadFile, {
  convertAttachItemToMediaParams,
} from 'components/UploadFile'
import { IMG_TYPES, VIDEO_TYPES } from 'components/UploadFile/constants'
import { TEXT_KEY_BY_VAL } from 'components/MsgSection/constants'
import { AddPersonMass } from 'src/services/modules/customerMass'
import { covertMassMsg } from 'src/utils/covertMsg'
import { encodeUrl } from 'src/utils/paths'
import { useBack } from 'src/hooks'
import { actionRequestHookOptions } from 'services/utils'
import styles from './index.module.less'

const acceptFileTypes = [...IMG_TYPES, ...VIDEO_TYPES]
export default observer(() => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [files, setFiles] = useState([])
  const toastRef = useRef()
  const { UserStore } = useContext(MobXProviderContext)
  const { run: runAddPersonMass } = useRequest(AddPersonMass, {
    manual: true,
    onBefore: () => {
      toastRef.current = Toast.show({
        icon: 'loading',
        duration: 0,
      })
    },
    ...actionRequestHookOptions({
      actionName: '操作',
      onFinally: () => {
        if (toastRef.current) {
          toastRef.current.close()
        }
      },
      successFn: (res) => {
        if (res.data) {
          const par = encodeUrl({
            massId: res.data.id,
            type: 'customer',
          })
          navigate(`/customerMassSuccess?${par}`)
        }
      },
    }),
  })
  useBack({
    backUrl: `/customerMass`
  })
  const hasUploadingFile = files.some((item) => item.status === 'uploading')

  const onFileChange = ({ files = [] }) => {
    setFiles(files)
  }

  const handleSend = (params) => {
    if (typeof window.wx.invoke === 'function') {
      const wxMsg = covertMassMsg(params.msg, toJS(UserStore.userData))
      window.wx.invoke('shareToExternalContact', wxMsg, function (res) {
        if (res.err_msg === 'shareToExternalContact:ok') {
          runAddPersonMass(params)
        }
      })
    }
  }

  const onSend = async () => {
    const vals = await form.validateFields()
    if (hasUploadingFile) {
      Toast.show({
        content: '有文件正在上传中，请稍后再试...',
        icon: <UploadOutline />,
      })
      return
    }
    const params = {
      name: vals.name,
      msg: {
        media: convertAttachItemToMediaParams(files),
        text: [
          {
            content: vals.content,
            type: TEXT_KEY_BY_VAL.TEXT,
          },
        ],
      },
    }
    handleSend(params)
  }

  return (
    <PageContent
      className={styles['page']}
      bodyClassName={styles['page-body']}
      footerClassName={styles['page-footer']}
      footer={
        <div className={styles['footer-container']}>
          <Button
            color="primary"
            fill="solid"
            className={styles['send-btn']}
            onClick={onSend}>
            前往发送
          </Button>
        </div>
      }>
      <div className={styles['add-customer-page']}>
        <Form form={form} mode="card">
          <Form.Item
            name="content"
            rules={[
              {
                required: true,
                message: '请输入群发内容',
              },
            ]}>
            <div className={styles['textarea']}>
              <TextArea
                placeholder="群发内容..."
                autoSize={true}
                rows={10}
                maxLength={600}
              />
            </div>
          </Form.Item>
          <Form.Item className={styles['file-form-item']}>
            <UploadFile
              fileList={files}
              className={styles['files-section']}
              onChange={onFileChange}
              acceptTypeList={acceptFileTypes}
            />
          </Form.Item>
          <Form.Item label="群发名称" name="name">
            <div className={styles['name-input-wrap']}>
              <Input placeholder="可选，方便搜索，16字以内" maxLength={16} />
            </div>
          </Form.Item>
        </Form>
      </div>
    </PageContent>
  )
})
