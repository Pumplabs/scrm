import { useContext } from 'react'
import moment from 'moment'
import cls from 'classnames'
import { useRequest } from 'ahooks'
import { useNavigate } from 'react-router-dom'
import { MobXProviderContext, observer } from 'mobx-react'
import OpenEle from 'components/OpenEle'
import List from 'components/List'
import { NUM_CN } from 'src/utils/constants'
import coffeeIconUrl from 'src/assets/images/icon/icon_coffee.svg'
import iconFollowUrl from 'src/assets/images/icon/icon_follow.png'
import iconMassUrl from 'src/assets/images/icon/icon_mass.png'
import iconGroupUrl from 'src/assets/images/icon/icon_group.png'
import iconCircleUrl from 'src/assets/images/icon/icon_circle.png'
import productIconUrl from 'src/assets/images/icon/product-icon.svg'
import materialIconUrl from 'src/assets/images/icon/material-icon.svg'
import orderIconUrl from 'src/assets/images/icon/order-icon.svg'
import oppIconUrl from 'src/assets/images/icon/opp-icon.svg'
import { GetTodoList } from 'src/services/modules/todo'
import { TODO_STAUTS } from 'src/pages/TodoList/constants'
import CustomerStat from './CustomerStat'
import styles from './index.module.less'

const IndexContent = observer(() => {
  const navigate = useNavigate()
  const { UserStore } = useContext(MobXProviderContext)
  const { data: todoRes = {} } = useRequest(GetTodoList, {
    defaultParams: [
      {
        current: 1,
      },
      {
        status: TODO_STAUTS.UN_DONE,
      },
    ],
  })

  const onClickMyTodoList = () => {
    navigate('/todoList')
  }

  const onClickCustomerState = () => {
    navigate('/customerMoment')
  }

  const onClickCustomerFollow = () => {
    navigate('/followList')
  }

  const onClickCustomerMass = () => {
    navigate('/customerMass')
  }

  const onClickMaterial = () => {
    navigate('/materialList')
  }

  const onClickGroupMass = () => {
    navigate('/groupMass')
  }

  const onClickOpportunity = () => {
    navigate('/opportunity')
  }
  const onClickProduct = () => {
    navigate('/productList')
  }

  const onClickOrder = () => {
    navigate('/orderList')
  }

  const onSendCircle = () => { }

  const onClickFollow = () => { }

  const isAm = moment().hours() <= 12
  const weekDate = moment().day()



  console.log("workbench");
  return (
    <div className={styles['index-section']}>
      <div className={styles['index-header']}>
        <p className={styles['user-name-section']}>
          <img src={coffeeIconUrl} alt="" className={styles['coffee-icon']} />
          <OpenEle type="userName" openid={UserStore.userData.name} />，
          {isAm ? '上午' : '下午'}好
        </p>
        <p className={styles['date-info']}>
          <span className={styles['week-date']}>
            星期{weekDate === 0 ? '日' : NUM_CN[weekDate]}
          </span>
          <span>{moment().format('MM/DD')}</span>
        </p>
      </div>
      <div className={styles['index-body']}>
        <StatSection title="总览" className={styles['overview']}>
          <CustomerStat />
        </StatSection>
        <StatSection title="协同" className={styles['teamwork']}>
          <List className={styles['teamwork-list']} size="large">
            <List.Item extra={todoRes.total} onClick={onClickMyTodoList}>
              我的待办
            </List.Item>
            <List.Item onClick={onClickCustomerState}>客户动态</List.Item>
            <List.Item onClick={onClickCustomerFollow}>客户跟进</List.Item>
          </List>
        </StatSection>
        <StatSection title="营销" className={styles['market-section']}>
          <ul className={styles['actions-ul']}>
            <MenuActionItem
              className={cls({
                [styles['customer-action-item']]: true,
              })}
              imgUrl={iconMassUrl}
              title="客户群发"
              onClick={onClickCustomerMass}
            />
            <MenuActionItem
              className={cls({
                [styles['group-action-item']]: true,
              })}
              imgUrl={iconGroupUrl}
              onClick={onClickGroupMass}
              title="客户群群发"
            />
            <MenuActionItem
              className={cls({
                [styles['follow-action-item']]: true,
              })}
              onClick={onClickMaterial}
              imgUrl={materialIconUrl}
              title="素材库"
            />
          </ul>
        </StatSection>
        <StatSection title="销售" className={styles['sale-section']}>
          <ul className={styles['actions-ul']}>
            <MenuActionItem
              className={cls({
                [styles['product-action-item']]: true,
              })}
              onClick={onClickProduct}
              imgUrl={productIconUrl}
              title="产品"
            />
            <MenuActionItem
              className={cls({
                [styles['opp-action-item']]: true,
              })}
              onClick={onClickOpportunity}
              imgUrl={oppIconUrl}
              title="商机"
            />
            <MenuActionItem
              className={cls({
                [styles['order-action-item']]: true,
              })}
              onClick={onClickOrder}
              imgUrl={orderIconUrl}
              title="订单"
            />
          </ul>
        </StatSection>
      </div>
    </div>
  )
})

const MenuActionItem = ({ className, imgUrl, title, ...rest }) => {
  return (
    <li
      className={cls({
        [styles['action-item']]: true,
        [className]: className,
      })}
      {...rest}>
      <span className={styles['action-item-icon-wrap']}>
        <img src={imgUrl} alt="" className={styles['action-item-icon']} />
      </span>
      <p className={styles['action-item-name']}>{title}</p>
    </li>
  )
}

const StatSection = ({ title, children, className }) => {
  return (
    <div
      className={cls({
        [styles['stat-section']]: true,
        [className]: className,
      })}>
      <div className={styles['stat-section-header']}>{title}</div>
      <div className={styles['stat-section-body']}>{children}</div>
    </div>
  )
}
export default IndexContent
