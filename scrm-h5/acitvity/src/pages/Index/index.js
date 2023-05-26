import { useEffect, useState, useRef } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import moment from 'moment'
import UserInfoContext from './UserInfoContext'
import useLogin from './useLogin'
import {
  GetUserInfoByCode,
  GetCustomerById,
  GetTaskTimeInfo,
} from 'src/api'
import { createURLSearchParams } from 'src/utils'
import { SUCCESS_CODE, USER_KEY } from 'src/utils/constants'

export default () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState({})
  const [taskInfo, setTaskInfo] = useState({})
  const [hasLogin, setHasLogin] = useState(false)
  const location = useLocation()
  const { checkLogin } = useLogin()
  const searchDataRef = useRef({})

  const jumpPage = (nextPath) => {
    const data = searchDataRef.current
    let nextName = ''
    if (nextPath) {
      nextName = nextPath
    } else {
      nextName = location.pathname === `/` ? '/home' : location.pathname
    }
    if (nextName !== location.pathname) {
      const paramsStr = createURLSearchParams({
        corpId: data.corpId,
        taskId: data.taskId,
      })
      navigate(`${nextName}?${paramsStr}`)
    }
  }

  // 获取用户信息
  const getUserInfo = async (params) => {
    const isFirst = params.code
    try {
      const res = isFirst
        ? await GetUserInfoByCode(params)
        : await GetCustomerById(params)
      if (res.code === SUCCESS_CODE && res.data && res.data.hasFriend) {
        const customerId = res.data.extId
        setUserData({
          ...res.data,
        })
        if (isFirst) {
          localStorage.setItem(USER_KEY, customerId)
        }
        return true
      } else {
        // 如果没有用户信息
        getUserInfoError('/joinActivity')
        return false
      }
    } catch (e) {
      getUserInfoError(`/sysError`)
      return false
    }
  }

  const getUserInfoError = (nextPath) => {
    const data = searchDataRef.current
    setTaskInfo({
      taskId: data.taskId,
    })
    setUserData({
      extCorpId: data.corpId,
    })
    // alert(`获取用户信息失败:${searchParams.get('corpId')}, ${hasFetch.current}`)
    jumpPage(nextPath)
  }

  // 获取活动信息
  const getTaskTimeInfo = async () => {
    let times = Date.now()
    const searchData = searchDataRef.current
    try {
      const res = await GetTaskTimeInfo({
        corpId: searchData.corpId,
        taskId: searchData.taskId,
      })
      if (res.code === SUCCESS_CODE && res.data) {
        const taskTimes = moment(res.data.endTime).diff(
          moment(res.data.systemTime)
        )
        const diff = Math.floor((taskTimes - (Date.now() - times)) / 1000)
        setTaskInfo({
          taskId: searchData.taskId,
          diffTime: diff,
        })
        if (diff > 0) {
          return true
        } else {
          jumpPage(`/expired`)
          return false
        }
      } else {
        jumpPage(`/empty`)
        return false
      }
    } catch (e) {
      jumpPage(`/empty`)
      return false
    }
  }

  // 获取用户和任务信
  const getUserInfoAndTaskInfo = async (params) => {
    const userInfoRes = await getUserInfo(params)
    if (userInfoRes) {
      const taskRes = await getTaskTimeInfo()
      if (taskRes) {
        const currentPathName = location.pathname
        const nextPath =
          currentPathName === '/home' || currentPathName === '/detail'
            ? currentPathName
            : '/home'
        jumpPage(nextPath)
      }
    }
  }

  useEffect(() => {
    if (!hasLogin) {
      if (window.myMode && !localStorage.getItem(USER_KEY) && location.pathname !== '/localLogin') {
        navigate('/localLogin')
        return;
      }
      const loginRes = checkLogin()
      setHasLogin(true)
      if (loginRes) {
        searchDataRef.current = loginRes.data
        let params = {}
        if (loginRes.type === 'existUser') {
          params = {
            corpId: loginRes.data.corpId,
            extCustomerId: loginRes.data.extCustomerId
          }
          getUserInfoAndTaskInfo(params)
        } else if (loginRes.type === 'authcallback') {
          params = {
            code: loginRes.data.code,
            corpId: loginRes.data.corpId,
            appId: loginRes.data.appId
          }
          getUserInfoAndTaskInfo(params)
        }
      }
    }
  }, [])

  return (
    <UserInfoContext.Provider value={{ data: userData, taskInfo, jumpPage }}>
      <Outlet />
    </UserInfoContext.Provider>
  )
}
