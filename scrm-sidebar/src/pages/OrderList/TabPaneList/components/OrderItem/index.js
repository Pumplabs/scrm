import { useMemo } from 'react'
import { get } from 'lodash'
import moment from 'moment'
import CustomerText from 'components/CustomerText'
import OpenEle from 'components/OpenEle'
import OrderStatus from '../../../OrderStatus'
import { formatNumber } from 'src/utils'
import { STATUS_VALS } from '../../../constants'
import styles from './index.module.less'

export default ({ data = {}, onDetail }) => {
  const handleDetail = () => {
    if (typeof onDetail === 'function') {
      onDetail(data)
    }
  }

  return (
    <div className={styles['order-item']} onClick={handleDetail}>
      <div className={styles['order-item-header']}>
        <span className={styles['customer-text']}>
          <CustomerText data={data.customer} />
        </span>
        <span className={styles['order-price']}>
          <span className={styles['money-icon']}>¥</span>
          {formatNumber(data.orderAmount)}
        </span>
      </div>
      <div className={styles['order-item-body']}>
        {/* <StatusItem className={styles['order-status']} color={statusColor}>
          {STATUS_NAMES[data.status]}
        </StatusItem> */}
        <OrderStatus status={data.status}/>
        <div className={styles['collect-box']}>
          <span className={styles['collect-label']}>已收款</span>
          <span className={styles['collect-count']}>
            <span className={styles['money-icon']}>¥</span>
            {formatNumber(data.collectionAmount || 0)}
          </span>
        </div>
      </div>
      <p className={styles['create-info']}>
        <OpenEle
          type="userName"
          openid={get(data, 'creatorStaff.name')}
          className={styles['creator']}
        />
        创建于{moment(data.createdAt).format('YYYY/MM/DD HH:mm:ss')}
      </p>
      <div className={styles['order-item-footer']}>
        <span className={styles['order-code']}>订单编号:{data.orderCode}</span>
      </div>
    </div>
  )
}
