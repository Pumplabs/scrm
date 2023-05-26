import cls from 'classnames'
import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash'
import MsgItem from './MsgItem'
import { getMsgList } from './utils'
import styles from './index.module.less'

/**
 * @param {Object} data
 */
export default ({ data, className }) => {
  const [msgList, setMsgList] = useState([])
  const getMsgData = async () => {
    const msg = await getMsgList(data)
    setMsgList(msg)
  }
  useEffect(() => {
    if (!isEmpty(data)) {
      getMsgData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
  return (
    <div
      className={cls({
        [styles['msg-section']]: true,
        [className]: className,
      })}>
      {msgList.map((ele, idx) => (
        <div className={styles['msg-item']} key={idx}>
          <MsgItem data={ele} />
        </div>
      ))}
    </div>
  )
}
