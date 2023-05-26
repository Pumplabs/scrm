import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Store from 'store'
/**
 * @param {Function} onBeforeBack 返回前
 * @param {Function} onBack 点击返回
 * @param {String} backUrl 返回url,固定返回路径
 * @param {Boolean} isDynamic 是否为动态
 * @returns {Object}
 * @param {Function} handleGoback 当返回时
   @param {Function} onDynamicBack
 */
export default ({ onBeforeBack, onBack, backUrl, isDynamic }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const onDynamicBack = (url = backUrl) => {
    if (!isDynamic) {
      navigate(url)
      return
    }
    if (
      window.currentLocationKey &&
      window.currentLocationKey === window.firstLocationKey
    ) {
      navigate(url)
    } else {
      navigate(-1)
    }
  }

  const handleGoback = () => {
    if (typeof onBack === 'function') {
      onBack()
      return
    }
    if (backUrl) {
      if (isDynamic) {
        onDynamicBack(backUrl)
        return
      } else {
        navigate(backUrl)
        return
      }
    } else {
      navigate(-1)
    }
  }

  useEffect(() => {
    if (typeof window.wx.onHistoryBack === 'function') {
      window.wx.onHistoryBack(function () {
        const shouldBack = typeof onBeforeBack === 'function' ? onBeforeBack() : true
        if (shouldBack !== false) {
          handleGoback()
        }
        return false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Store.WxStore.configList, pathname])

  return {
    handleGoback,
    onDynamicBack,
  }
}
