import { useMemo } from 'react'
import cls from 'classnames'
import { get } from 'lodash'
import OpenEle from 'components/OpenEle'
import { TODO_TYPE, TODO_STAUTS } from '../../constants'
import styles from './index.module.less'
export default ({ data = {}, onDetail, status }) => {
  const handleDetail = () => {
    if (typeof onDetail === 'function') {
      onDetail(data)
    }
  }
  const todoTypeName = useMemo(() => {
    if (TODO_TYPE.GROUP_SOP === data.type) {
      return '群SOP'
    }  else if (TODO_TYPE.OPP_FOLLOW === data.type) {
      return '商机任务'
    }else {
      return '客户SOP'
    }
  }, [data.type])
  return (
    <div className={styles['todo-item']} onClick={handleDetail}>
      <div className={styles['todo-item-header']}>
        <span className={styles['task-name']}>{data.name}</span>
        <span
          className={cls({
            [styles['todo-type']]: true,
            [styles['todo-customer-type']]:
              TODO_TYPE.CUSTOMER_SOP === data.type,
            [styles['todo-group-type']]: TODO_TYPE.GROUP_SOP === data.type,
            [styles['todo-opp-type']]: TODO_TYPE.OPP_FOLLOW === data.type
          })}>
          {todoTypeName}
        </span>
      </div>
      <div className={styles['todo-item-footer']}>
        <InfoItem label="创建人">
          <OpenEle type="userName" openid={get(data, 'creatorStaff.name')} />
        </InfoItem>
        {TODO_STAUTS.UN_DONE === status ? (
          <InfoItem label="截止时间">
            {data.deadlineTime ? data.deadlineTime : ''}
          </InfoItem>
        ) : null}
      </div>
    </div>
  )
}

const InfoItem = ({ label, children }) => {
  return (
    <div className={styles['info-item']}>
      <span className={styles['info-label']}>{label}</span>
      <div className={styles['info-content']}>{children}</div>
    </div>
  )
}
