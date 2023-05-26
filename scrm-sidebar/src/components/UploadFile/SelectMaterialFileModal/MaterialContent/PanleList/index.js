import { useEffect } from 'react'
import { Radio } from 'antd-mobile'
import cls from 'classnames'
import InfiniteList from 'src/components/InfiniteList'
import LinkItem from 'src/pages/Material/components/LinkItem'
import useMaterialHook from 'src/pages/Material/useMaterialHook'
import { MATERIAL_TYPE_EN_VALS } from 'src/pages/Material/constants'
import styles from './index.module.less'

/**
 * @param {String} type 素材类型
 * @param {Function} onCheck 点击勾选
 */
export default ({ type, needRemoteUrl, uniqueKey = 'id', onCheck, selectedKeys = [] }) => {
  const {
    tableProps,
    run: runGetList,
    params: searchParams,
    loading,
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
      default:
        return {}
    }
  }
  const getItemKey = (item) => {
    if (typeof uniqueKey === 'function') {
      return uniqueKey(item)
    } else {
      return item[uniqueKey]
    }
  }
  return (
    <div className={styles['panle-list']}>
      <InfiniteList
        loading={loading}
        bordered={false}
        {...tableProps}
        loadNext={runGetList}
        searchParams={searchParams}
        wrapClassName={styles['ul-wrap']}
        listItemClassName={styles['list-item-wrap']}
        renderItem={(ele) => {
          const eleKey = getItemKey(ele)
          const checked = selectedKeys.includes(eleKey)
          return (
            <LinkItemWithCheck
              data={ele}
              onCheck={onCheck}
              checked={checked}
              itemProps={getOtherProps(ele)}
            />
          )
        }}></InfiniteList>
    </div>
  )
}

const LinkItemWithCheck = ({ data = {}, onCheck, checked, itemProps = {} }) => {
  const handleCheck = (item, checked) => {
    if (typeof onCheck === 'function') {
      onCheck(item, checked)
    }
  }
  const onRadioChange = (item) => {
    handleCheck(item, checked)
  }
  return (
    <div
      key={data.id}
      onClick={() => handleCheck(data, !checked)}
      className={cls({
        [styles['list-item']]: true,
        [styles['list-check-item']]: checked,
      })}>
      <Radio
        checked={checked}
        className={styles['list-item-radio']}
        onChange={(e) => onRadioChange(data, e)}
        style={{
          '--icon-size': '18px',
          '--font-size': '14px',
          '--gap': '6px',
        }}
      />
      <LinkItem
        data={data}
        {...itemProps}
        className={styles['list-item-content']}
      />
    </div>
  )
}
