import cls from 'classnames'
import { Checkbox, Tag } from 'antd-mobile'
import { CheckCircleOutline } from 'antd-mobile-icons'
import { useRequest } from 'ahooks'
import OpenEle from 'components/OpenEle'
import { DoneTask } from 'services/modules/follow'
import { actionRequestHookOptions } from 'services/utils'
import { TASK_STATUS } from '../../constants'
import styles from './index.module.less'

export default ({ dataSource = [], refresh, className}) => {
  const { run: runDoneTask } = useRequest(DoneTask, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: refresh,
    }),
  })
  const onDoneTask = (item) => {
    runDoneTask({
      taskId: item.id,
    })
  }
  return (
    <div
      className={cls({
        [styles['follow-task']]: true,
        [styles['empty-follow-task']]: dataSource.length === 0,
        [className]: className
      })}>
      <div className={styles['follow-task-header']}>
        <CheckCircleOutline className={styles['follow-check-icon']} /> 任务
        <span className={styles['divide-code']}>·</span>
        {dataSource.length}
      </div>
      {dataSource.length ? (
        <ul
          className={cls({
            [styles['follow-task-ul']]: true,
          })}>
          {dataSource.map((ele) => (
            <TaskItem key={ele.id} data={ele} onDone={onDoneTask} />
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export const TaskItem = ({ data = {}, onDone }) => {
  const isDone = data.status === TASK_STATUS.DONE
  const handleDone = () => {
    if (typeof onDone === 'function') {
      onDone(data)
    }
  }
  const handleClick = (e) => {
    e.stopPropagation()
  }
  const checkProps = isDone ? {} : { onChange: handleDone }
  const checkEvents = isDone ? {} : { onClick: handleClick }
  return (
    <li className={styles['follow-task-li']}>
      <span className={styles['check-box']} {...checkEvents}>
        <Checkbox checked={isDone} {...checkProps} />
      </span>
      <div className={styles['task-content']}>
        <p className={styles['task-name']}>{data.name}</p>
        <div className={styles['task-content-footer']}>
          <Tag fill="outline" className={styles['user-tag']}>
            <OpenEle type="userName" openid={data.owner} />
          </Tag>
          <Tag
            fill="outline"
            className={cls({
              [styles['time-tag']]: true,
              [styles['done-time-tag']]:
                `${data.status}` === `${TASK_STATUS.DONE}`,
              [styles['overdue-time-tag']]:
                `${data.status}` === `${TASK_STATUS.OVER_DUE}`,
            })}>
            {data.finishAt ? data.finishAt.slice(0, -3) : ''}
          </Tag>
        </div>
      </div>
    </li>
  )
}
