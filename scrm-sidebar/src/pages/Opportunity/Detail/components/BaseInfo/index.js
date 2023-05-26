import { useMemo } from 'react'
import { get } from 'lodash'
import moment from 'moment'
import cls from 'classnames'
import List from 'components/List'
import OpenEle from 'components/OpenEle'
import OverText from '../OverText'
import { PRIORITY_OPTIONS, PRIORITY_VALS } from '../../../constants'
import { formatNumber } from 'utils'
import styles from './index.module.less'

export default ({ data = {}, onChangeStage }) => {
  const cooperatorList = Array.isArray(data.cooperatorList)
    ? data.cooperatorList
    : []
  const priorityName = useMemo(() => {
    const item = PRIORITY_OPTIONS.find((item) => item.value === data.priority)
    return item ? item.label : ''
  }, [data.priority])

  return (
    <div>
      <div className={styles['desc-info']}>
        <List>
          <List.Item description={data.desp || '-'}>商机描述</List.Item>
        </List>
      </div>
      <List>
        <List.Item
          extra={
            <OverText
              list={cooperatorList}
              renderItem={(ele) => (
                <OpenEle type="userName" openid={ele.cooperatorStaff.extId} />
              )}
              suffixText="位协作人"
            />
          }>
          协作人
        </List.Item>
        <List.Item extra={data.groupName} className={styles['info-li']}>
          商机分组
        </List.Item>
        <List.Item
          extra={get(data, 'stage.name')}
          className={styles['info-li']}
          onClick={onChangeStage}>
          商机阶段
        </List.Item>
        <List.Item
          extra={
            priorityName ? (
              <span
                className={cls({
                  [styles['priority-item']]: true,
                  [styles['high-priority']]:
                    data.priority === PRIORITY_VALS.HIGH,
                  [styles['middle-priority']]:
                    data.priority === PRIORITY_VALS.MIDDLE,
                  [styles['low-priority']]: data.priority === PRIORITY_VALS.LOW,
                })}>
                {priorityName}
              </span>
            ) : (
              '-'
            )
          }>
          优先级
        </List.Item>
        <List.Item
          extra={
            data.expectMoney > 0 || data.expectMoney === 0
              ? `￥${formatNumber(data.expectMoney)}`
              : '-'
          }>
          商机金额
        </List.Item>
        <List.Item
          extra={
            data.dealChance > 0 || data.dealChance === 0
              ? `${data.dealChance}%`
              : '-'
          }>
          成交概率
        </List.Item>
        <List.Item
          extra={
            data.expectDealDate
              ? moment(data.expectDealDate).format('YYYY/MM/DD')
              : '-'
          }>
          预计成交时间
        </List.Item>
      </List>
    </div>
  )
}
