import InviteDetail from 'src/components/InviteDetail'
import styles from './index.module.less'

export default ({ powerUsers, stageList, timeData }) => {
  return (
    <div className={styles['activity-info']}>
      <div className={styles['activity-time']}>
        本次活动将在
        <DateItem>{timeData.days}</DateItem>天
        <DateItem>{timeData.hour}</DateItem>:
        <DateItem>{timeData.min}</DateItem>:
        <DateItem>{timeData.second}</DateItem>后结束
      </div>
      <div className={styles['invite-doc']}>
        <p className={styles['invite-tip']}>仅需两步完成助力</p>
        <ul>
          <li className={styles['tip-item']}>1.长按海报转发好友、朋友圈</li>
          <li className={styles['tip-item']}>2.好友扫描添加完成助力</li>
        </ul>
      </div>
      <InviteDetail stageList={stageList} powerUsers={powerUsers} />
    </div>
  )
}

const DateItem = ({ children }) => {
  return <span className={styles['date-item']}>{children}</span>
}
