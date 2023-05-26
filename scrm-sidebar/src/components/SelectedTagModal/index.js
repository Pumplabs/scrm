import { useState, useEffect } from 'react'
import Collapse from 'components/MyCollapse'
import InfiniteList from 'components/InfiniteList'
import SelectSection from './SelectSection'
import MyTag from 'components/MyTag'
import { useInfiniteHook } from 'src/hooks'
import { GetCustomerTags } from 'src/services/modules/customer'
import { GetGroupChatTagGroupList } from 'src/services/modules/group'
import { GetMaterialTagGroupList } from 'src/services/modules/materialTags'
import styles from './index.module.less'

const getRequestByType = (tagType) => {
  if (tagType === 'group') {
    return GetGroupChatTagGroupList
  } else if (tagType === 'materialCategoryTag') {
    return GetMaterialTagGroupList
  } else {
    return GetCustomerTags
  }
}

export const ContentWrap = ({ visible, onOk, tagType = 'customer', ...rest }) => {
  const [panelKeys, setPanelKeys] = useState([])
  const requestFn = getRequestByType(tagType)
  const { tableProps, run: runGetCustomerTags } = useInfiniteHook({
    request: requestFn,
    manual: true,
    defaultPageSize: 20,
    onFinally: (_, res = { list: [] }) => {
      setPanelKeys((arr) => [...arr, ...res.list.map((item) => item.id)])
    },
  })

  useEffect(() => {
    if (visible) {
      runGetCustomerTags({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])


  const onKeyChange = (keys) => {
    setPanelKeys(keys)
  }

  return (
    <Content
      tableProps={tableProps}
      panelKeys={panelKeys}
      onKeyChange={onKeyChange}
      {...rest}
    />
  )
}
const Content = (props) => {
  const {
    selectedTags = [],
    onRemoveTag,
    tableProps = {},
    onCheckTag,
    panelKeys,
    onKeyChange,
    ...rest
  } = props
  return (
    <InfiniteList
      {...tableProps}
      {...rest}
    >
      <div className={styles['content']}>
        <SelectSection title="已选择" classNam={styles['selected-section']}>
          {selectedTags.length
            ? selectedTags.map((tagItem) => (
                <MyTag
                  key={tagItem.id}
                  color="primary"
                  closable
                  className={styles['tag-ele']}
                  onClose={() => onRemoveTag(tagItem)}>
                  {tagItem.name}
                </MyTag>
              ))
            : '还没有选择标签哦~'}
        </SelectSection>
        <Collapse
          expandIconPosition="right"
          activeKey={panelKeys}
          onChange={onKeyChange}
          ghost={true}>
          {tableProps.dataSource.map((tagGroupItem) => (
            <Collapse.Panel
              title={
                <span className={styles['my-collapse-title']}>
                  {tagGroupItem.name}
                </span>
              }
              className={styles['panel-group']}
              key={tagGroupItem.id}>
              <div className={styles['panel-tags']}>
                {Array.isArray(tagGroupItem.tags) && tagGroupItem.tags.length
                  ? tagGroupItem.tags.map((tagItem) => {
                      const checked = selectedTags.some(
                        (item) => item.id === tagItem.id
                      )
                      return (
                        <MyTag
                          key={tagItem.id}
                          className={styles['tag-ele']}
                          color={checked ? 'primary' : ''}
                          onClick={() => onCheckTag(!checked, tagItem)}>
                          {tagItem.name}
                        </MyTag>
                      )
                    })
                  : '暂无标签'}
              </div>
            </Collapse.Panel>
          ))}
        </Collapse>
      </div>
    </InfiniteList>
  )
}
