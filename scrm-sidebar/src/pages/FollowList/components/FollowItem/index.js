import { Tag } from 'antd-mobile'
import { useMemo } from 'react'
import cls from 'classnames'
import OpenEle from 'components/OpenEle'
import FollowTaskList from '../FollowTaskList'
import styles from './index.module.less'
export default ({ data = {}, refresh }) => {
  const { content, shareExtStaffIds, taskList } = data
  const shareStaffs = useMemo(() => {
    return Array.isArray(shareExtStaffIds) ? shareExtStaffIds : []
  }, [shareExtStaffIds])
  const taskArr = useMemo(() => {
    return Array.isArray(taskList) ? taskList : []
  }, [taskList])
  return (
    <div className={styles['follow-item']}>
      <div className={styles['follow-text']}>{content.text[0].content}</div>
      {shareStaffs.length ? <MentionUser dataSource={shareStaffs} className={styles['follow-users']} /> : null}
      {taskArr.length ? (
        <FollowTaskList dataSource={taskArr} refresh={refresh} className={styles['follow-task']} />
      ) : null}
    </div>
  )
}

export const MentionUser = ({ dataSource = [], className }) => {
  return (
    <div className={cls({
      [styles['mention-user']]: true,
      [className]: className
    })}>
      <p className={styles['mention-user-header']}>
        <span className={styles['mention-code']}>@</span>
        同事
        <span className={styles['divide-code']}>·</span>
        {dataSource.length}
      </p>
      <div className={styles['mention-user-body']}>
        {dataSource.map((ele) => (
          <Tag
            color="primary"
            fill="outline"
            className={styles['user-item']}
            key={ele}>
            <OpenEle type="userName" openid={ele} />
          </Tag>
        ))}
      </div>
    </div>
  )
}
