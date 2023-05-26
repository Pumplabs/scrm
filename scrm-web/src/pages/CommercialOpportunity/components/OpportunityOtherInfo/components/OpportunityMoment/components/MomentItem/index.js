import cls from 'classnames'
import moment from 'moment'
import { get } from 'lodash'
import { CheckCircleTwoTone } from '@ant-design/icons'
import OpenEle from 'components/OpenEle'
import MomentItemWrap from '../MomentItemWrap'
import MomentContent from '../MomentContent'
import FieldUpdateItem from './FieldUpdateItem'
import { MOMENT_TYPES } from '../../constants'
import styles from './index.module.less'

const MOMENT_CLS = {
  FOLLOW: 'follow',
  UPDATE_OPP: 'update-opp',
  UPDATE_TASK: 'update-task',
}
export default ({ data = {}, className }) => {
  const getTagNameAndCls = () => {
    switch (data.method) {
      case MOMENT_TYPES.ADD_FOLLOW:
        return {
          name: '商机跟进',
          cls: MOMENT_CLS.FOLLOW,
        }
      case MOMENT_TYPES.DONE_TASK:
      case MOMENT_TYPES.OVERDUE_TASK:
        return {
          name: '任务更新',
          cls: MOMENT_CLS.UPDATE_TASK,
        }
      case MOMENT_TYPES.FIELD_UPDATE:
        return {
          name: '商机更新',
          cls: MOMENT_CLS.UPDATE_OPP,
        }
      default:
        return {}
    }
  }

  const getOperatorInfo = () => {
    const staffEle = data.operator ? (
      <span className={styles['staff-name']}>
        <OpenEle type="userName" openid={data.operator.extId} />
      </span>
    ) : null
    switch (data.method) {
      case MOMENT_TYPES.ADD_FOLLOW:
        return (
          <>
            {staffEle}
            <span className={styles['action-name']}>添加了</span>
            <span className={styles['target-name']}>跟进</span>
          </>
        )
      case MOMENT_TYPES.FIELD_UPDATE:
        return (
          <>
            {staffEle}
            <span className={styles['action-name']}>修改了</span>
            <span className={styles['target-name']}>{data.fieldName}</span>
          </>
        )
      case MOMENT_TYPES.DONE_TASK:
        return (
          <>
            {staffEle}
            <span className={styles['action-name']}>完成了</span>
            <span className={styles['target-name']}>任务</span>
          </>
        )
      case MOMENT_TYPES.OVERDUE_TASK:
        return (
          <>
            {staffEle}的任务
            <span style={{marginLeft: 4}}>逾期了</span>
          </>
        )
      default:
        return null
    }
  }
  const getHeader = () => {
    return (
      <div className={styles['operation-section']}>
        {getOperatorInfo()}
        <span className={styles['follow-time']}>
          {data.operTime
            ? moment(data.operTime).format('YYYY-MM-DD HH:mm')
            : ''}
        </span>
      </div>
    )
  }

  const { name, cls: tagCls } = getTagNameAndCls()
  return (
    <MomentItemWrap
      className={className}
      tagName={name}
      tagClassName={cls({
        [styles['tag-item']]: true,
        [styles[`${tagCls}-tag`]]: true,
      })}>
      <MomentContent header={getHeader()}>
        <div className={styles['content-main']}>
          {data.method === MOMENT_TYPES.ADD_FOLLOW ? (
            <div>{get(data, 'info.content') || ''}</div>
          ) : null}
          {data.method === MOMENT_TYPES.FIELD_UPDATE ? (
            <FieldUpdateItem
              beforeValue={data.oldValue}
              afterValue={data.newValue}
              fieldName={data.fieldName}
            />
          ) : null}
          {data.method === MOMENT_TYPES.DONE_TASK ? (
            <>
              <CheckCircleTwoTone className={styles['done-task-icon']} />
              {get(data, 'info.content') || ''}
            </>
          ) : null}
          {data.method === MOMENT_TYPES.OVERDUE_TASK ? (
            <>{get(data, 'info.content') || ''}</>
          ) : null}
        </div>
      </MomentContent>
    </MomentItemWrap>
  )
}
