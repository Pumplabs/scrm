import { useMemo } from 'react'
import { Button } from 'antd-mobile'
import { encode } from 'js-base64'
import { CheckCircleOutline } from 'antd-mobile-icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { decodeUrl } from 'src/utils/paths'
import { useBack } from 'src/hooks'
import styles from './index.module.less'
export default () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { type, massId } = useMemo(() => {
    const str = location.search ? location.search.slice(1) : ''
    const params = str ? decodeUrl(location.search) : {}
    return params
  }, [location.search])

  const { listUrl, detailUrl } = useMemo(() => {
    if (type === 'group') {
      return {
        listUrl: '/groupMass',
        detailUrl: `/groupMassDetail/${encode(massId)}`
      }
    } else {
      return {
        listUrl: '/customerMass' ,
        detailUrl: `/customerMassDetail/${encode(massId)}`
      }
    }
  }, [type, massId])

  useBack({
    backUrl: listUrl
  })

  const onBackList = () => {
    navigate(listUrl)
  }

  const onDetail = () => {
    navigate(detailUrl)
  }
  return (
    <div className={styles['success-page']}>
      <div className={styles['success-content']}>
        <CheckCircleOutline className={styles['success-icon']} />
        <p className={styles['success-tip']}>发送成功</p>
      </div>
      <div className={styles['success-footer']}>
        <Button
          className={styles['back-btn']}
          color="primary"
          fill="outline"
          onClick={onBackList}>
          返回列表
        </Button>
        <Button
          className={styles['primary-btn']}
          color="primary"
          fill="solid"
          onClick={onDetail}>
          查看详情
        </Button>
      </div>
    </div>
  )
}
