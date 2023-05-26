import cls from 'classnames'
import moment from 'moment'
import { get } from 'lodash'
import StageItem from '../StageItem'
import OpenEle from 'components/OpenEle'
import { formatNumber } from 'src/utils'
import { PRIORITY_VALS } from '../../../constants'
import styles from './index.module.less'

export default ({ data = {}, onDetail }) => {
  const handleDetail = () => {
    if (typeof onDetail === 'function') {
      onDetail(data)
    }
  }
  return (
    <div className={styles['opp-item']} onClick={handleDetail}>
      <div className={styles['opp-item-header']}>
        <span className={styles['opp-name']}>
          {data.name}
        </span>
        <span className={styles['opp-price']}>
        ￥
          {formatNumber(data.expectMoney || 0)}
        </span>
      </div>
      <div className={styles['opp-item-body']}>
        <div className={styles['status-row']}>
          <StageItem name={get(data, 'stage.name')} color={get(data, 'stage.color')}/>
          <PriorityItem level={data.priority} />
        </div>
        <p className={styles['create-info']}>
          <span className={styles['staff-name']}>
          <OpenEle type="userName" openid={data.creatorCN} />
          </span>
          <span className={styles['create-time']}>创建于
          {data.createdAt ? moment(data.createdAt).format('YYYY/MM/DD HH:mm'): ''}</span>
        </p>
      </div>
      <div className={styles['opp-item-footer']}>
        最新跟进时间:{data.lastFollowAt ? moment(data.lastFollowAt).format('YYYY/MM/DD HH:mm'): ''}
      </div>
    </div>
  )
}
// 等级
const PriorityItem = ({ level = 3 }) => {
  const str = '!'
  const getPriorityLabel = () => {
    switch (level) {
      case PRIORITY_VALS.HIGH:
        return str.repeat(3)
      case PRIORITY_VALS.MIDDLE:
        return str.repeat(2)
      case PRIORITY_VALS.LOW:
        return str.repeat(1)
      default:
        return ''
    }
  }
  if (!level) {
    return null
  }
  return (
    <span
      className={cls({
        [styles['priority-item']]: true,
        [styles['priority-h']]: PRIORITY_VALS.HIGH === level,
        [styles['priority-m']]: PRIORITY_VALS.MIDDLE === level,
        [styles['priority-l']]: PRIORITY_VALS.LOW === level,
      })}>
      {getPriorityLabel(level)}
    </span>
  )
}

const StatusItem = ({ className, name, color }) => {
  return (
    <span
      className={cls({
        [className]: className,
        [styles['status-item']]: true,
      })}>
      {name}
    </span>
  )
}
