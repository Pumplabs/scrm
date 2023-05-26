import { useRef } from 'react'
// import moment from 'moment'
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom'
import { GetAppInfo } from 'src/api'
import { SUCCESS_CODE, USER_KEY } from 'src/utils/constants'
import { createURLSearchParams, decodeSearchParams } from 'src/utils'

export default () => {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  // const [userData, setUserData] = useState({})
  // const [taskInfo, setTaskInfo] = useState({})
  const searchDataRef = useRef({})

  const jumpPage = (nextPath) => {
    let nextName = ''
    if (nextPath) {
      nextName = nextPath
    } else {
      nextName = location.pathname === `/` ? '/home' : location.pathname
    }
    if (nextName !== location.pathname) {
      const paramsStr = createURLSearchParams({
        corpId: searchDataRef.current.corpId,
        taskId: searchDataRef.current.taskId,
      })
      navigate(`${nextName}?${paramsStr}`)
    }
  }

  // const getUserInfoError = () => {
  //   setTaskInfo({
  //     taskId: searchDataRef.current.taskId,
  //   })
  //   setUserData({
  //     extCorpId: searchDataRef.current.corpId,
  //   })
  //   // alert(`获取用户信息失败:${searchParams.get('corpId')}, ${hasFetch.current}`)
  //   jumpPage(`/joinActivity`)
  // }

  // // 获取活动信息
  // const getTaskTimeInfo = async () => {
  //   let times = Date.now()
  //   try {
  //     const res = await GetTaskTimeInfo({
  //       extCorpId: searchDataRef.current.corpId,
  //       taskId: searchDataRef.current.taskId
  //     })
  //     if (res.code === SUCCESS_CODE && res.data) {
  //       const taskTimes = moment(res.data.endTime).diff(
  //         moment(res.data.systemTime)
  //       )
  //       const diff = Math.floor((taskTimes - (Date.now() - times)) / 1000)
  //       if (diff > 0) {
  //         setTaskInfo({
  //           taskId: searchDataRef.current.taskId,
  //           diffTime: diff,
  //         })
  //         return true
  //       } else {
  //         jumpPage(`/expired`)
  //       }
  //     } else {
  //       jumpPage(`/empty`)
  //       return false
  //     }
  //   } catch (e) {
  //     jumpPage(`/empty`)
  //     return false
  //   }
  // }

  // // 获取用户和任务信
  // const getUserInfoAndTaskInfo = async (params) => {
  //   const userInfoRes = await getUserInfo(params)
  //   if (userInfoRes) {
  //     const taskRes = await getTaskTimeInfo()
  //     if (taskRes) {
  //       const currentPathName = location.pathname
  //       const nextPath =
  //         currentPathName === '/home' || currentPathName === 'detail'
  //           ? currentPathName
  //           : '/home'
  //       jumpPage(nextPath)
  //     }
  //   }
  // }

  // 授权登录
  const authLogin = async () => {
    const baseUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize'
    const appRes = await GetAppInfo({
      extCorpId: searchParams.get('corpId'),
    })
    const searchPar = encodeURIComponent(window.location.search.slice(1))
    const redirectUrl = `${window.location.origin}${window.location.pathname}?search=${searchPar}`
    if (appRes.code === SUCCESS_CODE && appRes.data) {
      const data = appRes.data
      const params = [
        ['appid', data.mpAppId],
        ['redirect_uri', encodeURIComponent(redirectUrl)],
        ['response_type', 'code'],
        ['scope', 'snsapi_userinfo'],
        ['state', 'STATE'],
        ['component_appid', data.componentAppId],
      ]
      const paramsStr = createURLSearchParams(params) + '#wechat_redirect'
      const loginUrl = `${baseUrl}?${paramsStr}`
      console.log(loginUrl);
      var a = document.createElement('a')
      a.href = loginUrl
      a.click()
    } else {
      // TODO:
      // 获取授权信息失败
      alert('获取授权信息失败')
    }
  }

  // 检查登录
  const checkLogin = () => {
    // 判断是否含有search,含有search表示授权回调界面
    if (searchParams.get('search')) {
      if (searchParams.get('code')) {
        const data = decodeSearchParams(
          decodeURIComponent(searchParams.get('search'))
        )
        // setSearchData(data)
        return {
          type: 'authcallback',
          data: {
            code: searchParams.get('code'),
            corpId: data.corpId,
            appId: searchParams.get('appid'),
            taskId: data.taskId,
          },
        }
      } else {
        // TODO: 用户不授权
        alert('未授权不能参加活动哦')
      }
    } else {
      // 判断是否携带了corpId,taskId
      if (!searchParams.get('corpId') || !searchParams.get('taskId')) {
        // 跳转至无活动界面
        jumpPage(`/empty`)
        return
      }
      // 如果本地已经存在customerId
      if (localStorage.getItem(USER_KEY)) {
        return {
          type: 'existUser',
          data: {
            corpId: searchParams.get('corpId'),
            taskId: searchParams.get('taskId'),
            extCustomerId: localStorage.getItem(USER_KEY),
          },
        }
      } else {
        authLogin()
      }
    }
  }
  return {
    checkLogin,
    // userData,
    // taskInfo,
  }
}
