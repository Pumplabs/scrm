import { useEffect } from 'react'
import { SendOutlined } from '@ant-design/icons'
import InfiniteList from 'src/components/InfiniteList'
import { getFileUrl } from 'services/modules/remoteFile'
import { GetTrackMaterialList } from 'services/modules/material'
import useInfiniteHook from 'src/hooks/useInfiniteHook'
import { MATERIAL_TYPE_EN_VALS } from 'src/pages/Material/constants'
import MaterialItem from 'src/pages/Material/components/MaterialListItemWithTag'
import styles from './index.module.less'
const handleList = async (dataSource) => {
  const mediaIds = dataSource.map((ele) => ele.mediaId)
  const res = (await getFileUrl(mediaIds)) || {}
  return dataSource.map((ele) => ({
    ...ele,
    filePath: res[ele.mediaId],
  }))
}
let queryTypeList = []
for (const attr in MATERIAL_TYPE_EN_VALS) {
  if (attr !== MATERIAL_TYPE_EN_VALS.MINI_APP) {
    queryTypeList = [...queryTypeList, MATERIAL_TYPE_EN_VALS[attr]]
  }
}
export default ({ searchParams, onSend, onDetail }) => {
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
      typeList: queryTypeList,
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
    <div className={styles['result-list']}>
      <InfiniteList
        loading={loading}
        {...tableProps}
        loadNext={runGetList}
        searchParams={fetchParams}
        listItemClassName={styles['list-item-wrap']}
        renderItem={(ele) => (
          <ListItem data={ele} onSend={onSend} onDetail={onDetail} />
        )}></InfiniteList>
    </div>
  )
}

const ListItem = ({ data, onSend, onDetail }) => {
  const hasSend = typeof onSend === 'function'
  return (
    <div className={styles['list-item']}>
      <div className={styles['list-item-content']}>
        <MaterialItem
          data={data}
          coverSize={60}
          onClick={() => {
            if (typeof onDetail === 'function') {
              onDetail(data)
            }
          }}
        />
      </div>
      {hasSend ? (
        <div className={styles['list-item-footer']}>
          <SendOutlined
            onClick={() => {
              onSend(data)
            }}
          />
        </div>
      ) : null}
    </div>
  )
}
