import { useState } from 'react'
import cls from 'classnames'
import { Button, Empty, Spin } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import ExpandCell from 'components/ExpandCell'
import MsgSection from 'components/MsgSection'
import styles from './index.module.less'

/**
 * @param {String} title 标题
 * @param {String} receiveTitle 接收标题
 * @param {ReactNode} receiveContent 接收展示的内容
 * @param {Array} msg 消息内容
 * @param {String} status 状态 done unDone
 * @param {ReactNode} footer 底部
 * @param {Boolean} isEmpty 是否为空内容
 * @param {Boolean} loading
 * @param {String} footerBtnText 底部按钮文本
 */
export default (props) => {
  const { loading, ...rest } = props

  return (
    <div className={styles['remind-card']}>
      <Spin spinning={loading}>
        <div className={styles['remind-body-wrap']}>
          {loading ? (
            <div style={{ height: '100vh' }}></div>
          ) : (
            <Content {...rest} />
          )}
        </div>
      </Spin>
    </div>
  )
}
const Content = (props) => {
  const {
    title,
    receiveTitle,
    receiveContent,
    status,
    msg,
    footer,
    footerBtnText,
    isEmpty,
    onClick,
  } = props
  return (
    <>
      {isEmpty ? (
        <EmptyContent />
      ) : (
        <>
          <Header title={title} status={status} />
          <div className={styles['remind-card-body']}>
            <div className={styles['remind-msg']}>
              <ExpandCell
                maxHeight={200}
                fieldNames={{
                  expand: '查看全文',
                }}>
                <MsgSection data={msg} />
              </ExpandCell>
            </div>
            <ReceiveObj title={receiveTitle}>{receiveContent}</ReceiveObj>
          </div>
          {footer === undefined ? (
            <Footer text={footerBtnText} onClick={onClick} />
          ) : (
            footer
          )}
        </>
      )}
    </>
  )
}
const STATUS_NAMES = {
  done: '已发送',
  unDone: '待发送',
  overdue: '已逾期'
}
const Header = ({ title, status }) => {
  return (
    <div className={styles['card-header']}>
      <span className={styles['card-title']}>{title}</span>
      {status ? (
        <div className={styles['card-header-extra']}>
          <span
            className={cls({
              [styles['status-item']]: true,
              [styles['wait-send']]: status === 'unDone',
              [styles['done']]: status === 'done',
              [styles['overdue']]: status === 'overdue'
            })}>
            {STATUS_NAMES[status]}
          </span>
        </div>
      ) : null}
    </div>
  )
}

// 接收对象
const ReceiveObj = ({ title, allowExpand = true, children }) => {
  const [expand, setExpand] = useState(true)

  const onExpand = () => {
    if (allowExpand) {
      setExpand(!expand)
    }
  }
  return (
    <div
      className={cls({
        [styles['recevie-object']]: true,
        [styles['recevie-object-hide']]: !expand,
      })}>
      <div className={styles['recevie-object-header']}>
        <span className={styles['recevie-object-title']}>
          <label onClick={onExpand}>发送给</label>
          <span className={styles['recevie-title-text']} onClick={onExpand}>
            {title}
          </span>
          {allowExpand ? (
            <DownOutlined
              className={styles['expand-icon']}
              onClick={onExpand}></DownOutlined>
          ) : null}
        </span>
      </div>
      <div className={styles['recevie-object-body']}>{children}</div>
    </div>
  )
}

export const Footer = ({ text = '前往发送', onClick, children }) => {
  return (
    <div className={styles['remind-footer']}>
      {children ? children: (
        <Button type="primary" style={{ width: '100%' }} onClick={onClick}>
          {text}
        </Button>
      )}
    </div>
  )
}

const EmptyContent = () => {
  const onRefresh = () => {
    window.location.reload()
  }

  return (
    <div style={{ paddingTop: 40 }}>
      <Empty
        description={
          <>
            <p style={{ marginBottom: 14 }}>没有发送消息数据哦</p>
            <Button onClick={onRefresh}>刷新试试</Button>
          </>
        }
      />
    </div>
  )
}
