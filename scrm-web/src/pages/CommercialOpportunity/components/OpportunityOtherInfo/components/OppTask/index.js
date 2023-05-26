import { useMemo } from 'react'
import { Modal } from 'antd'
import cls from 'classnames'
import { useRequest } from 'ahooks'
import { CheckCircleOutlined } from '@ant-design/icons'
import OpenEle from 'components/OpenEle'
import { DateCard } from '../OpportunityMoment'
import { covertListByDate } from 'src/utils'
import { actionRequestHookOptions } from 'services/utils'
import { TASK_STATUS } from './constants'
import styles from './index.module.less'

/**
 * @param {Array} dataSource 源数据
 * @param {Function} 点击完成
 */
export default ({ dataSource = [], onDoneTask }) => {
  const taskList = useMemo(() => covertListByDate(dataSource), [dataSource])
  return (
    <>
      {taskList.map((dateItem) => (
        <DateCard date={dateItem.fullDate} key={dateItem.fullDate}>
          <TaskList list={dateItem.list} onDone={onDoneTask} />
        </DateCard>
      ))}
    </>
  )
}

const TaskList = ({ list = [], onDone }) => {
  return (
    <ul className={styles['task-list']}>
      {list.map((ele) => (
        <TaskListItem data={ele} key={ele.id} onDone={onDone} />
      ))}
    </ul>
  )
}

const TaskListItem = ({ data = {}, onDone }) => {
  const handleDone = () => {
    if (typeof onDone === 'function') {
      onDone(data)
    }
  }
  return (
    <li className={styles['task-list-item']}>
      <div className={styles['task-icon-wrap']}>
        {TASK_STATUS.DONE === data.status ? (
          <CheckCircleOutlined className={styles['task-done-icon']}/>
        ) : (
          <span
            className={styles['task-item-icon']}
            onClick={handleDone}></span>
        )}
      </div>
      <div className={styles['task-item-content']}>
        <p className={styles['task-item-name']}>{data.name}</p>
        <p className={styles['task-item-info']}>
          <InfoItem label="负责人">
            <OpenEle type="userName" openid={data.owner} />
          </InfoItem>
          <InfoItem label="截止时间" className={styles['deadline']}>
            <span
              className={cls({
                [styles['done-time']]: TASK_STATUS.DONE === data.status,
                [styles['undone-time']]: TASK_STATUS.UN_DONE === data.status,
                [styles['overdue-time']]: TASK_STATUS.OVERDUE === data.status,
              })}>
              {data.finishAt}
            </span>
          </InfoItem>
        </p>
        <p className={styles['task-item-creator']}>
          <InfoItem label="创建人">
            <OpenEle type="userName" openid={data.creatorCN} />
          </InfoItem>
        </p>
      </div>
    </li>
  )
}

const InfoItem = ({ label, children, className }) => {
  return (
    <span
      className={cls({
        [styles['info-item']]: true,
        [className]: className,
      })}>
      <span className={styles['info-item-label']}>{label}</span>
      <span className={styles['info-item-content']}>{children}</span>
    </span>
  )
}
