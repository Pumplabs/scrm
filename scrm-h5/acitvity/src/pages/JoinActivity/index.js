import { useEffect, useContext, useState } from 'react'
import { GetQrCode } from 'src/api'
import UserInfoContext from 'src/pages/Index/UserInfoContext'
import { SUCCESS_CODE } from 'src/utils/constants'
import styles from './index.module.less'

export default () => {
  const [imgUrl, setImgUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const {
    data: userData = {},
    taskInfo = {},
    jumpPage,
  } = useContext(UserInfoContext)

  const getQrCode = async () => {
    try {
      setLoading(true)
      const res = await GetQrCode({
        corpId: userData.extCorpId,
        taskId: taskInfo.taskId,
      })
      setLoading(false)
      if (res.code === SUCCESS_CODE && res.data) {
        setImgUrl(res.data)
      } else {
        jumpPage('/empty')
      }
    } catch (e) {
      setLoading(false)
      jumpPage('/empty')
    }
  }
  useEffect(() => {
    if (userData.extCorpId && taskInfo.taskId) {
      getQrCode()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, taskInfo])
  return (
    <div className={styles.page}>
      <div className={styles['page-body']}>
        {loading ? null : (
          <div className={styles['qcode-box']}>
            <p className={styles['tip']}>扫描立即参加活动吧</p>
            <img alt="" src={imgUrl} className={styles['qcode-img']} />
            <p className={styles['tip']}>长按二维码识别添加微信</p>
          </div>
        )}
      </div>
    </div>
  )
}
