import { useEffect,useState } from 'react'
export default () => {
  const [groupId, setGroupId] = useState('')

  const checkEnter = () => {
    if (typeof window.wx.invoke === 'function') {
      window.wx.invoke('getContext', {}, function (res) {
        // normal、contact_profile、single_chat_tools、group_chat_tools、chat_attachment
        if (res.err_msg === 'getContext:ok') {
          // 如果是单聊入口
          if (res.entry === 'group_chat_tools') {
            getChatId()
          }
        } else {
          //错误处理
        }
      })
    }
  }

  const getChatId = () => {
    window.wx.invoke('getCurExternalChat', {}, function (res) {
      if (res.err_msg === 'getCurExternalChat:ok') {
        setGroupId(res.chatId)
      } else {
        //错误处理
      }
    })
  }

  useEffect(() => {
    checkEnter()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return groupId
}