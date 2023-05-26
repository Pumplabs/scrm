import { useEffect } from 'react'
import cls from 'classnames'
import { LocationOutline } from 'antd-mobile-icons'
import InfiniteList from 'src/components/InfiniteList'
import LinkItem from 'src/pages/Material/components/LinkItem'
import useMaterialHook from 'src/pages/Material/useMaterialHook'
import { MATERIAL_TYPE_EN_VALS } from 'src/pages/Material/constants'
import styles from './index.module.less'

/**
 * @param {String} type 素材类型
 * @param {Function} onCheck 点击勾选
 */
export default ({ type, needRemoteUrl, onSend, onDetail }) => {
  const {
    tableProps,
    run: runGetList,
    params: searchParams,
  } = useMaterialHook({
    manual: true,
    needRemoteUrl,
    type,
  })

  useEffect(() => {
    if (type) {
      runGetList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  const getOtherProps = (data = {}) => {
    switch (type) {
      case MATERIAL_TYPE_EN_VALS.ARTICLE:
        return {
          title: data.title,
          info: data.summary,
        }
      case MATERIAL_TYPE_EN_VALS.LINK:
        return {
          title: data.title,
          info: data.description,
          coverUrl: data.filePath,
        }
      case MATERIAL_TYPE_EN_VALS.VIDEO:
      case MATERIAL_TYPE_EN_VALS.FILE:
        return {
          title: data.title,
          info: data.description,
        }
      case MATERIAL_TYPE_EN_VALS.TEXT:
        return {
          title: data.title,
          info: data.content,
        }
      default:
        return {}
    }
  }
  const hasFooter = typeof onSend === 'function'
  return (
    <div className={styles['panle-list']}>
      <InfiniteList
        {...tableProps}
        loadNext={runGetList}
        searchParams={searchParams}
        wrapClassName={styles['infinite-list']}
        listItemClassName={styles['infinite-li-item']}
        bordered={false}
        renderItem={(ele) => {
          return (
            <div
              key={ele.id}
              className={cls({
                [styles['list-item']]: true,
                [styles['list-item-with-footer']]: hasFooter
              })}>
              <LinkItem
                data={ele}
                {...getOtherProps(ele)}
                className={styles['list-item-content']}
                coverSize={60}
                onClick={() => onDetail(ele)}
              />
              {hasFooter ? (
                <div className={styles['list-item-footer']}>
                  <LocationOutline
                    className={styles['send-icon']}
                    onClick={() => {
                      onSend(ele)
                    }}
                  />
                </div>
              ) : null}
            </div>
          )
        }}></InfiniteList>
    </div>
  )
}
