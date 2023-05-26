import { useRequest } from 'ahooks'
import InfiniteList from 'components/InfiniteList'
import { useEffect, useMemo, useState } from 'react'
import { GetFilePreview } from 'services/modules/material'
import { getCosUrl } from 'services/modules/remoteFile'
import styles from './index.module.less'
export default ({ data = {} }) => {
  const [fetchLoading, setFetchLoading] = useState(false)
  const [tableProps, setTableProps] = useState({
    dataSource: [],
    total: 0,
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })
  const { data: fileData = {}, loading: fileLoading, run: runGetFilePreview} = useRequest(GetFilePreview, {
    manual: true,
    onSuccess: (res) => {
      if (
        res &&
        Array.isArray(res.previewPathList) &&
        res.previewPathList.length > 0
      ) {
        setTableProps((vals) => ({
          ...vals,
          total: res.previewPathList.length,
        }))
        runGetList({
          current: 1,
        })
      }
    },
  })
  useEffect(() => {
    if (data.fileId) {
      runGetFilePreview({
        id: data.fileId
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.fileId])
  const keyList = useMemo(() => {
    return Array.isArray(fileData.previewPathList)
      ? fileData.previewPathList
      : []
  }, [fileData])
  const runGetList = async ({
    current = 1,
    pageSize = tableProps.pagination.pageSize,
  }) => {
    setFetchLoading(true)
    const start = (current - 1) * pageSize
    const end = current * pageSize
    const keys = keyList.slice(start, end)
    let reqList = []
    keys.forEach(keyItem => {
      reqList = [...reqList, getCosUrl(data.id, {...fileData, key: keyItem})]
    })
    const cosRes = await Promise.all(reqList)
    setTableProps((vals) => ({
      ...vals,
      dataSource: [
        ...vals.dataSource,
        ...cosRes
      ],
    }))
  }
  return (
    <div className={styles['file-content']}>
      <InfiniteList
        {...tableProps}
        loading={fileLoading || fetchLoading}
        loadNext={runGetList}
        rowKey="key"
        listItemClassName={styles['file-list-item-wrap']}
        renderItem={(item) => (
          <div>
            <img src={item.url} alt=""className={styles['img-item']}/>
          </div>
        )}></InfiniteList>
    </div>
  )
}
