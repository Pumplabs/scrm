import { SendOutlined } from '@ant-design/icons'
import cls from 'classnames'
import InfiniteList from 'src/components/InfiniteList'
import { MATERIAL_TYPE_EN_VALS } from '../../constants'
import useMaterialHook from 'src/pages/Material/useMaterialHook'
import MaterialImgItem from 'src/pages/Material/components/ImgItem'
import styles from './index.module.less'

/**
 * @param {Number} type 素材类型
 */
export default ({ type, onSend }) => {
  const {
    tableProps,
    run: runGetArticleList,
    params: searchParams,
    loading,
  } = useMaterialHook({
    type,
  })

  const hasFooter = typeof onSend === 'function'
  return (
    <InfiniteList
      loading={loading}
      {...tableProps}
      loadNext={runGetArticleList}
      searchParams={searchParams}
      listItemClassName={styles['list-item-wrap']}
      bordered={false}
      renderItem={(ele) => {
        return (
          <div className={cls({
            [styles['list-item']]: true,
            [styles['list-item-with-footer']]: hasFooter
          })}>
            <div className={styles['img-item']}>
              <MaterialImgItem
                key={ele.id}
                data={ele}
                isPoster={type === MATERIAL_TYPE_EN_VALS.POSTER}
              />
            </div>
            {typeof onSend === 'function' ? (
              <div className={styles['list-item-footer']}>
                <SendOutlined
                  onClick={() => {
                    onSend(ele)
                  }}
                />
              </div>
            ) : null}
          </div>
        )
      }}></InfiniteList>
  )
}
