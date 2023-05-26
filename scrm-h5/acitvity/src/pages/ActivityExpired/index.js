import { useContext, useEffect } from 'react'
import InviteDetail from 'src/components/InviteDetail'
import UserInfoContext from 'src/pages/Index/UserInfoContext'
import { useRequest } from 'src/hooks'
import { GetCustomerPowerList, GetStageFinishDetail } from 'src/api'
import emojiUrl from 'src/assets/image/fail-emoji.png'
import styles from './index.module.less'

export default () => {
  const { data: userData = {}, taskInfo = {} } = useContext(UserInfoContext)
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

  useEffect(() => {
    if (userData.extCorpId && taskInfo.taskId) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, taskInfo])
  return (
    <div className={styles['page']}>
      <div className={styles['page-body']}>
        <div className={styles['tip-wrap']}>
          <img src={emojiUrl} alt="" className={styles['emoji-icon']} />
          <div>
            <p>Oops！！活动已经结束啦，</p>
            <p>下次早点来呀！！</p>
          </div>
        </div>
        <div>
          <InviteDetail
            stageList={stageList}
            powerUsers={powerUsers}
            isExpired={true}
          />
        </div>
      </div>
    </div>
  )
}
