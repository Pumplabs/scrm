import { useContext, useEffect, useMemo, useState, useRef } from 'react'
import UserInfoContext from 'src/pages/Index/UserInfoContext'
import UserPoster from './UserPoster'
import { useRequest } from 'src/hooks'
import ActivityInfo from './ActivityInfo'
import { GetCustomerPowerList, GetStageFinishDetail, GetPoster } from 'src/api'
import { formatTimes } from './utils'
import styles from './index.module.less'

export default () => {
  const {
    data: userData = {},
    taskInfo = {},
    jumpPage,
  } = useContext(UserInfoContext)
  const {
    data: stageList = [],
    // loading: stageLoading,
    run: runGetStageFinishDetail,
  } = useRequest(GetStageFinishDetail, {
    formatRes: (data) => {
      return Array.isArray(data) ? data : []
    },
  })
  const {
    data: powerUsers = [],
    // loading: powerUsersLoading,
    run: runGetCustomerPowerList,
  } = useRequest(GetCustomerPowerList, {
    formatRes: (data) => {
      return data && Array.isArray(data.records) ? data.records : []
    },
  })
  const { data: imgUrl = '', run: runGetPoster } = useRequest(GetPoster, {
    onSuccess: () => {
      runGetStageFinishDetail({
        corpId: userData.extCorpId,
        extCustomerId: userData.extId,
        taskId: taskInfo.taskId,
        pageNum: 1,
        pageSize: 10000,
      })
      runGetCustomerPowerList({
        corpId: userData.extCorpId,
        extCustomerId: userData.extId,
        taskId: taskInfo.taskId,
        pageNum: 1,
        pageSize: 10000,
      })
    }
  })

  const [times, setTimes] = useState(0)
  const timer = useRef(null)

  const setTimer = () => {
    timer.current = setInterval(() => {
      setTimes((val) => {
        if (val === 1) {
          clearInterval(timer.current)
          jumpPage(`/expired`)
        }
        return val - 1
      })
    }, 1000)
  }

  useEffect(() => {
    setTimes(taskInfo.diffTime || 0)
    if (taskInfo.diffTime > 0 && !timer.current) {
      setTimer()
    }
    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskInfo])

  useEffect(() => {
    if (userData.extCorpId && taskInfo.taskId) {
      runGetPoster({
        corpId: userData.extCorpId,
        extCustomerId: userData.extId,
        taskId: taskInfo.taskId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, taskInfo])

  const timeData = useMemo(() => {
    return formatTimes(times)
  }, [times])

  return (
    <div className={styles['page']}>
      <div className={styles['page-body']}>
        <UserPoster
          className={styles['user-poster']}
          imgCls={styles['user-poster-img']}
          imgUrl={imgUrl}
        />
        <ActivityInfo
          className={styles['activity-info']}
          timeData={timeData}
          powerUsers={powerUsers}
          stageList={stageList}
        />
      </div>
    </div>
  )
}
