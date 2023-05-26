import { useState, useRef, useEffect, useMemo } from 'react'
import { Radio, Input, Empty, Tooltip, Typography } from 'antd'
import { debounce } from 'lodash'
import cls from 'classnames'
import InfiniteList from 'components/InfiniteList'
import CommonDrawer from 'components/CommonDrawer'
import { MATERIAL_TYPE_EN_VALS } from 'pages/SaleOperations/constants'
import { GetTrackMaterialList } from 'services/modules/trackMaterial'
import { useInfiniteHook } from 'src/hooks'
import styles from './index.module.less'

const { Paragraph } = Typography

export default (props) => {
  const { visible, data = {}, onOk, maxCount, ...rest } = props
  const [checkedKeys, setCheckedKeys] = useState([])
  const listRef = useRef(null)
  const {
    run: runGetTextList,
    loading,
    tableProps,
    cancel,
    params: searchParams,
  } = useInfiniteHook({
    manual: true,
    rigidParams: {
      type: MATERIAL_TYPE_EN_VALS.TEXT,
    },
    request: GetTrackMaterialList,
  })
  const dataSource = tableProps.dataSource

  useEffect(() => {
    if (visible) {
      runGetTextList()
    } else {
      if (loading) {
        cancel()
      }
      setCheckedKeys([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleOk = () => {
    if (typeof onOk === 'function') {
      const item = dataSource.find((ele) => ele.id === checkedKeys[0])
      onOk(item)
    }
  }

  const onSearchText = (e) => {
    runGetTextList(
      {
        pageSize: 20,
        current: 1,
      },
      {
        title: e.target.value,
      }
    )
  }

  const onRadioChange = (nextChecked, item) => {
    const value = nextChecked ? [item.id] : []
    setCheckedKeys(value)
  }

  const debounceSearchText = debounce(onSearchText, 200)

  const emptyText = useMemo(() => {
    const isNoResult = dataSource.length === 0 && !loading
    if (isNoResult && searchParams) {
      const [, formVals = {}] = searchParams
      return formVals.keyword ? '没有查询到相关数据哦~' : '目前没有此类素材哦~'
    } else {
      return ''
    }
  }, [dataSource, loading, searchParams])
  return (
    <CommonDrawer
      visible={visible}
      onOk={handleOk}
      bodyStyle={{
        paddingTop: 14,
      }}
      okButtonProps={{
        disabled: checkedKeys.length === 0,
      }}
      width={680}
      {...rest}>
      <div>
        <Input
          style={{ marginBottom: 12 }}
          placeholder="请输入查询内容"
          allowClear={true}
          onPressEnter={debounceSearchText}
          onChange={debounceSearchText}
        />
      </div>
      <InfiniteList
        ref={(r) => (listRef.current = r)}
        style={{ height: 'calc(100vh - 200px)', overflowY: 'auto' }}
        dataSource={tableProps.dataSource}
        pagination={tableProps.pagination}
        searchParams={searchParams}
        loading={loading}
        loadNext={tableProps.onChange}
        empty={<Empty description={emptyText} />}
        renderItem={(ele) => (
          <MaterialItem
            key={ele.id}
            checked={checkedKeys.includes(ele.id)}
            onRadioChange={onRadioChange}
            data={ele}
            renderContent={(record) => (
              <div className={styles['text-item']}>
                <Paragraph
                  ellipsis={{ rows: 4 }}
                  className={styles['paragraph-text']}>
                  {record.content}
                </Paragraph>
              </div>
            )}
          />
        )}></InfiniteList>
    </CommonDrawer>
  )
}

const MaterialItem = (props) => {
  const { className, checked, onRadioChange, data, renderContent } = props
  return (
    <div
      className={cls({
        [styles['list-item']]: true,
        [className]: className,
        [styles['list-item-active']]: checked,
      })}
      onClick={(e) => onRadioChange(!checked, data)}>
      <div className={styles['list-item-header']}>
        <Radio
          value={data.id}
          checked={checked}
          className={styles['list-item-radio']}
          onChange={(e) => onRadioChange(e.target.checked, data)}
        />
        <Tooltip title={data.title} placement="topLeft">
          <span className={styles['list-item-title']}>{data.title}</span>
        </Tooltip>
      </div>
      <div className={styles['list-item-content']}>
        {typeof renderContent === 'function' ? renderContent(data) : null}
      </div>
    </div>
  )
}
