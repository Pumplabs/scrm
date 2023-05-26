import { useEffect, useState, useRef } from 'react'
import { Input, message } from 'antd'
import {
  FormOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import CommonModal from 'components/CommonModal'
import defaultAvatorUrl from 'assets/images/defaultAvator.jpg'
import styles from './index.module.less'

const defaultMsg = `您好，您的服务已升级，后续将由我的同事接替我的工作，继续为您服务。`
const TipModal = ({ visible, data = {}, onOk, ...rest }) => {
  const [isEditMsg, setIsEditMsg] = useState(false)
  const [msg, setMsg] = useState('')
  const msgRef = useRef()

  useEffect(() => {
    if (visible) {
      setMsg(defaultMsg)
    }
  }, [visible])

  const onMsgChange = (e) => {
    setMsg(e.target.value)
  }

  const onEditMsg = () => {
    setIsEditMsg(true)
    msgRef.current = msg
  }

  const onSaveMsg = () => {
    if (msg.trim().length === 0) {
      message.warning('提示语不能为空')
    } else {
      msgRef.current = msg
      setIsEditMsg(false)
    }
  }

  const onCancelMsg = () => {
    setMsg(msgRef.current)
    setIsEditMsg(false)
  }

  const handleOk = () => {
    if (typeof onOk === 'function') {
      onOk(msg)
    }
  }

  return (
    <CommonModal title="提示" visible={visible} onOk={handleOk} {...rest}>
      <div>
        <p style={{ marginBottom: 10, position: 'relative' }}>
          客户将收到以下提示
          <span className={styles['msg-actions']}>
            {isEditMsg ? (
              <>
                <CheckCircleOutlined
                  className={styles['msg-action']}
                  onClick={msg.length ? onSaveMsg : undefined}
                  disabled={!msg.length}
                />
                <CloseCircleOutlined
                  className={styles['msg-action']}
                  onClick={onCancelMsg}
                />
              </>
            ) : (
              <FormOutlined
                onClick={onEditMsg}
                className={styles['msg-action']}
              />
            )}
          </span>
        </p>
        <div>
          <MsgContent
            text={msg}
            onChange={onMsgChange}
            inputVisible={isEditMsg}
          />
        </div>
      </div>
    </CommonModal>
  )
}
export default TipModal

const MsgContent = ({ text, onChange, inputVisible }) => {
  return (
    <div className={styles['msg-selection']}>
      <div className={styles['msg-content']}>
        <img src={defaultAvatorUrl} alt="" className={styles['user-avatar']} />
        <div className={styles['msg-text']}>
          {inputVisible ? (
            <Input.TextArea
              placeholder="请输入不超过200个字符"
              maxLength={200}
              onChange={onChange}
              value={text}
              allowClear
              rows={6}
            />
          ) : (
            text
          )}
        </div>
      </div>
    </div>
  )
}
