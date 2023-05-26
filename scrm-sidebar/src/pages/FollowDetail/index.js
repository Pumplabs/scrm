import { useMemo, useEffect, useRef, useState, useContext } from 'react'
import { Tag, Dialog, Toast } from 'antd-mobile'
import { useRequest } from 'ahooks'
import { get } from 'lodash'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { MessageOutline, CloseCircleOutline } from 'antd-mobile-icons'
import { observer, MobXProviderContext } from 'mobx-react'
import cls from 'classnames'
import List from 'components/List'
import ExpandCell from 'components/ExpandCell'
import { FileList } from 'components/UploadFile'
import { getCustomerName } from 'components/WeChatCell'
import { FollowStaffAndCustomer } from 'src/pages/FollowList'
import ReplyItem from './ReplyItem'
import {
  MentionUser,
  TaskList,
  ReplyModal,
  UserName,
  FollowTime,
} from 'src/pages/FollowList'
import { useModalHook, useBack } from 'src/hooks'
import { encodeUrl, decodeUrl, createUrlSearchParams } from 'src/utils/paths'
import {
  GetFollowDetail,
  RemoveFollow,
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
  const { run: runRemoveFollow } = useRequest(RemoveFollow, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        onBack()
      },
    }),
  })
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

  const { backUrl, editUrl } = useMemo(() => {
    if (pathname.startsWith('/noticefollowDetail')) {
      return {
        backUrl: '/home/notice',
        editUrl: `/editNoticeFollow/${id}`,
      }
    } else if (pathname.startsWith('/noticeReplyfollowDetail')) {
      return {
        backUrl: '/home/notice?tab=reply',
        editUrl: `/editNoticeFollow/${id}`,
      }
    } else if (pathname.startsWith('/customerfollowDetail')) {
      return {
        backUrl: `/customerDetail?${createUrlSearchParams(urlParams)}`,
        editUrl: `/editCustomerFollow/${id}?${encodeUrl({
          ...urlParams,
          isDetail: true,
        })}`,
      }
    } else if (pathname.startsWith('/momentfollowDetail')) {
      return {
        backUrl: `/customerMoment`,
        editUrl: `/editCustomerFollow/${id}?${encodeUrl({
          ...urlParams,
          isDetail: true,
        })}`,
      }
    } else {
      return {
        backUrl: '/followList',
        editUrl: `/editFollow/${id}?${encodeUrl({
          isDetail: true,
        })}`,
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, urlParams])

  const onBack = () => {
    navigate(backUrl)
  }

  useBack({
    onBack,
  })

  const onReplyCurrent = () => {
    openModal('replyCur')
  }

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

  const onEditFollow = () => {
    navigate(editUrl)
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
          <FollowStaffAndCustomer data={followData} convertName={false} />
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
  const toastRef = useRef()
  const {
    refresh,
    run: runGetFollowDetail,
    loading: followLoading,
    data: followData = {},
  } = useRequest(GetFollowDetail, {
    onSuccess: (res) => {
      if (res.wxCustomer) {
        document.title = `跟进-${getCustomerName(res.wxCustomer)}`
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
