import InfiniteList from 'src/components/InfiniteList'
import AppItem from './AppItem'
import useMaterialHook from 'src/pages/Material/useMaterialHook'
import styles from './index.module.less'

export default ({sendMetial}) => {
  const {
    tableProps,
    run: runGetList,
    params: searchParams,
    loading,
  } = useMaterialHook({
    type: 'MINI_APP',
  })
  
  return (
    <div>
      <InfiniteList
        loading={loading}
        {...tableProps}
        loadNext={runGetList}
        searchParams={searchParams}
        listItemClassName={styles['poster-item']}
        listItemStyle={{float: "left", width: 144, marginRight: 10, marginBottom: 10}}
        renderItem={(ele) => (
          <AppItem
            data={ele}
            onSend={() => sendMetial(ele)}
          />
        )}>
        </InfiniteList>
    </div>
  )
}
