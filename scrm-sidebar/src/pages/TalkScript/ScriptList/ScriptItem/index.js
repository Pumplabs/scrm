import { useState, useEffect } from 'react'
import { Button } from 'antd-mobile'
import { isEmpty } from 'lodash'
import { SendOutlined } from '@ant-design/icons'
import { getMsgList } from 'components/MsgSection/utils'
import ExpandCell from 'components/ExpandCell'
import { useGetPlatform } from 'src/hooks/wxhook'
import MsgItem from '../MsgItems'
import styles from './index.module.less'
export default ({ data = {}, onSendAll, onSendSingle }) => {
  const [msgList, setMsgList] = useState([])
  const { platform } = useGetPlatform()
  const getMsgData = async () => {
    const msg = await getMsgList(data.msg)
    setMsgList(msg)
  }
  useEffect(() => {
    if (!isEmpty(data.msg)) {
      getMsgData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const handleSendAll = () => {
    if (typeof onSendAll === 'function') {
      onSendAll(msgList, data)
    }
  }

  const handleSingle = (msg) => {
    if (typeof onSendSingle === 'function') {
      onSendSingle(msg, data)
    }
  }

  return (
    <div className={styles['script-item']}>
      <div className={styles['script-item-header']}>
        <div>
          <p className={styles['script-name']}>{data.name}</p>
          <span className={styles['script-count']}>共{msgList.length}条</span>
        </div>
        {platform === 'pc' ? (
          <Button
            className={styles['quick-send']}
            color="primary"
            fill="solid"
            onClick={handleSendAll}>
            一键发送
          </Button>
        ) : null}
      </div>
      <div className={styles['script-item-body']}>
        <ExpandCell
          maxHeight={200}
          fieldNames={{
            expand: '展开',
          }}>
          {msgList.map((item, idx) => (
            <div key={`${item.type}_${idx}`} className={styles['msg-item']}>
              <div className={styles['msg-item-body']}>
                <MsgItem data={item} />
              </div>
              <div className={styles['msg-item-footer']}>
                <SendOutlined
                  className={styles['send-icon']}
                  onClick={() => handleSingle(item)}
                />
              </div>
            </div>
          ))}
        </ExpandCell>
      </div>
    </div>
  )
}
