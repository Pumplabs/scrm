import cls from 'classnames'
import { useRequest } from 'ahooks'
import { GetCustomerStatics } from 'src/services/modules/customer'
import { GetGroupStatics } from 'src/services/modules/group'
import userIconUrl from 'assets/images/icon/user-icon.svg'
import groupIconUrl from 'assets/images/icon/group1-icon.svg'
import styles from './index.module.less'
export default () => {
  const { data: customerStatics = {}} = useRequest(GetCustomerStatics, {
    defaultParams: [{
      isPermission: true
    }]
  })
  const { data: groupStatics = { } } = useRequest(GetGroupStatics, {
    defaultParams: [{
      isPermission: true
    }]
  })

  return (
    <div className={styles['stat-section']}>
      <StatBox
        className={styles['customer-stat']}
        iconUrl={userIconUrl}
        total={customerStatics.total || 0}
        totalLabel={<span>客户总数<span style={{marginLeft: 2}}>(去重)</span></span>}
        addLabel="今日新增"
        loseLabel="今日流失"
        addCount={customerStatics.todaySaveTotal || 0}
        loseCount={customerStatics.todayLossTotal || 0}
      />
      <StatBox
        className={styles['group-stat']}
        iconUrl={groupIconUrl}
        totalLabel="客户群总数"
        total={groupStatics.totalMember || 0}
        addCount={groupStatics.joinMemberNum || 0}
        addLabel="今日入群"
        loseLabel="今日退群"
        loseCount={groupStatics.quitMemberNum || 0}
      />
    </div>
  )
}

const StatBox = ({
  className,
  iconUrl,
  total,
  totalLabel,
  addCount,
  loseCount,
  addLabel,
  loseLabel,
}) => {
  return (
    <div
      className={cls({
        [styles['stat-box']]: true,
        [className]: className,
      })}>
      <div className={styles['stat-box-top']}>
        <div className={styles['total-icon']}>
          <img src={iconUrl} alt="" className={styles['icon-ele']} />
          <p className={styles['total-label']}>{totalLabel}</p>
        </div>
        <div className={styles['total-count']}>{total}</div>
      </div>
      <ul className={styles['stat-box-bottom']}>
        <li className={styles['stat-item']}>
          <p
            className={cls({
              [styles['stat-item-count']]: true,
              [styles['stat-add-count']]: true,
            })}>
            {addCount}
          </p>
          <span className={styles['stat-item-label']}>{addLabel}</span>
        </li>
        <li className={styles['stat-item']}>
          <p
            className={cls({
              [styles['stat-item-count']]: true,
              [styles['stat-lose-count']]: true,
            })}>
            {loseCount}
          </p>
          <span className={styles['stat-item-label']}>{loseLabel}</span>
        </li>
      </ul>
    </div>
  )
}
