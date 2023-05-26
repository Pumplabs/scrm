import { RightOutline } from 'antd-mobile-icons'
import cls from 'classnames'
import { get } from 'lodash'
import UserIcon from 'components/UserIcon'
import OpenEle from 'components/OpenEle'
import addCustomerUrl from 'assets/images/icon/daily/add-customer.svg'
import connectIconUrl from 'assets/images/icon/daily/connect-icon.svg'
import customerFollowUrl from 'assets/images/icon/daily/customer-follow.svg'
import massCountUrl from 'assets/images/icon/daily/mass-count.svg'
import orderAccountUrl from 'assets/images/icon/daily/order-account.svg'
import orderCountUrl from 'assets/images/icon/daily/order-count.svg'
import styles from './index.module.less'
export default ({ data = {}, className }) => {
  return (
    <div
      className={cls({
        [styles['index-pane']]: true,
        [className]: className,
      })}>
      <ul className={styles['pane-content']}>
        <li className={styles['index-li-item']}>
          <IndexItem
            name="新增客户"
            iconUrl={addCustomerUrl}
            num={data.addCustomer}
          />
        </li>
        <li className={styles['index-li-item']}>
          <IndexItem
            name="客户跟进"
            iconUrl={customerFollowUrl}
            num={Array.isArray(data.followList) ? data.followList.length : 0}
          />
        </li>
        <li className={styles['index-li-item']}>
          <IndexItem
            name="订单数量"
            iconUrl={orderCountUrl}
            num={data.orderNum}
          />
        </li>
        <li className={styles['index-li-item']}>
          <IndexItem
            name="订单金额"
            iconUrl={orderAccountUrl}
            num={data.orderAmountStr}
          />
        </li>
        <li className={styles['index-li-item']}>
          <IndexItem
            name="群发次数"
            iconUrl={massCountUrl}
            num={data.sendNum}
          />
        </li>
        <li className={styles['index-li-item']}>
          <IndexItem
            name="触达客户"
            iconUrl={connectIconUrl}
            num={data.sendCustomer}
          />
        </li>
      </ul>
      <div className={styles['pane-footer']}>
        <div className={styles['user-info']}>
          <UserIcon className={styles['user-avatar']} />
          <span className={styles['user-name']}>
            <OpenEle type="userName" openid={get(data, 'staff.extId')} />
          </span>
        </div>
      </div>
    </div>
  )
}

const IndexItem = ({ iconUrl, icon, name, num = 0, onClick }) => {
  return (
    <div className={styles['index-item']} onClick={onClick}>
      <div className={styles['index-item-content']}>
        <p className={styles['index-icon']}>
          {iconUrl ? <img src={iconUrl} alt="" /> : icon}
        </p>
        <p className={styles['index-name']}>{name}</p>
      </div>
      <div className={styles['index-item-extra']}>
        <span className={styles['index-num']}>{num}</span>
        {typeof onClick === 'function' ? (
          <RightOutline className={styles['more-icon']} />
        ) : null}
      </div>
    </div>
  )
}
