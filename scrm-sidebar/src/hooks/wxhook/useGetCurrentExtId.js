import { useEffect, useState } from 'react'
export default () => {
  const [userId, setUserId] = useState('')
  
  const getExtId = () => {
    if (typeof window.wx.invoke === 'function') {
      window.wx.invoke('getCurExternalContact', {}, function (res) {
        if (res.err_msg === 'getCurExternalContact:ok') {
          setUserId(res.userId)
        }
      })
    }
  }
  useEffect(() => {
    getExtId()
  }, [])
  return userId
}
