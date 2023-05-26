import { useMemo, useState } from 'react'
import { Tabs } from 'antd-mobile'
import cls from 'classnames'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { encode } from 'js-base64'
import LazyTabPanle from 'components/LazyTabPanle'
import SearchBar from 'components/SearchBar'
import { encodeUrl } from 'src/utils'
import TrackMaterial from '../../TrackMaterial'
import NormalMaterial from '../../NormalMaterial'
import ResultList from '../../ResultList'
import { MATERIAL_TYPE_EN_VALS } from '../../constants'
import styles from './index.module.less'

const TAB_VALS = {
  TRACK: 'trackMaterial',
  NORMAL: 'normalMaterial',
}
const tabOptions = [
  {
    label: '感知素材',
    value: TAB_VALS.TRACK,
  },
  {
    label: '普通素材',
    value: TAB_VALS.NORMAL,
  },
]
const getDefaultTab = (type) => {
  switch (type) {
    case `${MATERIAL_TYPE_EN_VALS.PICTUER}`:
    case `${MATERIAL_TYPE_EN_VALS.POSTER}`:
    case `${MATERIAL_TYPE_EN_VALS.TEXT}`:
    case `${MATERIAL_TYPE_EN_VALS.MINI_APP}`:
      return TAB_VALS.NORMAL
    default:
      return TAB_VALS.TRACK
  }
}
const Content = ({ className }) => {
  const [searchParams] = useSearchParams()
  const [inputText, setInputText] = useState('')
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const { defaultTab, defautlSubTab } = useMemo(() => {
    const urlTab = searchParams.get('tab')
    return {
      defaultTab: getDefaultTab(urlTab),
      defautlSubTab: urlTab
    }
  }, [searchParams])

  const [tab, setTab] = useState(() => {
    return defaultTab
  })

  const [searchInfo, setSearchInfo] = useState({ text: '', time: 0 })
  const currentPath = useMemo(() => {
    return `${pathname}${search}`
  }, [pathname, search])

  const onTabChange = (key) => {
    setTab(key)
  }
  const onTextChange = (e) => {
    setInputText(e.target.value)
  }

  const onSearch = () => {
    setSearchInfo({
      text: inputText,
      time: Date.now(),
    })
  }

  const onDetail = (item) => {
    switch (item.type) {
      case MATERIAL_TYPE_EN_VALS.LINK:
        window.open(item.link, '_blank')
        break
      case MATERIAL_TYPE_EN_VALS.FILE:
      case MATERIAL_TYPE_EN_VALS.ARTICLE:
      case MATERIAL_TYPE_EN_VALS.VIDEO:
      case MATERIAL_TYPE_EN_VALS.TEXT:
        navigate(
          `/materialInfo/${encode(item.id)}?${encodeUrl({
            backUrl: currentPath,
          })}`
        )
        break
      default:
        break
    }
  }

  const hasSearch = inputText.length > 0
  return (
    <div
      className={cls({
        [styles['content']]: true,
        [className]: className,
      })}>
      <div className={styles['search-bar']}>
        <SearchBar
          value={inputText}
          onChange={onTextChange}
          onSearch={onSearch}
          placeholder="关键字"
        />
      </div>
      {hasSearch ? (
        <ResultList searchParams={searchInfo}
        onDetail={onDetail}
        />
      ) : (
        <div>
          <div className={styles['type-tabs']}>
            <Tabs activeKey={tab} onChange={onTabChange}>
              {tabOptions.map((item) => (
                <Tabs.Tab title={item.label} key={item.value} />
              ))}
            </Tabs>
          </div>
          <div className={styles['tabs-content']}>
            <LazyTabPanle activeKey={tab} tab={TAB_VALS.TRACK}>
              <TrackMaterial
                defaultKey={
                  defaultTab === TAB_VALS.TRACK ? defautlSubTab : undefined
                }
                onDetail={onDetail}
              />
            </LazyTabPanle>
            <LazyTabPanle activeKey={tab} tab={TAB_VALS.NORMAL}>
              <NormalMaterial
                defaultKey={
                  defaultTab === TAB_VALS.NORMAL ? defautlSubTab : undefined
                }
                onDetail={onDetail}
              />
            </LazyTabPanle>
          </div>
        </div>
      )}
    </div>
  )
}
export default Content
