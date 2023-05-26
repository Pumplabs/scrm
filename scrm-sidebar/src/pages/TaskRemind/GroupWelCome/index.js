import { useEffect, useMemo, useContext } from 'react'
import { Toast } from 'antd-mobile'
import { useRequest } from 'ahooks'
import { isEmpty } from 'lodash'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { MobXProviderContext, observer } from 'mobx-react'
import RemindCard from '../RemindCard'
import GroupItem from 'components/GroupItem'
import { GetGroupWelcome } from 'src/services/modules/groupWelcome'
import { useGetPlatform } from 'src/hooks/wxhook'

export default observer(() => {
  const { platform } = useGetPlatform()
  const { UserStore } = useContext(MobXProviderContext)
  const navigate = useNavigate()
  const {
    data: welcomeData = {},
    run: runGetGroupWelcome,
    loading,
  } = useRequest(GetGroupWelcome, {
    manual: true,
  })
  const [searchParams] = useSearchParams()
  const wid = searchParams.get('wid')

  useEffect(() => {
    if (wid) {
      runGetGroupWelcome({
        id: wid,
      })
    } else {
      navigate('/missingParam')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wid])

  const openGroup = (groupItem) => {
    window.wx.invoke(
      'openExistedChatWithMsg',
      {
        chatId: groupItem.extChatId,
      },
      function (res) {
        if (res.err_msg !== 'openExistedChatWithMsg:ok') {
          if (platform === 'phone') {
            Toast.show({
              icon: 'fail',
              content: '打开群聊失败',
            })
          }
        }
      }
    )
  }
  const { groupChatList, customerTitle } = useMemo(() => {
    const groupChatList = Array.isArray(welcomeData.groupChatList)
      ? welcomeData.groupChatList.filter(ele => ele.owner === UserStore.userData.extId)
      : []
    const [record] = groupChatList
    const firstCustomerName = record ? `${record.name}` : ''
    const suffixStr = firstCustomerName ? '等' : ''
    return {
      groupChatList,
      customerTitle: firstCustomerName
        ? `${firstCustomerName}${suffixStr}`
        : '',
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [welcomeData.groupChatList])
  return (
    <RemindCard
      title="管理员通知你给客户群配置欢迎语"
      receiveTitle={`${customerTitle}${groupChatList.length}个客户群`}
      footer={null}
      loading={loading}
      msg={welcomeData.msg}
      isEmpty={isEmpty(welcomeData.msg)}
      receiveContent={
        <>
          {groupChatList.map((groupItem) => (
            <GroupItem
              data={groupItem}
              key={groupItem.id}
              onClick={openGroup}
            />
          ))}
        </>
      }
    />
  )
})
