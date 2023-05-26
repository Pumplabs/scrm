import { useEffect, useContext } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'
import cls from 'classnames'
import { get } from 'lodash'
import { useNavigate } from 'react-router-dom'
import MomentItem from './components/MomentItem'
import { GetCustomerMoment } from 'src/services/modules/customer'
import InfiniteList from 'src/components/InfiniteList'
import { getFileUrl } from 'services/modules/remoteFile'
import useInfiniteHook from 'src/hooks/useInfiniteHook'
import { useBack } from 'src/hooks'
import { encodeUrl } from 'src/utils'
import { getCustomerName } from 'components/WeChatCell'
import useGetCurCustomerHook from 'src/pages/CustomerDetail/useGetCurCustomerHook'
import { MOMENT_STATUS } from './constants'
import styles from './index.module.less'

const handleList = async (dataSource) => {
  let fileIds = []
  dataSource.forEach((ele) => {
    if (ele.type === MOMENT_STATUS.CHECK && ele.info && ele.info.mediaInfo) {
      fileIds = [...fileIds, ele.info.mediaInfo.fileId]
    }
  })
  const res = (await getFileUrl({ ids: fileIds })) || {}
  return dataSource.map((ele) => {
    const fieldId =
      ele.info && ele.info.mediaInfo ? ele.info.mediaInfo.fieldId : ''
    return {
      ...ele,
      filePath: res[fieldId],
    }
  })
}

export default observer(() => {
  const { UserStore } = useContext(MobXProviderContext)
  const { customerInfo } = useGetCurCustomerHook({
    staffId: UserStore.userData.id,
  })
  const navigate = useNavigate()
  useBack({
    backUrl: '/home',
  })
  const onFollowMomentDetail = (momentData) => {
    const paramMap = {
      name: getCustomerName(momentData.wxCustomer),
    }
    navigate(
      `/momentfollowDetail/${get(momentData, 'info.followId')}?${encodeUrl(
        paramMap
      )}`
    )
  }
  return (
    <Content
      extCustomerId={customerInfo.extId}
      className={styles['moment-page']}
      onFollowDetail={onFollowMomentDetail}
    />
  )
})
/**
 * @param {String} extCustomerId 客户的extId
 */
const Content = ({
  extCustomerId,
  style,
  className,
  listClassName,
  onFollowDetail,
}) => {
  const {
    tableProps,
    params: searchParams,
    runAsync: runList,
  } = useInfiniteHook({
    request: GetCustomerMoment,
    manual: true,
    handleList,
    rigidParams: extCustomerId
      ? {
          extCustomerId,
        }
      : {},
  })
  useEffect(() => {
    runList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extCustomerId])

  return (
    <div className={className} style={style}>
      <InfiniteList
        loadNext={runList}
        {...tableProps}
        searchParams={searchParams}
        renderItem={(item) => (
          <MomentItem
            key={item.id}
            data={item}
            onFollowDetail={onFollowDetail}
          />
        )}
        wrapClassName={cls({
          [styles['list-content']]: true,
          [listClassName]: listClassName,
        })}></InfiniteList>
    </div>
  )
}

export { Content }
