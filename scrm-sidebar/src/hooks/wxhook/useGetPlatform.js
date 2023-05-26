import { useEffect, useState } from "react"

export default () => {
  const [platform, setPlatform] = useState('')
  const getPlatform = () => {
    const ua = navigator.userAgent.toLowerCase()
    let platform = 'pc'
    if (ua.indexOf('windows') > -1) {
      return platform
    } else if (ua.indexOf("android") > -1 || ua.indexOf("mobile") > -1) {
      return 'phone'
    } else {
      return platform
    }
  }
  useEffect(() => {
    setPlatform(getPlatform())
  }, [])

  return {
    platform
  }
}