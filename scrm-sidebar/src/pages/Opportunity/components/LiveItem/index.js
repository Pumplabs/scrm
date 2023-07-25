import cls from 'classnames'
import moment from 'moment'
import { get } from 'lodash'

import OpenEle from 'components/OpenEle'
import FieldComparsionItem from './FieldComparsionItem'
import { MOMENT_TYPES, TABLE_NAME } from './constants'
import styles from './index.module.less'

const MOMENT_CLS = {
  YELLOW: 'yellow',
  GREEN: 'green',
  BLUE: 'blue',
}
const TABLE_NAME_CN = {
  [TABLE_NAME.OPP]: '商机',
}
const actionConfig = {
  [MOMENT_TYPES.ALLOW_CLUE]: {
    actionName: '分配',
    cls: MOMENT_CLS.BLUE,
  },
  [MOMENT_TYPES.RECYCLE_CLUE]: {
    actionName: '回收',
    showInfo: true,
    // 展示原因提示
    showReasonTip: true,
    cls: MOMENT_CLS.BLUE,
  },
  [MOMENT_TYPES.CLOSE_CLUE]: {
    actionName: '关闭',
    showInfo: true,
    showReasonTip: true,
    cls: MOMENT_CLS.BLUE,
  },
  [MOMENT_TYPES.ACTIVE_CLUE]: {
    actionName: '激活',
    cls: MOMENT_CLS.GREEN,
  },
  [MOMENT_TYPES.BACK_CLUE]: {
    actionName: '退回',
    showReasonTip: true,
    showInfo: true,
    cls: MOMENT_CLS.BLUE,
  },
  [MOMENT_TYPES.CREATE_CLUE]: {
    actionName: '创建',
    cls: MOMENT_CLS.BLUE,
  },
}
const getTagNameAndCls = (data) => {
  const tableName = TABLE_NAME_CN[data.tableName]
  const configItem = actionConfig[data.method]
  if (configItem) {
    return {
      name: `${configItem.actionName}${tableName}`,
      cls: configItem.cls
    }
  }
  switch (data.method) {
    case MOMENT_TYPES.ADD_FOLLOW:
      return {
        name: `${tableName}跟进`,
        cls: MOMENT_CLS.YELLOW,
      }
    case MOMENT_TYPES.DONE_TASK:
    case MOMENT_TYPES.OVERDUE_TASK:
      return {
        name: '任务更新',
        cls: MOMENT_CLS.BLUE,
      }
    case MOMENT_TYPES.FIELD_UPDATE:
      return {
        name: `${tableName}更新`,
        cls: MOMENT_CLS.GREEN,
      }
    default:
      return {}
  }
}
export default ({ className, data = {} }) => {
  const { name, cls: tagCls } = getTagNameAndCls(data)
  const momentContent = getMomentContent(data)
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
        {momentContent ? (
          <div className={styles['moment-content']}>{momentContent}</div>
        ) : null}
      </div>
    </div>
  )
}

const MomentAction = ({ data = {} }) => {
  const tableName = TABLE_NAME_CN[data.tableName]
  const staff = data.operator ? (
    <span className={styles['staff-name']}>
      <OpenEle type="userName" openid={data.operator.extId} />
    </span>
  ) : null
  const configItem = actionConfig[data.method]
  if (configItem) {
    return (
      <>
        {staff}
        <span className={styles['staff-action']}>
          {configItem.actionName}了
        </span>
        {tableName}
        {configItem.showReasonTip ? (
          <p className={styles['reason-tip']}>
            <span className={styles['staff-action-object']}>
              {configItem.actionName}原因：
            </span>
          </p>
        ) : null}
      </>
    )
  }
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

const getMomentContent = (data) => {
  const { method } = data
  const configItem = actionConfig[method]
  if (configItem) {
    return configItem.showInfo ? get(data, 'info.content') : null
  }
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
