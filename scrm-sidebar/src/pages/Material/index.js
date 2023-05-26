import { useState, useMemo, useContext } from 'react'
import { Tabs } from 'antd-mobile'
import { MobXProviderContext, observer } from 'mobx-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { encode } from 'js-base64'
import { useGetCurrentExtId } from 'src/hooks/wxhook'
import LazyTabPanle from 'components/LazyTabPanle'
import { AddSendCount } from 'src/services/modules/material'
import TrackMaterial from './TrackMaterial'
import NormalMaterial from './NormalMaterial'
import SearchBar from 'components/SearchBar'
import ResultList from './ResultList'
import { createSysUrlsByType, encodeUrl } from 'src/utils'
import { MATERIAL_TYPE_EN_VALS } from './constants'
import styles from './index.module.less'

const tabOptions = [
  {
    label: '感知素材',
    value: 'trackMaterial',
  },
  {
    label: '普通素材',
    value: 'normalMaterial',
  },
]
export default observer(() => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const { UserStore } = useContext(MobXProviderContext)
  const [tab, setTab] = useState(() => 'trackMaterial')
  const [inputText, setInputText] = useState('')
  const curExtId = useGetCurrentExtId()
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

  const converMsg = (ele) => {
    const desc = ele.description || ele.summary || ele.content
    let content = {}
    // 如果是轨迹素材
    switch (ele.type) {
      case MATERIAL_TYPE_EN_VALS.POSTER:
      case MATERIAL_TYPE_EN_VALS.PICTUER:
        content = {
          msgtype: 'image',
          image: {
            mediaid: ele.mediaId,
          },
        }
        break
      case MATERIAL_TYPE_EN_VALS.TEXT:
        content = {
          msgtype: 'text',
          text: {
            content: ele.content, //文本内容
          },
        }
        break
      case MATERIAL_TYPE_EN_VALS.MINI_APP:
        content = {
          msgtype: 'miniprogram',
          miniprogram: {
            title: ele.appInfo.title,
            appid: ele.appInfo.appId,
            imgUrl: ele.filePath,
            page: ele.appInfo.appPath,
          },
        }
        break
      case MATERIAL_TYPE_EN_VALS.ARTICLE:
      case MATERIAL_TYPE_EN_VALS.VIDEO:
      case MATERIAL_TYPE_EN_VALS.LINK:
        content = {
          msgtype: 'news',
          news: {
            link: createSysUrlsByType({
              type: 'previewFile',
              data: {
                extCorpId: UserStore.userData.extCorpId,
                extId: UserStore.userData.extId,
                mediaId: ele.id,
              },
            }), //H5消息页面url 必填
            title: ele.title, //H5消息标题
            desc: desc, //H5消息摘要
            imgUrl: ele.filePath, //H5消息封面图片URL
          },
        }
        break
      case MATERIAL_TYPE_EN_VALS.FILE:
        content = {
          msgtype: 'file',
          file: {
            mediaid: ele.mediaId, //文件的素材id
          },
        }
        break
      default:
        break
    }
    content.enterChat = true
    return content
  }

  const sendMetial = (ele) => {
    const content = converMsg(ele)
    if (typeof window.wx.invoke === 'function') {
      window.wx.invoke('sendChatMessage', content, function (res) {
        if (res.err_msg === 'sendChatMessage:ok') {
          AddSendCount({
            sendCount: 1,
            extCustomerId: curExtId,
            type: 1,
            typeId: ele.id,
          })
        }
      })
    }
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
    <div className={styles['page']}>
      <div className={styles['search-bar']}>
        <SearchBar
          value={inputText}
          onChange={onTextChange}
          onSearch={onSearch}
        />
      </div>
      {hasSearch ? (
        <ResultList
          searchParams={searchInfo}
          sendMetial={sendMetial}
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
            <LazyTabPanle activeKey={tab} tab="trackMaterial">
              <TrackMaterial sendMetial={sendMetial} onDetail={onDetail} />
            </LazyTabPanle>
            <LazyTabPanle activeKey={tab} tab="normalMaterial">
              <NormalMaterial sendMetial={sendMetial} onDetail={onDetail} />
            </LazyTabPanle>
          </div>
        </div>
      )}
    </div>
  )
})
