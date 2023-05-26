import { useState, useContext, useMemo } from 'react'
import { Tabs } from 'antd-mobile'
import { useRequest } from 'ahooks'
import { toJS } from 'mobx'
import { MobXProviderContext, observer } from 'mobx-react'
import ScriptList from './ScriptList'
import Collapse from 'components/MyCollapse'
import SearchBar from 'src/components/SearchBar'
import LazyTabPanle from 'components/LazyTabPanle'
import TagGroupItem from './TagGroupItem'
import { GetMaterialTagGroupList } from 'src/services/modules/materialTags'
import styles from './index.module.less'

const { Panel } = Collapse
export default observer(() => {
  const { UserStore } = useContext(MobXProviderContext)
  const [tab, setTab] = useState('companyTalkScript')
  const [inputText, setInputText] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [searchParams, setSearchParams] = useState({ text: '', time: 0 })
  const { data: materialGroupData = { list: [] } } = useRequest(
    GetMaterialTagGroupList
  )
  const onTabChange = (tabKey) => {
    setTab(tabKey)
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

  const onClearSearch = () => {
    setSearchParams({
      text: '',
      time: Date.now(),
    })
  }

  const onSelectedTag = (tagItem, checked) => {
    setSelectedTags((arr) =>
      checked ? arr.filter((ele) => ele !== tagItem.id) : [...arr, tagItem.id]
    )
  }

  // const hasSearch = inputText.length > 0
  const filterTags = useMemo(() => {
    return materialGroupData.list.filter(
      (ele) => Array.isArray(ele.tags) && ele.tags.length > 0
    )
  }, [materialGroupData])
  const talkScriptSearchParams = {
    ...searchParams,
    selectedTags,
  }
  return (
    <div className={styles['talk-script-page']}>
      <div className={styles['talk-script-header']}>
        <div className={styles['search-wrap']}>
          <SearchBar
            value={inputText}
            onChange={onTextChange}
            onSearch={onSearch}
            onClear={onClearSearch}
          />
        </div>
        <div className={styles['categroy-section']}>
          <div className={styles['category-tabs']}>
            <Tabs activeKey={tab} onChange={onTabChange}>
              {tabOptions.map((item) => (
                <Tabs.Tab title={item.label} key={item.value} />
              ))}
            </Tabs>
          </div>
        </div>
      </div>
      <div className={styles['no-search-content']}>
        <div className={styles['tag-section']}>
          <Collapse defaultActiveKey={[]}>
            <Panel
              key="1"
              title={<span className={styles['tag-panel-title']}>标签</span>}
              className={styles['tag-panel']}>
              <div className={styles['tag-panel-content']}>
                {filterTags.length > 0 ? (
                  <TagGroupItem
                    dataSource={filterTags}
                    onSelectedTag={onSelectedTag}
                    selectedTags={selectedTags}
                  />
                ) : (
                  '暂时没有标签哦'
                )}
              </div>
            </Panel>
          </Collapse>
        </div>
        <LazyTabPanle activeKey={tab} tab="companyTalkScript">
          <ScriptList
            userData={toJS(UserStore.userData)}
            searchParams={talkScriptSearchParams}
          />
        </LazyTabPanle>
        <LazyTabPanle activeKey={tab} tab="userTalkScript">
          <ScriptList
            hasPerson={true}
            userData={toJS(UserStore.userData)}
            searchParams={talkScriptSearchParams}
          />
        </LazyTabPanle>
      </div>
    </div>
  )
})

const tabOptions = [
  {
    label: '企业话术',
    value: 'companyTalkScript',
  },
  {
    label: '个人话术',
    value: 'userTalkScript',
  },
]
