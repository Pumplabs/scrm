import cls from 'classnames'
import moment from 'moment'
import { get } from 'lodash'
import OpenEle from 'components/OpenEle'
import FieldComparsionItem from '../FieldComparsionItem'
import { MOMENT_TYPES } from '../constants'
import styles from './index.module.less'

const MOMENT_CLS = {
  FOLLOW: 'follow',
  UPDATE_OPP: 'update-opp',
  UPDATE_TASK: 'update-task',
}

export default ({ className, data = {} }) => {
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
  const { name, cls: tagCls } = getTagNameAndCls()
  return (
    <div
      className={cls({
        [styles['moment-item']]: true,
        [className]: className,
      })}>
      <div className={styles['moment-item-header']}>
        <div className={styles['monent-tag-wrap']}>
          <span
            className={cls({
              [styles['moment-tag']]: true,
              [styles[tagCls]]: tagCls,
            })}>
            {name}
          </span>
        </div>
        <span className={styles['moment-time']}>
          {data.operTime
            ? moment(data.operTime).format('YYYY/MM/DD HH:mm')
            : null}
        </span>
      </div>
      <div className={styles['moment-body']}>
        <div className={styles['moment-operate-info']}>
          <MomentAction data={data} />
        </div>
        <div className={styles['moment-content']}>
          <MomentContent data={data} />
        </div>
      </div>
    </div>
  )
}

const MomentAction = ({ data = {} }) => {
  const staff = data.operator ? (
    <span className={styles['staff-name']}>
      <OpenEle type="userName" openid={data.operator.extId} />
    </span>
  ) : null
  if (data.method === MOMENT_TYPES.ADD_FOLLOW) {
    return (
      <>
        {staff}
        <span className={styles['staff-action']}>添加了</span>
        跟进
      </>
    )
  } else if (data.method === MOMENT_TYPES.FIELD_UPDATE) {
    return (
      <>
        {staff}
        <span className={styles['staff-action']}>修改了</span>
        <span className={styles['staff-action-object']}>{data.fieldName}</span>
      </>
    )
  } else if (data.method === MOMENT_TYPES.DONE_TASK) {
    return (
      <>
        {staff}
        <span className={styles['staff-action']}>完成了</span>
        任务
      </>
    )
  } else if (data.method === MOMENT_TYPES.OVERDUE_TASK) {
    return <>{staff}任务逾期了</>
  } else {
    return null
  }
}

const MomentContent = ({ data = {} }) => {
  if (data.method === MOMENT_TYPES.ADD_FOLLOW) {
    return <>{get(data, 'info.content')}</>
  } else if (data.method === MOMENT_TYPES.FIELD_UPDATE) {
    return (
      <FieldComparsionItem
        beforeValue={data.oldValue}
        afterValue={data.newValue}
      />
    )
  } else if (data.method === MOMENT_TYPES.DONE_TASK) {
    return <>{get(data, 'info.content')}</>
  } else if (data.method === MOMENT_TYPES.OVERDUE_TASK) {
    return <>{get(data, 'info.content')}</>
  } else {
    return null
  }
}
