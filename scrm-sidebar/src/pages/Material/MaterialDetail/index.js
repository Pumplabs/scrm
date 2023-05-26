import { useMemo, useRef } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { decode } from 'js-base64'
import { useRequest } from 'ahooks'
import { observer } from 'mobx-react'
import { isEmpty } from 'lodash'
import { Toast, Empty } from 'antd-mobile'
import { GetMaterialDetail } from 'services/modules/material'
import { getRequestError } from 'services/utils'
import { useBack } from 'src/hooks'
import Content from './Content'
import { decodeUrl } from 'src/utils/paths'
import styles from './index.module.less'

export default observer(() => {
  const { id } = useParams()
  const {search } = useLocation()
  const toastRef = useRef(null)
  const backUrl= useMemo(() => {
    if (search) {
      const parData = decodeUrl(search.slice(1))
      return parData.backUrl ? parData.backUrl : '/materialList'
    } else {
      return '/materialList'
    }
  }, [search])
  
  useBack({
    backUrl,
  })
  const { data: materialData = {}, loading: materiaLoading } = useRequest(
    GetMaterialDetail,
    {
      defaultParams: [
        {
          id: decode(id),
        },
      ],
      onBefore: () => {
        toastRef.current = Toast.show({
          icon: 'loading',
          duration: 0,
        })
      },
      onFinally: () => {
        if (toastRef.current) {
          toastRef.current.close()
          toastRef.current = null
        }
      },
      onError: (e) => {
        getRequestError(e)
        // 返回上一页
      },
    }
  )
  return (
    <div className={styles['page-content']}>
      {isEmpty(materialData) ? (
        <Empty />
      ) : (
        <Content data={materialData} loading={materiaLoading} />
      )}
    </div>
  )
})
