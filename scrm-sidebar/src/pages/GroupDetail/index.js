import { useEffect, useContext, useRef } from 'react'
import { Dialog, Toast } from 'antd-mobile'
import Collapse from 'components/MyCollapse'
import cls from 'classnames'
import { toJS } from 'mobx'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { encode } from 'js-base64'
import {MobXProviderContext, observer } from 'mobx-react'
import { useRequest } from 'ahooks'
import { get } from 'lodash'
import List from 'components/List'
import OpenEle from 'components/OpenEle'
import { TagSection } from 'src/pages/CustomerDetail'
import { actionRequestHookOptions } from 'services/utils'
import { useBack } from 'src/hooks'
import { compareArray } from 'src/utils'
import { GetGroupByExtId, MarkGroupChatTag } from 'services/modules/group'
import useGetGroupExtId from './useGetGroupId'
import styles from './index.module.less'

export default observer(() => {
  const [searchParams] = useSearchParams()
  const extGroupId= searchParams.get('extGroupId')
  const chatExtId = useGetGroupExtId()
  const toastRef = useRef(null)
  const groupExtId = extGroupId ? extGroupId : chatExtId
  const {
    data: groupData = {},
    run: runGetGroupByExtId,
    refresh,
  } = useRequest(GetGroupByExtId, {
    manual: true,
  })
  const { run: runMarkGroupChatTag } = useRequest(MarkGroupChatTag, {
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
  const navigate = useNavigate()
  const location = useLocation()
  const { ModifyStore } = useContext(MobXProviderContext)
  const tagsArr = Array.isArray(groupData.tags) ? groupData.tags : []

  useBack({
    backUrl: `/home/cusotmerList?tab=group`
  })

  // const { openModal, closeModal, visibleMap, modalInfo } = useModalHook([
  //   'chooseTag',
  // ])

  useEffect(() => {
    if (groupExtId) {
      runGetGroupByExtId({
        extId: groupExtId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupExtId])

  useEffect(() => {
    const tagData = toJS(ModifyStore.tagData)
    if (tagData.hasChange && groupData.id) {
      const { addArr, noChangeArr } = compareArray(
        tagsArr,
        tagData.newValue,
        (item) => item.id
      )
      runMarkGroupChatTag({
        groupChatExtIds: [groupExtId],
        tagIds: [...noChangeArr, ...addArr],
      })
      ModifyStore.clearTagData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ModifyStore.tagData, groupData.id])

  const onRemoveTag = async (ele) => {
    const result = await Dialog.confirm({
      content: `确定要移除标签"${ele.name}"吗`,
    })
    if (result) {
      let tagIds = []
      tagsArr.forEach((item) => {
        if (item.id !== ele.id) {
          tagIds = [...tagIds, item.id]
        }
      })
      runMarkGroupChatTag({
        groupChatExtIds: [groupExtId],
        tagIds,
      })
    }
  }

  const onOpenSelectTag = () => {
    ModifyStore.updateTagData('oldValue', tagsArr)
    const path = `${location.pathname}${location.search}`
    navigate(`/selectTag?lastPath=${encode(path)}&mode=group`)
  }

  const indexData = [
    {
      label: '总人数',
      value: groupData.total || 0,
    },
    {
      label: '客户数',
      value: groupData.customerNum || 0,
    },
    {
      label: '今日入群',
      value: groupData.todayJoinMemberNum || 0,
    },
    {
      label: '今日退群',
      value: groupData.todayQuitMemberNum || 0,
    },
  ]
  return (
    <div className={styles['group-detail']}>
      <p className={styles['group-name']}>{groupData.name || '未命名群聊'}</p>
      <div>
        <List className={styles['group-base-info']}>
          <List.Item
            extra={
              <OpenEle
                type="userName"
                className={styles['owner-name']}
                openid={get(groupData, 'ownerInfo.name')}
              />
            }
           >
              群主
            </List.Item>
          <List.Item
            extra={
              <span className={styles['create-time']}>
                {groupData.createTime}
              </span>
            }
          >
              创建时间
            </List.Item>
        </List>
        <div className={styles['collapse']}>
          <Collapse defaultActiveKey={['customer-tag', 'related-info']}>
            <Collapse.Panel
              key="customer-tag"
              title={<span className={styles['my-collapse-title']}>标签</span>}
              className={cls({
                [styles['my-collapse']]: true,
                [styles['tag-collapse']]: true,
              })}>
              <TagSection
                onSelectTag={onOpenSelectTag}
                onRemoveTag={onRemoveTag}
                tagsArr={tagsArr}
              />
            </Collapse.Panel>
          </Collapse>
        </div>
        <ul className={styles['index-ul']}>
          {indexData.map((item) => (
            <li key={item.label} className={styles['index-item']}>
              <div className={styles['index-item-content']}>
                <span className={styles['index-label']}>{item.label}</span>
                <span className={styles['index-count']}>{item.value}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
})
