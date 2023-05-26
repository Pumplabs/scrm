import { useEffect } from 'react'
import InfiniteList from 'src/components/InfiniteList'
import { getFileUrl } from 'services/modules/remoteFile'
import { GetTrackMaterialList } from 'services/modules/material'
import useInfiniteHook from 'src/hooks/useInfiniteHook'
import { MATERIAL_TYPE_EN_VALS } from 'src/pages/Material/constants'
import { MaterialCheckItem } from 'src/pages/Material/components/MaterialListItemWithTag'
import styles from './index.module.less'

const handleList = async (dataSource) => {
  const mediaIds = dataSource.map((ele) => ele.mediaId)
  const res = await getFileUrl(mediaIds)
  return dataSource.map((ele) => ({
    ...ele,
    filePath: res[ele.mediaId],
  }))
}

export default ({ searchParams, selectedKeys, onCheck }) => {
  const {
    tableProps,
    runAsync: runGetList,
    params: fetchParams,
    loading,
  } = useInfiniteHook({
    handleList,
    manual: true,
    rigidParams: {
      type: '',
      typeList: [MATERIAL_TYPE_EN_VALS.POSTER, MATERIAL_TYPE_EN_VALS.PICTUER],
    },
    request: GetTrackMaterialList,
  })

  useEffect(() => {
    if (searchParams.text) {
      runGetList(
        {
          current: 1,
          pageSize: tableProps.pagination.pageSize,
        },
        {
          title: searchParams.text,
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <div className={styles['mix-list']}>
      <InfiniteList
        loading={loading}
        {...tableProps}
        loadNext={runGetList}
        searchParams={fetchParams}
        bordered={false}
        listItemClassName={styles['list-item']}
        renderItem={(ele) => (
          <MaterialCheckItem
            data={ele}
            onCheck={onCheck}
            selectedKeys={selectedKeys}
            className={styles['material-item']}
          />
        )}></InfiniteList>
    </div>
  )
}
