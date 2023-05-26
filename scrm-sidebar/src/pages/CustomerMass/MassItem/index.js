import { useMemo } from 'react'
import cls from 'classnames'
import { get } from 'lodash'
import OpenEle from 'components/OpenEle'
import { ExclamationCircleFill, CheckCircleFill } from 'antd-mobile-icons'
import todoIconUrl from 'src/assets/images/icon/todo.svg'
import { StatusItem, getRecordStatus, STATUS_EN_TYPES } from '../StatusItem'
import { getMassName } from '../utils'
import { SEND_STATUS_VAL } from '../constants'
import styles from './index.module.less'

export default ({ data = {}, onDetail }) => {
  const { noSendStaffCount = 0, sendStaffCount = 0 } = data
  const total = noSendStaffCount + sendStaffCount

  return (
    <MassItem
      data={data}
      onDetail={onDetail}
      createName={get(data, 'staff.name')}
      statusVals={SEND_STATUS_VAL}
      statCounts={{
        done: sendStaffCount,
        notDone: noSendStaffCount,
        total: total,
      }}
    />
  )
}

const MassItem = ({ data = {}, onDetail, statusVals, statCounts = {}, createName }) => {
  const { total = 0, done = 0, notDone = 0 } = statCounts
  const percent = total > 0 ? Math.floor((done * 100) / total) : 0
  const { type, name } = useMemo(() => {
    return getRecordStatus(data, statusVals)
  }, [data, statusVals])

  const handleDetail = () => {
    if (typeof onDetail === 'function') {
      onDetail(data)
    }
  }
  return (
    <MassItemLayout
      onClick={type === STATUS_EN_TYPES.FAIL ? null : handleDetail}
      className={styles['mass-item']}
      bodyClassName={styles['mass-body-item']}
      title={getMassName(data)}
      subTitle={
        STATUS_EN_TYPES.FAIL === type && data.failMsg ? (
          <p className={styles['fail-tip-text']}>
            <ExclamationCircleFill className={styles['fail-icon']} />
            {data.failMsg}
          </p>
        ) : null
      }
      extra={<StatusItem type={type} name={name} />}
      footer={
        <p className={styles['create-info']}>
          <CreateInfoItem label="创建人" className={styles['creator-item']}>
            <OpenEle type="userName" openid={createName} />
          </CreateInfoItem>
          <CreateInfoItem label="创建时间">{data.createdAt}</CreateInfoItem>
        </p>
      }>
      <div className={styles['mass-stat-content']}>
        <ResultItem
          className={styles['mass-execute-result']}
          data={{
            total,
            done,
            notDone,
          }}
        />
        {type === STATUS_EN_TYPES.DONE ? (
          <div className={styles['percent-num']}>{percent}%</div>
        ) : null}
      </div>
    </MassItemLayout>
  )
}
// 统计结果
const ResultItem = ({ className, data = {} }) => {
  return (
    <ul
      className={cls({
        [styles['mass-execute-result']]: true,
        [className]: className,
      })}>
      <li
        className={cls({
          [styles['result-item']]: true,
          [styles['total']]: true,
        })}>
        <img src={todoIconUrl} alt="" className={styles['result-item-icon']} />
        <span className={styles['result-item-count']}>{data.total}</span>
      </li>
      <li
        className={cls({
          [styles['result-item']]: true,
          [styles['done']]: true,
        })}>
        <CheckCircleFill className={styles['result-item-icon']} />
        <span className={styles['result-item-count']}>{data.done}</span>
      </li>
      <li
        className={cls({
          [styles['result-item']]: true,
          [styles['not-done']]: true,
        })}>
        <ExclamationCircleFill className={styles['result-item-icon']} />
        <span className={styles['result-item-count']}>{data.notDone}</span>
      </li>
    </ul>
  )
}
// 创建项
const CreateInfoItem = ({ className, label, children }) => {
  return (
    <span
      className={cls({
        [styles['create-item']]: true,
        [className]: className,
      })}>
      <span className={styles['create-item-label']}>{label}</span>
      {children}
    </span>
  )
}
const MassItemLayout = ({
  className,
  bodyClassName,
  title,
  extra,
  children,
  footer,
  subTitle,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cls({
        [styles['layout-mass-item']]: true,
        [styles['cursor']]: typeof onClick === 'function',
        [className]: className,
      })}>
      <div className={styles['mass-header']}>
        <p className={styles['mass-name']}>{title}</p>
        {extra ? (
          <div className={styles['mass-header-extra']}>{extra}</div>
        ) : null}
      </div>
      {subTitle ? subTitle : null}
      <div
        className={cls({
          [styles['mass-body']]: true,
          [bodyClassName]: bodyClassName,
        })}>
        {children}
      </div>
      <div className={styles['mass-footer']}>{footer}</div>
    </div>
  )
}

export { MassItem }