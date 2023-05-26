import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { Empty, Input, Pagination } from 'antd'
import { debounce, isEmpty } from 'lodash'
import cls from 'classnames'
import { useTable } from 'src/hooks'
import { getFileUrl } from 'src/utils'
import { GetTrackMaterialList } from 'services/modules/trackMaterial'
import styles from './index.module.less'

/**
 * @param {Function} renderItem
 * @param {String} type
 * @param {String} needRemoteUrl
 */
export default forwardRef((props, ref) => {
  const {
    renderChildren,
    type,
    tabKey = '',
    needRemoteUrl,
    isActive,
    contentClassName,
  } = props
  const [inputText, setInputText] = useState('')
  const coverTableList = async (dataSource) => {
    let fileUrls = {}
    if (needRemoteUrl) {
      const mediaIds = dataSource.map((ele) => ele.mediaId)
      fileUrls = await getFileUrl(mediaIds)
    }
    return dataSource.map((ele) => {
      let data = {
        key: `${tabKey}_${ele.id}`,
      }
      if (needRemoteUrl) {
        data = {
          ...data,
          filePath: fileUrls[ele.mediaId],
        }
      }
      return {
        ...ele,
        ...data,
      }
    })
  }

  const { run: runGetList, tableProps } = useTable(GetTrackMaterialList, {
    manual: true,
    fixedParams: {
      type,
    },
    handleList: coverTableList,
  })

  const onReset = () => {
    setInputText('')
    runGetList(
      {
        current: 1,
        pageSize: 10,
      },
      {
        title: '',
      }
    )
  }

  useImperativeHandle(ref, () => ({
    reset: onReset,
  }))

  useEffect(() => {
    if (isActive) {
      runGetList(
        {
          current: 1,
          pageSize: 10,
        },
        {
          title: '',
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive])

  const onSearch = (e) => {
    runGetList(
      {
        current: 1,
      },
      {
        title: e.target.value,
      }
    )
  }

  const onPagerChange = (current, pageSize) => {
    tableProps.onChange({
      current,
      pageSize,
    })
  }

  const onInputChange = (e) => {
    setInputText(e.target.value)
    debounceSearch(e)
  }
  const debounceSearch = debounce(onSearch, 200)

  const emptyText = '暂时没有素材哦'
  return (
    <div
      className={cls({
        'my-material-drawer-list': true,
        [styles['list']]: true,
      })}
      ref={ref}>
      <div>
        <Input
          placeholder="素材关键字搜索"
          allowClear={true}
          value={inputText}
          onPressEnter={debounceSearch}
          onChange={onInputChange}
          className={styles['input']}
        />
      </div>
      <div
        className={cls({
          [styles['list-content']]: true,
          [contentClassName]: contentClassName,
        })}>
        {isEmpty(tableProps.dataSource) ? (
          <Empty description={emptyText} />
        ) : (
          <>
            {typeof renderChildren === 'function'
              ? renderChildren(tableProps.dataSource)
              : null}
          </>
        )}
      </div>
      <div className={styles['list-pager']}>
        <Pagination
          onChange={onPagerChange}
          current={tableProps.pagination.current}
          size="small"
          total={tableProps.pagination.total}
          showTotal={(total) => `共${total}条`}
        />
      </div>
    </div>
  )
})
