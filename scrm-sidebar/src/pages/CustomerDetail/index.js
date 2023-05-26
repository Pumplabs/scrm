import { useMemo, useContext, useEffect, useRef } from 'react'
import { Tabs, Dialog, Toast, DotLoading } from 'antd-mobile'
import { useRequest } from 'ahooks'
import { RightOutline } from 'antd-mobile-icons'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import cls from 'classnames'
import { encode } from 'js-base64'
import { toJS } from 'mobx'
import { get } from 'lodash'
import { MobXProviderContext, observer } from 'mobx-react'
import OpenEle from 'components/OpenEle'
import MyTag from 'components/MyTag'
import Collapse from 'components/MyCollapse'
import List from 'components/List'
import { Content as MomentContent } from 'src/pages/CustomerMoment'
import { getCustomerName } from 'components/WeChatCell'
import CustomerAvatar from './CustomerAvatar'
import { Content as CustomerFollowContent } from './CustomerFollow'
import EditCustomerDescPopup from './components/EditCustomerDescPopup'
import EditStagePopup from './components/EditStagePopup'
import useGetCurCustomerHook from './useGetCurCustomerHook'
import {
  EditCustomerTag,
  RemoveJourneyCustomer,
} from 'services/modules/customer'
import { AddStageCustomer } from 'services/modules/customerJourney'
import { GetCustomerFollowList } from 'services/modules/follow'
import { compareArray } from 'src/utils'
import { useInfiniteHook, useModalHook, useBack } from 'src/hooks'
import { createUrlSearchParams, encodeUrl } from 'src/utils/paths'
import { actionRequestHookOptions } from 'services/utils'
import { useGetEntry } from 'src/hooks/wxhook'
import { getTagsByStaffId } from './utils'
import { FOLLOW_TYPES } from 'src/pages/FollowList/constants'
import SpinContent from './SpinContent'
import { CallPhoneIcon, CarbonTaskIcon, ChatIcon } from 'components/MyIcons'
import styles from './index.module.less'
import { EditJourneyCustomer } from 'services/modules/customer'

export default observer(() => {
  const { UserStore, ModifyStore } = useContext(MobXProviderContext)
  const { pageEntry } = useGetEntry()
  const navigate = useNavigate()
  const location = useLocation()
  const toastRef = useRef(null)
  const [searchParams] = useSearchParams()
  const curUserStaffId = UserStore.userData.id
  const userStaffId = searchParams.get('staffId') || curUserStaffId
  const {
    customerInfo,
    refresh,
    loading: customerLoading,
  } = useGetCurCustomerHook({
    staffId: userStaffId,
  })
  const { openModal, closeModal, modalInfo, visibleMap } = useModalHook([
    'editDesc',
    'editStage',
  ])
  const { run: runEditJourneyCustomer } = useRequest(EditJourneyCustomer, {
    manual: true,
    onBefore: () => {
      Toast.show({
        icon: 'loading',
      })
    },
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: () => {
        refresh()
      },
    }),
  })
  const { run: runRemoveJourneyCustomer } = useRequest(RemoveJourneyCustomer, {
    manual: true,
    onBefore: () => {
      Toast.show({
        icon: 'loading',
      })
    },
    onFinally: () => {
      if (toastRef.current) {
        toastRef.current.close()
      }
    },
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: () => {
        refresh()
      },
    }),
  })
  const { run: runAddStageCustomer } = useRequest(AddStageCustomer, {
    manual: true,
    onBefore: () => {
      Toast.show({
        icon: 'loading',
      })
    },
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: () => {
        refresh()
      },
    }),
  })
  const { run: runEditCustomerTag } = useRequest(EditCustomerTag, {
    manual: true,
    onBefore: () => {
      toastRef.current = Toast.show({
        icon: 'loading',
        duration: 0,
      })
    },
    onFinally: () => {
      if (toastRef.current) {
        toastRef.current.close()
      }
    },
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: () => {
        refresh()
      },
    }),
  })
  const {
    tableProps: followTableProps,
    params: followSearchParams,
    runAsync: runFollowList,
  } = useInfiniteHook({
    request: GetCustomerFollowList,
    manual: true,
    rigidParams: {
      hasAll: true,
      extCustomerId: customerInfo.extId,
      isPermission: true,
      hasMain: false,
      type: FOLLOW_TYPES.CUSTOMER,
    },
  })
  useBack({
    backUrl: `/home/cusotmerList`,
  })

  const { paramMap, paramStr } = useMemo(() => {
    const data = {
      extCustomerId: customerInfo.extId,
      staffId: userStaffId,
      extStaffId: customerInfo.extCreatorName,
    }
    return {
      paramMap: data,
      paramStr: createUrlSearchParams(data),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerInfo.extId, userStaffId])

  const tagsArr = getTagsByStaffId(customerInfo)
  const chatList = Array.isArray(customerInfo.groupChatList)
    ? customerInfo.groupChatList
    : []
  const baseInfo = customerInfo.customerInfo ? customerInfo.customerInfo : {}

  useEffect(() => {
    if (customerInfo.id) {
      runFollowList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerInfo.id])

  useEffect(() => {
    const tagData = toJS(ModifyStore.tagData)
    if (tagData.hasChange && customerInfo.id) {
      const { addArr, removeArr } = compareArray(
        tagsArr,
        tagData.newValue,
        (item) => item.id
      )
      runEditCustomerTag({
        staffId: userStaffId,
        id: customerInfo.id,
        addTags: addArr,
        removeTags: removeArr,
      })
      ModifyStore.clearTagData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ModifyStore.tagData, customerInfo.id])

  const onRemoveTag = async (tagItem) => {
    const result = await Dialog.confirm({
      content: `确定要移除标签"${tagItem.name}"吗`,
    })
    if (result) {
      runEditCustomerTag({
        staffId: userStaffId,
        id: customerInfo.id,
        removeTags: [tagItem.id],
      })
    }
  }

  const onEdit = () => {
    navigate(`/customerDetail/customerBaseInfo?${paramStr}`)
  }

  const jumpToUsers = () => {
    navigate(`/customerDetail/customerUsers?${paramStr}`)
  }

  const jumpToGroupChat = () => {
    navigate(`/customerDetail/customerGroup?${paramStr}`)
  }

  // 跳转到协作员工
  const jumpToPartner = () => {
    navigate(`/customerDetail/partner?${paramStr}`)
  }

  const onSelectTag = () => {
    ModifyStore.updateTagData('oldValue', tagsArr)
    const path = `${location.pathname}${location.search}`
    navigate(`/selectTag?lastPath=${encode(path)}`)
  }

  const onCallCustomer = () => {
    if (!baseInfo.phoneNumber) {
      Toast.show({
        icon: 'fail',
        content: '没有电话信息，无法拨打电话',
      })
      return
    }
    let a = document.createElement('a')
    a.href = `tel:${baseInfo.phoneNumber}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const onOpenChat = () => {
    if (window.wx && window.wx.openEnterpriseChat) {
      window.wx.openEnterpriseChat({
        externalUserIds: customerInfo.extId,
        fail: function (res) {
          if (res.errMsg.indexOf('function not exist') > -1) {
            alert('版本过低请升级')
          }
        },
      })
    }
  }

  const onAddFollow = () => {
    navigate(
      `/addCustomerFollow?${encodeUrl({
        ...paramMap,
        name: getCustomerName(customerInfo),
      })}`
    )
  }

  const onFollowDetail = (item) => {
    navigate(`/customerfollowDetail/${item.id}?${encodeUrl(paramMap)}`)
  }

  const onEditFollow = (item) => {
    navigate(`/editCustomerFollow/${item.id}?${encodeUrl(paramMap)}`)
  }

  const onFollowMomentDetail = (momentData) => {
    navigate(
      `/customerfollowDetail/${get(momentData, 'info.followId')}?${encodeUrl(
        paramMap
      )}`
    )
  }
  const onEditDesc = () => {
    openModal('editDesc')
  }
  const onEditDescOk = (vals) => {
    closeModal()
  }
  const onEditStage = () => {
    openModal('editStage')
  }

  const onStageOk = ({ step, stageId }) => {
    closeModal()
    if (stageStep !== step) {
      if (step === -1) {
        runRemoveJourneyCustomer({
          stageId: oldStageId,
          customerExtId: customerInfo.extId,
        })
      } else {
        if (stageStep === -1) {
          runAddStageCustomer({
            customerId: customerInfo.id,
            journeyStageId: stageId,
          })
        } else {
          const params = {
            customerId: customerInfo.id,
            journeyStageId: stageId,
          }
          runEditJourneyCustomer(params)
        }
      }
    }
  }
  const {
    stageName,
    stageStep,
    stageId: oldStageId,
  } = useMemo(() => {
    const journeyList = Array.isArray(customerInfo.journeyList)
      ? customerInfo.journeyList
      : []
    const [curJourney] = journeyList
    if (curJourney) {
      const stageList = Array.isArray(curJourney.journeyStages)
        ? curJourney.journeyStages
        : []
      const [stageId] = Array.isArray(customerInfo.customerStageIdList)
        ? customerInfo.customerStageIdList
        : []
      let stageStep = -1
      const curStage = stageList.find((ele, idx) => {
        if (ele.id === stageId) {
          stageStep = idx
          return true
        } else {
          return false
        }
      })
      return {
        stageId,
        stageStep,
        stageName: curStage ? curStage.name : '',
      }
    } else {
      return {
        stageName: '',
        stageId: '',
        stageStep: -1,
      }
    }
  }, [customerInfo])

  return (
    <div className={styles['page']}>
      <EditCustomerDescPopup
        visible={visibleMap.editDescVisible}
        onCancel={closeModal}
        data={customerInfo}
        onOk={onEditDescOk}
      />
      <EditStagePopup
        visible={visibleMap.editStageVisible}
        onCancel={closeModal}
        data={customerInfo}
        onOk={onStageOk}
        stageStep={stageStep}
      />
      {!customerInfo.extId || customerLoading ? (
        <SpinContent />
      ) : (
        <>
          <div className={styles['page-header']}>
            <div className={styles['customer-avatar-info']}>
              <div className={styles['customer-avatar']}>
                <CustomerAvatar
                  corpName={customerInfo.corpName}
                  avatarUrl={customerInfo.avatar}
                  remark={
                    curUserStaffId === userStaffId
                      ? customerInfo.remark
                      : customerInfo.name
                  }
                  ninkname={customerInfo.name}
                />
              </div>
              <div className={styles['principal-item']}>
                负责人:
                <span className={styles['principal-name']}>
                  <OpenEle
                    type="userName"
                    openid={customerInfo.extCreatorName}
                  />
                </span>
              </div>
            </div>
            <ul className={styles['actions-ul']}>
              <li
                className={cls({
                  [styles['action-item']]: true,
                })}
                onClick={onCallCustomer}>
                <CallPhoneIcon
                  className={cls({
                    [styles['action-icon']]: true,
                  })}
                />
              </li>
              {pageEntry !== 'single_chat_tools' ? (
                <li
                  className={cls({
                    [styles['action-item']]: true,
                  })}
                  onClick={onOpenChat}>
                  <ChatIcon
                    className={cls({
                      [styles['action-icon']]: true,
                    })}
                  />
                </li>
              ) : null}
              <li
                className={cls({
                  [styles['action-item']]: true,
                })}
                onClick={onAddFollow}>
                <CarbonTaskIcon
                  className={cls({
                    [styles['action-icon']]: true,
                  })}
                />
              </li>
            </ul>
          </div>
          <div className={styles['page-body']}>
            <div className={styles['customer-stage']}>
              <List className={styles['customer-stage-list']}>
                <List.Item extra={stageName || '无'} onClick={onEditStage}>
                  客户阶段
                </List.Item>
              </List>
            </div>
            <Collapse defaultActiveKey={['customer-tag', 'related-info']}>
              <Collapse.Panel
                key="customer-tag"
                title={
                  <span className={styles['my-collapse-title']}>标签</span>
                }
                className={cls({
                  [styles['tag-collapse']]: true,
                })}>
                <TagSection
                  tagsArr={tagsArr}
                  onSelectTag={onSelectTag}
                  onRemoveTag={onRemoveTag}
                />
              </Collapse.Panel>
              <Collapse.Panel
                key="related-info"
                title={
                  <span className={styles['my-collapse-title']}>关联信息</span>
                }
                className={cls({
                  'customer-related-collapse': true,
                })}>
                <List className={styles['customer-follow-tab']}>
                  <List.Item
                    extra={
                      <OverText
                        list={customerInfo.assistStaffList}
                        renderItem={(ele) => (
                          <OpenEle type="userName" openid={ele.name} />
                        )}
                        suffixText="位成员"
                      />
                    }
                    onClick={jumpToPartner}>
                    协助员工
                  </List.Item>
                  <List.Item
                    extra={
                      <OverText
                        list={customerInfo.followStaffList}
                        renderItem={(ele) => (
                          <OpenEle type="userName" openid={ele.name} />
                        )}
                        suffixText="位成员"
                      />
                    }
                    onClick={jumpToUsers}>
                    关联员工
                  </List.Item>
                  <List.Item
                    extra={
                      <OverText
                        list={chatList}
                        renderItem={(ele) =>
                          ele.name ? ele.name : '未命名群聊'
                        }
                        suffixText="个群聊"
                      />
                    }
                    onClick={jumpToGroupChat}>
                    关联群聊
                  </List.Item>
                </List>
              </Collapse.Panel>
            </Collapse>
            <div className={styles['customer-tabs']}>
              <Tabs defaultActiveKey="customer-moment">
                <Tabs.Tab title="客户动态" key="customer-moment">
                  <div className={styles['tab-content']}>
                    <MomentContent
                      extCustomerId={customerInfo.extId}
                      listClassName={styles['moment-infinite-list']}
                      onFollowDetail={onFollowMomentDetail}
                    />
                  </div>
                </Tabs.Tab>
                <Tabs.Tab title="基本信息" key="customer-info">
                  <div className={styles['tab-content']}>
                    <List className={styles['baseinfo-list']}>
                      <List.Item
                        description="电话"
                        className={styles['baseinfo-item']}
                        onClick={onEdit}>
                        {baseInfo.phoneNumber}
                      </List.Item>
                      <List.Item
                        description="Email"
                        className={styles['baseinfo-item']}
                        onClick={onEdit}>
                        {baseInfo.email}
                      </List.Item>
                      <List.Item
                        description="生日"
                        className={styles['baseinfo-item']}
                        onClick={onEdit}>
                        {baseInfo.birthday}
                      </List.Item>
                      <List.Item
                        description="地址"
                        className={styles['baseinfo-item']}
                        onClick={onEdit}>
                        {baseInfo.address}
                      </List.Item>
                      <List.Item
                        description="公司"
                        className={styles['baseinfo-item']}
                        onClick={onEdit}>
                        {baseInfo.corpName}
                      </List.Item>
                    </List>
                  </div>
                </Tabs.Tab>
                <Tabs.Tab title="跟进信息" key="follow-info">
                  <div className={styles['tab-content']}>
                    <CustomerFollowContent
                      onEdit={onEditFollow}
                      onDetail={onFollowDetail}
                      loadNext={runFollowList}
                      refresh={runFollowList}
                      searchParams={followSearchParams}
                      {...followTableProps}
                    />
                  </div>
                </Tabs.Tab>
              </Tabs>
            </div>
          </div>
        </>
      )}
      {/* SpinContent */}
    </div>
  )
})

export const TagSection = ({ onSelectTag, onRemoveTag, tagsArr = [] }) => {
  return (
    <div className={styles['tags-section']} onClick={onSelectTag}>
      {tagsArr.length
        ? tagsArr.map((ele) => (
            <MyTag
              color="primary"
              key={ele.id}
              className={styles['tags-ele']}
              closable={true}
              onClose={() => onRemoveTag(ele)}>
              {ele.name}
            </MyTag>
          ))
        : '无'}
      <RightOutline className={styles['tags-arrow']} />
    </div>
  )
}
const OverText = ({ list = [], suffixText = '', renderItem }) => {
  if (!Array.isArray(list) || list.length === 0) {
    return '无'
  }
  const total = list.length
  const maxLen = 1
  const arr = list.slice(0, maxLen)
  return (
    <span style={{ wordBreak: 'break-all' }}>
      {arr.map((ele, idx) => (
        <span key={idx}>
          {idx > 0 ? ',' : ''}
          {typeof renderItem === 'function' ? renderItem(ele, idx) : null}
        </span>
      ))}
      {total > 0 ? `等${total}${suffixText}` : ''}
    </span>
  )
}
