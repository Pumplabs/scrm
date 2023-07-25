import { useContext, useEffect, useState } from 'react'
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
import TodoListItem from '../TodoList/components/TodoListItem'
import CustomerStat from './CustomerStat'
import styles from './index.module.less'
import { SpinLoading, Tabs } from 'antd-mobile'
import defaultAvatorUrl from '../../assets/images/defaultAvator.jpg'
import { HiUser, HiLightBulb, HiCurrencyYen, HiIdentification } from 'react-icons/hi2'
import { getOverviewStatics } from '../../services/modules/statistics'
import { getStaffCurrentMonthSalesTarget } from 'services/modules/salestarget'
import { formatNumber } from 'utils'

const IndexContent = observer(() => {





  const { data: salesTarget = {}, loading: salesTargetLoading } = useRequest(getStaffCurrentMonthSalesTarget)
  const { data: overviewData = {}, loading: staticsLoading } = useRequest(getOverviewStatics)
  const [activeKey, setActiveKey] = useState("todo")
  const [todoList, setTodoList] = useState([])
  const navigate = useNavigate()
  const { UserStore } = useContext(MobXProviderContext)
  // const { run: runGetTodoList, loading: todoListLoading } = useRequest(GetTodoList, {
  //     manual: true,
  //     defaultParams: {
  //         pager:
  //         {
  //             current: 1,
  //         }, formVals:
  //         {
  //             status: TODO_STAUTS.UN_DONE,
  //         },
  //     },
  //     onSuccess: (data) => {
  //         setTodoList(data.list)
  //     }
  // })




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


  // const changeTab = key => {

  // }
  // const onDetail = () => {

  // }
  // const renderToDoItem = (item) => (
  //     <TodoListItem
  //         data={item}
  //         key={item.id}
  //         onDetail={onDetail}
  //         status={item.status}
  //     />
  // )
  // const renderToDoList = () => {
  //     if (todoList && todoList.length > 0) {
  //         return todoList.map(item => {
  //             console.log(item);
  //             return renderToDoItem(item)
  //         })
  //     }
  // }


  // useEffect(() => {
  //     if (activeKey === "todo") {
  //         runGetTodoList(
  //             {
  //                 current: 1,
  //             },
  //             {
  //                 status: TODO_STAUTS.UN_DONE,
  //             },
  //         )
  //     }
  // }, [activeKey])


  const onClickMyTodoList = () => {
    navigate('/todoList')
  }

  const onClickCustomerState = () => {
    navigate('/customerMoment')
  }

  const onClickCustomerFollow = () => {
    navigate('/followList')
  }
  const isAm = moment().hours() <= 12
  const weekDate = moment().day()


  let deptId = 1;
  if (UserStore.userData.deptIds) {
    try {
      deptId = JSON.parse(UserStore.userData.deptIds)[0] == undefined ? 1 : JSON.parse(UserStore.userData.deptIds)[0]
    } catch (error) {
      deptId = 1;
    }
  }

  // console.log("userdata", JSON.parse(UserStore.userData.deptIds)[0])
  return (
    <div className={styles['index-section']}>
      <div className={styles['index-header']}>
        <div className={styles['user-profile-wrap']}>
          <div className={styles['user-profile']}>
            <div className={styles['user-avatar']}>
              <img src={UserStore.userData.avatarUrl ? UserStore.userData.avatarUrl : defaultAvatorUrl} alt="" />
            </div>
            <div>
              <p className={styles['user-name']}><OpenEle type="userName" openid={UserStore.userData.name} /></p>
              <p className={styles['user-department']}><OpenEle type="departmentName" openid={deptId} /></p>
            </div>
          </div>
          <div className={styles['other-info']}>
            <p className={styles['date-info']}>{moment().format('YYYY/MM/DD')}   星期{weekDate === 0 ? '日' : NUM_CN[weekDate]}  {isAm ? '上午' : '下午'}</p>
            <p className={styles['sales-goal']}>{salesTarget.id == undefined ? "本月暂未设置销售目标" : (
              <>   <span className={styles['description']}>
                <span className={styles['property']}>本月目标:</span><span className={styles['value']}>{formatNumber(salesTarget.target, {
                  padPrecision: 2,
                })}</span></span>
                <span className={styles['description']}>
                  <span className={styles['property']}>已完成:</span><span className={styles['value']}>{formatNumber(salesTarget.finish, {
                    padPrecision: 2,
                  })}</span></span></>)}</p>
          </div>
        </div>
        {/* <p className={styles['user-name-section']}>
                    <img src={coffeeIconUrl} alt="" className={styles['coffee-icon']} />
                    <OpenEle tyep="userName" openid={UserStore.userData.name} />，
                    {isAm ? '上午' : '下午'}好
                </p>
                <p className={styles['date-info']}>
                    <span className={styles['week-date']}>
                        星期{weekDate === 0 ? '日' : NUM_CN[weekDate]}
                    </span>
                    <span>{moment().format('MM/DD')}</span>
                </p> */}
      </div>
      <div className={styles['index-body']}>
        <div className={styles['panel']}>
          <div className={styles['panel-title']}>
            总览 <span className={styles['title-description']}>(当前为今日数据)</span>
          </div>
          <div className={styles['panel-body']}>
            <div className={styles['overview-row']}>
              <div className={cls(styles['overview-item'], styles['bg-blue'])}>
                <div className={styles['index-name']}>
                  <div className={styles['index-icon']}>
                    <HiUser style={{ "verticalAlign": "-10%", }} size={28} color='#3A75C5' />
                  </div>
                  <div className={styles['index-text']}>
                    {overviewData.customerCount}
                  </div>
                </div>
                <div className={styles['index-value']}>
                  新增客户
                </div>
              </div>
              <div className={cls(styles['overview-item'], styles['bg-pink'])}>
                <div className={styles['index-name']}>
                  <div className={styles['index-icon']}>
                    <HiLightBulb style={{ "verticalAlign": "-10%", }} size={28} color='#DD4377' />
                  </div>
                  <div className={styles['index-text']}>
                    {overviewData.opportunityCount}
                  </div>
                </div>
                <div className={styles['index-value']}>
                  新增商机
                </div>
              </div>

            </div>
            <div className={styles['overview-row']}>
              <div className={cls(styles['overview-item'], styles['bg-green'])}>
                <div className={styles['index-name']}>
                  <div className={styles['index-icon']}>
                    <HiCurrencyYen style={{ "verticalAlign": "-50%", }} size={28} color='#57A65B' />
                  </div>
                  <div className={styles['index-text']}>
                    {overviewData.orderCount}
                  </div>
                </div>
                <div className={styles['index-value']}>
                  新增订单
                </div>
              </div>
              <div className={cls(styles['overview-item'], styles['bg-yellow'])}>
                <div className={styles['index-name']}>
                  <div className={styles['index-icon']}>
                    <HiIdentification style={{ "verticalAlign": "-10%", }} size={28} color='#F0BF42' />
                  </div>
                  <div className={styles['index-text']}>
                    {overviewData.followUpCount}
                  </div>
                </div>
                <div className={styles['index-value']}>
                  新增跟进
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* <div className={styles['panel']}>
                    <div className={styles['panel-title']}>
                        协同
                    </div>
                    <div className={styles['panel-body']}>
                        <Tabs onChange={changeTab} activeKey={activeKey}>
                            <Tabs.Tab title='我的待办' key='todo' >
                                {todoListLoading ? <SpinLoading /> : renderToDoList()}
                            </Tabs.Tab>
                            <Tabs.Tab title='客户动态' key='customerActivity'>
                                西红柿
                            </Tabs.Tab>
                            <Tabs.Tab title='跟进动态' key='followupActivity'>
                                蚂蚁
                            </Tabs.Tab>
                        </Tabs>
                    </div>
                </div> */}

        {/* <StatSection title="总览" className={styles['overview']}>
                    <CustomerStat />
                </StatSection> */}


        <StatSection title="协同" className={styles['teamwork']}>
          <List className={styles['teamwork-list']} size="large">
            <List.Item extra={todoRes.total} onClick={onClickMyTodoList}>
              我的待办
            </List.Item>
            <List.Item onClick={onClickCustomerState}>客户动态</List.Item>
            <List.Item onClick={onClickCustomerFollow}>客户跟进</List.Item>
          </List>
        </StatSection>
        {/* <StatSection title="营销" className={styles['market-section']}>
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
                </StatSection> */}
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
