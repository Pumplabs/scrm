import { useState, useMemo, useRef, useEffect } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { debounce } from 'lodash'
import { useRequest } from 'ahooks'
import CommonDrawer from 'components/CommonDrawer'
import TagGroupList from 'components/TagGroupList'
import { GetGroupChatTagGroupAllList } from 'services/modules/groupChatTag'
import styles from './index.module.less'

export default ({ visible, onCancel, onOk, data = {}, ...rest }) => {
  const hasReqestData = useRef(false)
  const {data: allTagGroupList = [], run: runGetGroupChatTagGroupAllList} = useRequest(GetGroupChatTagGroupAllList, {
    manual: true,
    onFinally: () => {
      hasReqestData.current = true
    }
  })
  const [searchText, setSearchText] = useState("")
  const [selectedTags, setSelectedTags] = useState([])

  useEffect(() => {
    if (visible && !hasReqestData.current) {
      runGetGroupChatTagGroupAllList()
    }
    if (visible) {
      setSelectedTags(data.selectedTags || [])
    } else {
      setSearchText('')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const selectedTagKeys = useMemo(() => {
    return selectedTags.map(ele => ele.id)
  }, [selectedTags])

  const onSelectTag = (item, flag) => {
    setSelectedTags(arr => flag ? [...arr, item] : arr.filter(ele => ele.id !== item.id))
  }

  const onSearch = (e) => {
    const text = e.target.value
    setSearchText(text)
  }

  const handleOk = () => {
    if (typeof onOk === 'function') {
      onOk(selectedTags, selectedTagKeys)
    }
  }
  const onSearchChange = debounce(onSearch, 200)

  const filterTagList = useMemo(() => {
    return searchText ? allTagGroupList.filter(ele => {
      const nameIsExist = ele.name.includes(searchText)
      if (nameIsExist) {
        return true
      }
      const tags = Array.isArray(ele.tags) ? ele.tags : []
      return tags.some(item => item.name.includes(searchText))
    }) : allTagGroupList
  }, [searchText, allTagGroupList])

  return (
    <CommonDrawer
      visible={visible}
      onCancel={onCancel}
      bodyStyle={{
        paddingRight: 0
      }}
      onOk={handleOk}
      okButtonProps={{
        disabled: selectedTagKeys.length === 0
      }}
      {...rest}
    >
      <div>
        <div className={styles.inputWrap}>
          <Input placeholder="输入关键词搜索标签和标签组"
            onKeyPress={onSearch}
            prefix={
              <SearchOutlined />
            }
            onChange={onSearchChange}
          />
        </div>
        <div className={styles.tagSelection}>
          {
            filterTagList.map(ele => {
              return (
                <TagGroupList
                  selectedKeys={selectedTagKeys}
                  data={ele}
                  key={ele.id}
                  onSelect={onSelectTag}
                />
              )
            })
          }
        </div>
      </div>
    </CommonDrawer>
  )
}