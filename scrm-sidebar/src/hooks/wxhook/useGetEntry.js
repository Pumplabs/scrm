import { useEffect, useState } from 'react'
//返回进入H5页面的入口类型
// 目前有normal、除以上场景之外进入，例如工作台，聊天会话等
// contact_profile、从联系人详情进入
// single_chat_tools、会话工具栏
// group_chat_tools、群聊工具栏
// chat_attachment 附件栏
export default () => {
  const [entry, setEntry] = useState('')
  const getPageEntry = () => {
    if (typeof window.wx.invoke === 'function') {
      window.wx.invoke('getContext', {}, function (res) {
        // normal、contact_profile、single_chat_tools、group_chat_tools、chat_attachment
        if (res.err_msg === 'getContext:ok') {
          setEntry(res.entry)
        }
      })
    }
  }
  useEffect(() => {
    getPageEntry()
  }, [])
  return {
    pageEntry: entry
  }
}