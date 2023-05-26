import InfiniteList from 'src/components/InfiniteList'
import useMaterialHook from 'src/pages/Material/useMaterialHook'
import { MaterialImgItemWithCheck } from 'src/pages/Material/components/ImgItem'
import styles from './index.module.less'

/**
 * @param {Number} type 素材类型
 * @param {Function} onCheck 选择素材
 * @param {Array<String>} selectedKeys 已选择的素材id集合
 */
export default ({ type, onCheck, selectedKeys = [], uniqueKey = 'id', wrapClassName }) => {
  const {
    tableProps,
    run: runGetArticleList,
    params: searchParams,
    loading,
  } = useMaterialHook({
    type,
  })
  const getItemKey = (item) => {
    if (typeof uniqueKey === 'function') {
      return uniqueKey(item)
    } else {
      return item[uniqueKey]
    }
  }
  return (
    <InfiniteList
    loading={loading}
    {...tableProps}
    loadNext={runGetArticleList}
    searchParams={searchParams}
    listItemClassName={styles['list-item-wrap']}
    wrapClassName={wrapClassName}
    bordered={false}
    renderItem={(ele) => {
      const eleKey = getItemKey(ele)
      const checked = selectedKeys.includes(eleKey)
      return (
        <MaterialImgItemWithCheck
          key={eleKey}
          data={ele}
          checked={checked}
          onCheck={onCheck}
        />
      )
    }}></InfiniteList>
  )
}
