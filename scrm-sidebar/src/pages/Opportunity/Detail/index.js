import { useEffect, useMemo, useContext, useState } from 'react'
import { DownOutline, EditSOutline } from 'antd-mobile-icons'
import { Empty, Tabs } from 'antd-mobile'
import { useRequest } from 'ahooks'
import moment from 'moment'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { decode } from 'js-base64'
import { observer, MobXProviderContext } from 'mobx-react'
import { get } from 'lodash'
import cls from 'classnames'
import { useBack, useModalHook, useInfiniteHook } from 'src/hooks'
import { CarbonTaskIcon } from 'components/MyIcons'
import OpenEle from 'components/OpenEle'
import WeChatCell from 'components/WeChatCell'
import { TaskItem } from 'src/pages/FollowList'
import MomentPane from './components/MomentPane'
import BaseInfo from './components/BaseInfo'
import FollowPane from './components/FollowPane'
import ChangePopup from './components/ChangePopup'
import FailPopup from './components/FailPopup'
import {
  GetOppDetail,
  ChangeOppStage,
  GetOppStageByGroupId,
  GetOppMoment,
} from 'services/modules/opportunity'
import { DoneTask } from 'services/modules/follow'
import { encodeUrl } from 'src/utils'
import { actionRequestHookOptions } from 'services/utils'
import { TABLE_NAME } from 'src/pages/Opportunity/components/LiveItem/constants'

import styles from './index.module.less'

export default observer(() => {
  const { UserStore } = useContext(MobXProviderContext)
  const { id: oppParId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('moment')
  const oppId = useMemo(() => decode(oppParId), [oppParId])
  const {
    run: runGetOppDetail,
    refresh: refreshOpp,
    data: oppData = {},
    loading: oppLoading,
    refresh,
  } = useRequest(GetOppDetail, {
    manual: true,
    onSuccess: (res) => {
      if (res.stage && res.stage.groupId) {
        runGetOppStageByGroupId({
          groupId: res.stage.groupId,
          typeCode: 'OPPORTUNITY_STAGE',
        })
      }
    },
  })
  const { run: runGetOppStageByGroupId, data: stageList = [] } = useRequest(
    GetOppStageByGroupId,
    {
      manual: true,
    }
  )
  const { run: runChangeOppStage } = useRequest(ChangeOppStage, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: () => {
        refresh()
      },
    }),
  })
  const {
    tableProps: momentOppProps,
    run: runGetOppMoment,
    params: fetchParams,
  } = useInfiniteHook({
    request: GetOppMoment,
    manual: true,
    defaultPageSize: 20,
    rigidParams: {
      tableName: TABLE_NAME.OPP
    },
    // onFinally: (_, res = { list: [] }) => {
    //   setPanelKeys((arr) => [...arr, ...res.list.map((item) => item.id)])
    // },
  })
  const { run: runDoneTask } = useRequest(DoneTask, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: refresh,
    }),
  })

  const { pathname } = useLocation()
  const { openModal, closeModal, modalInfo, visibleMap } = useModalHook([
    'changeStage',
    'failReason',
  ])
  useBack({
    backUrl: '/opportunity',
  })
  useEffect(() => {
    if (oppId) {
      runGetOppDetail({
        id: oppId,
      })
      runGetOppMoment(
        {},
        {
          dataId: oppId,
          tableName: '',
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oppId])

  const lossStageId = useMemo(() => {
    const item = stageList.find((item) => item.isSystem && item.name === '输单')
    return item ? item.id : ''
  }, [stageList])

  const onChangeStage = () => {
    openModal('changeStage')
  }

  const onChangeStageOk = (stage) => {
    if (stage === lossStageId) {
      openModal('failReason', {
        stageId: stage,
      })
    } else {
      closeModal()
      runChangeOppStage({
        id: oppData.id,
        stageId: stage,
      })
    }
  }

  const onFailReasonOk = (typeId) => {
    closeModal()
    runChangeOppStage({
      failReasonId: typeId,
      id: oppData.id,
      stageId: modalInfo.data.stageId,
    })
  }

  const onOppFollowDetail = (data) => {
    navigate(`/oppFollowDetail/${data.id}?${encodeUrl({ backUrl: pathname })}`)
  }
  const onDoneTask = (item) => {
    runDoneTask({
      taskId: item.id,
    })
  }

  const onAdd = () => {
    navigate(`/oppAddFollow/${oppParId}`)
  }

  const onEdit = () => {
    navigate(`/editOpp/${oppParId}?${encodeUrl({ backUrl: pathname })}`)
  }

  const onTabChange = (key) => {
    setActiveTab(key)
  }
  const followList = Array.isArray(oppData.followList) ? oppData.followList : []
  const taskList = Array.isArray(oppData.taskList) ? oppData.taskList : []
  // 可以选择阶段
  const shouldChangeStage = useMemo(() => {
    const isCloseStage = stageList.some(
      (item) => item.isSystem && item.id === oppData.stageId
    )
    return stageList.length && !isCloseStage ? true : false
  }, [oppData.stageId, stageList])

  const hasEditAuth = useMemo(() => {
    const partners = Array.isArray(oppData.cooperatorList)
      ? oppData.cooperatorList
      : []
    const owner = oppData.owner
    const userExtId = UserStore.userData.extId
    const isAdmin = UserStore.userData.isAdmin
    if (userExtId) {
      return (
        isAdmin ||
        owner === userExtId ||
        partners.some((ele) => ele.cooperatorId === userExtId && ele.canUpdate)
      )
    } else {
      return false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserStore.userData, oppData.owner])
  const shouldEdit = hasEditAuth && shouldChangeStage
  return (
    <div className={styles['detail-page']}>
      <ChangePopup
        visible={visibleMap.changeStageVisible}
        onCancel={closeModal}
        stageList={stageList}
        stageId={oppData.stageId}
        onOk={onChangeStageOk}
      />
      <FailPopup
        visible={visibleMap.failReasonVisible}
        onCancel={closeModal}
        onOk={onFailReasonOk}
      />
      <div className={styles['fixed-section']}>
        <div className={styles['header-info']}>
          <div
            className={cls({
              [styles['opp-name-wrap']]: true,
              [styles['has-edit']]: shouldEdit,
            })}>
            <p className={styles['opp-name']}>{oppData.name}</p>
            {shouldEdit ? (
              <EditSOutline className={styles['edit-icon']} onClick={onEdit} />
            ) : null}
          </div>
          <div className={styles['creator-section']}>
            <div className={styles['opp-customer']}>
              <WeChatCell size="mini" data={oppData.customer} />
            </div>
            <div className={styles['stage-item-wrap']}>
              <StageItem
                shouldEdit={shouldEdit}
                onClick={shouldEdit ? onChangeStage : undefined}>
                {get(oppData, 'stage.name')}
              </StageItem>
            </div>
          </div>
          <p className={styles['creator-info-wrap']}>
            <span className={styles['creator-info']}>
              <span className={styles['creator-item-label']}>创建人</span>
              <span className={styles['staff-item']}>
                <OpenEle type="userName" openid={oppData.creatorCN} />
              </span>
            </span>
          </p>
          <p className={styles['create-time-info']}>
            <span className={styles['create-time-text']}>
              {oppData.createdAt
                ? moment(oppData.createdAt).format('YYYY-MM-DD HH:mm')
                : null}
            </span>
            创建
          </p>
          <ul className={styles['action-section']}>
            <li className={styles['action-item']}>
              <CarbonTaskIcon
                className={styles['action-icon']}
                onClick={onAdd}
              />
            </li>
          </ul>
        </div>
        <div className={styles['tabs-header']}>
          <Tabs activeKey={activeTab} onChange={onTabChange}>
            <Tabs.Tab title="动态" key="moment"></Tabs.Tab>
            <Tabs.Tab title="基本信息" key="info"></Tabs.Tab>
            <Tabs.Tab title="跟进" key="follow"></Tabs.Tab>
            <Tabs.Tab title="待办任务" key="task"></Tabs.Tab>
          </Tabs>
        </div>
      </div>
      <div className={styles['detail-body']}>
        <div className={styles['body-content']}>
          <Tabs activeKey={activeTab}>
            <Tabs.Tab title="" key="moment">
              <MomentPane
                {...momentOppProps}
                loadNext={runGetOppMoment}
                searchParams={fetchParams}
              />
            </Tabs.Tab>
            <Tabs.Tab title="" key="info">
              <BaseInfo
                data={oppData}
                onChangeStage={shouldEdit ? onChangeStage : undefined}
              />
            </Tabs.Tab>
            <Tabs.Tab title="" key="follow">
              <FollowPane
                dataSource={followList}
                refresh={refreshOpp}
                onDetail={onOppFollowDetail}
                pagination={{
                  current: 1,
                  total: followList.length,
                }}
              />
            </Tabs.Tab>
            <Tabs.Tab title="" key="task">
              {taskList.length ? (
                <ul
                  className={cls({
                    [styles['follow-task-ul']]: true,
                  })}>
                  {taskList.map((ele) => (
                    <TaskItem key={ele.id} data={ele} onDone={onDoneTask} />
                  ))}
                </ul>
              ) : (
                <Empty description="暂时没有任务呢" />
              )}
            </Tabs.Tab>
          </Tabs>
        </div>
      </div>
    </div>
  )
})

const StageItem = ({ shouldEdit, onClick, children }) => {
  return (
    <span
      className={cls({
        [styles['stage-item']]: true,
        [styles['has-arrow']]: shouldEdit,
      })}
      onClick={shouldEdit ? onClick : undefined}>
      {children}
      {shouldEdit ? <DownOutline className={styles['stage-arrow']} /> : null}
    </span>
  )
}
