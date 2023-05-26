import { useMemo, useEffect, useState, useContext } from 'react'
import { Dialog } from 'antd-mobile'
import { useRequest } from 'ahooks'
import { get } from 'lodash'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { MessageOutline, CloseCircleOutline } from 'antd-mobile-icons'
import { observer, MobXProviderContext } from 'mobx-react'
import cls from 'classnames'
import List from 'components/List'
import ExpandCell from 'components/ExpandCell'
import { FileList } from 'components/UploadFile'
import { FollowStaff } from 'src/pages/FollowList'
import ReplyItem from 'pages/FollowDetail/ReplyItem'
import {
  MentionUser,
  TaskList,
  ReplyModal,
  UserName,
  FollowTime,
} from 'src/pages/FollowList'
import { useModalHook, useBack } from 'src/hooks'
import { decodeUrl } from 'src/utils/paths'
import {
  GetFollowDetail,
  AddFollowReply,
  ReadFollow,
  RemoveReply,
} from 'services/modules/follow'
import { actionRequestHookOptions } from 'src/services/utils'
import clockUrl from 'assets/images/icon/clock-icon.svg'
import { TEXT_KEY_BY_VAL } from 'components/MsgSection/constants'
import styles from './index.module.less'

const Content = observer(({ refresh, followData }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { UserStore } = useContext(MobXProviderContext)
  const { pathname, search } = useLocation()
  const { openModal, closeModal, visibleMap, modalInfo } = useModalHook([
    'remove',
    'replyCur',
    'replayToOther',
    'removeReply',
  ])
  const { run: runRemoveReply } = useRequest(RemoveReply, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        refresh()
      },
    }),
  })
  const { run: runAddFollowReply } = useRequest(AddFollowReply, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '回复',
      successFn: () => {
        refresh()
      },
    }),
  })

  const urlParams = useMemo(() => {
    return search ? decodeUrl(search.slice(1)) : {}
  }, [search])

  const { backUrl } = useMemo(() => {
    return {
      backUrl: urlParams.backUrl
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, urlParams])

  const onBack = () => {
    navigate(backUrl)
  }

  useBack({
    onBack,
  })

  // 回复当前跟进
  const onReplyCurrent = () => {
    openModal('replyCur')
  }

  // 回复他人回复
  const onReplyOtherReply = (item) => {
    openModal('replayToOther', item)
  }

  const onRemoveReply = async (data) => {
    const result = await Dialog.confirm({
      content: `确定要删除此回复吗`,
    })
    if (result) {
      runRemoveReply({
        id: data.id,
      })
    }
  }

  const onReplyOk = ({ text }) => {
    closeModal()
    let params = {
      content: {
        text: [
          {
            content: text,
            type: TEXT_KEY_BY_VAL.TEXT,
          },
        ],
      },
      followId: id,
    }
    if (modalInfo.type === 'replyCur') {
      params = {
        ...params,
        hasReplyFollow: 1,
        replyId: modalInfo.data.id,
      }
    } else {
      params = {
        ...params,
        hasReplyFollow: 0,
        replyId: modalInfo.data.id,
      }
    }
    runAddFollowReply(params)
  }

  const { textArr, mediaArr, replyList, shareExtStaffIds, taskList } =
    useMemo(() => {
      const { taskList, shareExtStaffIds, replyList } = followData
      const textArr = get(followData, 'content.text') || [{ content: '' }]
      const mediaArr = get(followData, 'content.media') || []
      return {
        textArr,
        mediaArr,
        replyList: Array.isArray(replyList) ? replyList : [],
        shareExtStaffIds: Array.isArray(shareExtStaffIds)
          ? shareExtStaffIds
          : [],
        taskList: Array.isArray(taskList) ? taskList : [],
      }
    }, [followData])

  const staff = followData.staff ? followData.staff : {}
  const isMe = UserStore.userData.name
    ? UserStore.userData.extId === staff.extId
    : false
  return (
    <>
      <ReplyModal
        title={
          visibleMap.replayToOtherVisible ? (
            <>
              回复
              <UserName userId={modalInfo.data.creatorExtId} />{' '}
            </>
          ) : null
        }
        visible={visibleMap.replyCurVisible || visibleMap.replayToOtherVisible}
        onOk={onReplyOk}
        onCancel={closeModal}
      />

      <div
        className={cls({
          [styles['follow-section']]: true,
          [styles['no-reply']]: replyList.length === 0,
        })}>
        <div className={styles['follow-header']}>
          <FollowStaff staffId={staff.extId} convertName={false} />
          跟进了商机
          <span className={styles['opp-name']}>
            {get(followData, 'brOpportunity.name')}
          </span>
        </div>
        <div className={styles['follow-text']}>
          <ExpandCell
            maxHeight={200}
            fieldNames={{
              expand: '展开',
            }}>
            <p className={styles['text-content']}>{textArr[0].content}</p>
          </ExpandCell>
        </div>
        {mediaArr.length ? (
          <div className={styles['follow-files']}>
            <FileList mediaArr={mediaArr} />
          </div>
        ) : null}
        {shareExtStaffIds.length ? (
          <MentionUser
            dataSource={shareExtStaffIds}
            className={styles['follow-users']}
          />
        ) : null}
        {taskList.length > 0 ? (
          <TaskList
            dataSource={taskList}
            refresh={refresh}
            className={styles['follow-task']}
          />
        ) : null}
        {followData.remindAt && isMe ? (
          <div className={styles['follow-remind-time']}>
            <List>
              <List.Item
                extra={followData.remindAt}
                description="到设定时间负责人会收到提醒">
                <p className={styles['remind-time-title']}>
                  <img src={clockUrl} alt="" className={styles['clock-icon']} />
                  跟进提醒
                </p>
              </List.Item>
            </List>
          </div>
        ) : null}
        <div className={styles['follow-time-section']}>
          <span className={styles['follow-time']}>
            <FollowTime createdAt={followData.createdAt} />
          </span>
          <span onClick={onReplyCurrent}>
            <MessageOutline className={styles['msg-icon']} />
            {followData.replyNum}
          </span>
        </div>
      </div>
      <div className={styles['reply-section']}>
        {replyList.length ? (
          <ul className={styles['follow-reply-list']}>
            {replyList.map((replyItem) => (
              <ReplyItem
                onRemove={onRemoveReply}
                data={replyItem}
                onClick={onReplyOtherReply}
                followCreatorId={staff.name}
                key={replyItem.id}
              />
            ))}
          </ul>
        ) : null}
      </div>
    </>
  )
})

export default () => {
  const { id } = useParams()
  const [errorContent, setErrorContent] = useState('')
  const {
    refresh,
    run: runGetFollowDetail,
    loading: followLoading,
    data: followData = {},
  } = useRequest(GetFollowDetail, {
    // onBefore: () => {
    //   toastRef.current = Toast.show({
    //     icon: 'loading',
    //     duration: 0,
    //   })
    // },
    // onFinally: () => {
    //   if (toastRef.current) {
    //     toastRef.current.close()
    //     toastRef.current = null
    //   }
    // },
    onSuccess: (res) => {
      if (res.brOpportunity) {
        document.title = `跟进-${res.brOpportunity.name}`
      }
    },
    onError: (e) => {
      const msg = get(e, 'response.data.msg') || '查询失败'
      setErrorContent(msg)
    },
    manual: true,
  })

  useEffect(() => {
    if (id) {
      runGetFollowDetail({
        id,
      })
      ReadFollow({
        followId: id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  return (
    <div
      className={cls({
        [styles['detail-page']]: true,
        [styles['fail-page-content']]: true,
      })}>
      {!followLoading && errorContent ? (
        <div className={styles['error-content']}>
          <CloseCircleOutline className={styles['error-icon']} />
          <p className={styles['error-text']}>{errorContent}</p>
        </div>
      ) : (
        <Content followData={followData} refresh={refresh}></Content>
      )}
    </div>
  )
}
