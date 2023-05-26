import { useMemo, useState, useEffect } from 'react'
import { Toast } from 'antd-mobile'
import cls from 'classnames'
import { ExclamationOutline } from 'antd-mobile-icons'
import { RadioGroup } from 'components/MyRadio'
import LazyTabPanle from 'components/LazyTabPanle'
import TrackMaterial from './TrackMaterial'
import NormalMaterial from './NormalMaterial'
import SearchBar from 'components/SearchBar'
import ResultList from './ResultList'
import styles from './index.module.less'

export const TAB_TYPES = {
  NORMAL: 'normal',
  TRACK: 'track',
}
const tabOptions = [
  {
    label: '普通素材',
    value: TAB_TYPES.NORMAL,
  },
  {
    label: '感知素材',
    value: TAB_TYPES.TRACK,
  },
]
export default ({
  onChange,
  selectedList = [],
  max,
  visible,
  searchClassName,
  contentClassName,
  className,
  showNormalMaterial,
  showTrackMaterial
}) => {
  const [tab, setTab] = useState(TAB_TYPES.NORMAL)
  const [inputText, setInputText] = useState('')
  const [searchParams, setSearchParams] = useState({ text: '', time: 0 })

  const onTabChange = (val) => {
    setTab(val)
  }
  const onTextChange = (e) => {
    setInputText(e.target.value)
  }

  const onSearch = () => {
    setSearchParams({
      text: inputText,
      time: Date.now(),
    })
  }

  const onCheck = (item, checked) => {
    if (checked && max === selectedList.length) {
      Toast.show({
        content: `当前最多只能选择${max}条数据`,
        icon: <ExclamationOutline />,
      })
      return
    }
    onChange(
      checked
        ? [
            ...selectedList,item
          ]
        : selectedList.filter((ele) => ele.id !== item.id)
    )
  }

  const selectedKeys = useMemo(() => {
    return selectedList.map((item) => item.id)
  }, [selectedList])

  useEffect(() => {
    if (!visible) {
      setTab(TAB_TYPES.NORMAL)
      setInputText('')
      setSearchParams({
        text: '',
        time: 0,
      })
    }
  }, [visible])

  const hasSearch = inputText.length > 0
  const showTab = showNormalMaterial && showTrackMaterial
  return (
    <div className={className}>
      <div
        className={cls({
          [styles['search-bar']]: true,
          [searchClassName]: searchClassName,
        })}>
        <SearchBar
          className={styles['search-bar-inner']}
          value={inputText}
          onChange={onTextChange}
          onSearch={onSearch}
        />
      </div>
      <div className={contentClassName}>
        {hasSearch ? (
          <div className={styles['mix-ul']}>
            <ResultList
              searchParams={searchParams}
              onCheck={onCheck}
              selectedKeys={selectedKeys}
            />
          </div>
        ) : (
          <>
          {showTab ? (
            <div className={styles['radio-tabs-wrap']}>
              <RadioGroup
                options={tabOptions}
                activeKey={tab}
                onChange={onTabChange}
              />
            </div>
          ): null}
            <div>
              <LazyTabPanle activeKey={tab} tab={TAB_TYPES.NORMAL}>
                <NormalMaterial
                  onCheck={onCheck}
                  selectedKeys={selectedKeys}
                  paneClassName={cls({
                    [styles['pane-content']]: true,
                    [styles['pane-content-with-tabs']]: showTab
                  })}
                  baseKey={TAB_TYPES.NORMAL}
                />
              </LazyTabPanle>
              <LazyTabPanle activeKey={tab} tab={TAB_TYPES.TRACK}>
                <TrackMaterial
                  onCheck={onCheck}
                  selectedKeys={selectedKeys}
                  baseKey={TAB_TYPES.TRACK}
                  paneClassName={cls({
                    [styles['pane-content']]: true,
                    [styles['pane-content-with-tabs']]: showTab
                  })}
                />
              </LazyTabPanle>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
