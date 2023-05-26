import { forwardRef, useEffect, useMemo, useImperativeHandle } from 'react'
import { GetCustomerMoment } from 'src/services/modules/customerManage'
import InfiniteList from 'src/components/InfiniteList'
import DateMomentCard from './DateMomentCard'
import { useInfiniteHook } from 'src/hooks'
import { covertListByDate, getFileUrl } from 'src/utils'
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

export default forwardRef(({ data, avatarData }, ref) => {
  const {
    tableProps,
    loading,
    cancel: cancelGetList,
    params: searchParams,
    run: runList,
    toFirst,
  } = useInfiniteHook({
    request: GetCustomerMoment,
    manual: true,
    handleList,
    rigidParams: {
      extCustomerId: data.customerExtId,
    },
  })

  useImperativeHandle(ref, () => ({
    refresh: toFirst,
  }))

  useEffect(() => {
    if (data.customerExtId && !loading) {
      runList()
    } else if (loading) {
      cancelGetList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.customerExtId])

  const momentList = useMemo(() => {
    return covertListByDate(tableProps.dataSource)
  }, [tableProps.dataSource])

  return (
    <div className={styles['moment-page']} ref={ref}>
      <InfiniteList
        loading={loading}
        loadNext={runList}
        {...tableProps}
        searchParams={searchParams}>
        {momentList.map((momentItem) => (
          <DateMomentCard
            key={momentItem.key}
            data={momentItem}
            avatarData={avatarData}
          />
        ))}
      </InfiniteList>
    </div>
  )
})
