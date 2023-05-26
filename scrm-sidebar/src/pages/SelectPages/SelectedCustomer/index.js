import { useContext, useEffect, useMemo, useState } from 'react'
import { Radio } from 'antd-mobile'
import { toJS } from 'mobx'
import { get } from 'lodash'
import { observer, MobXProviderContext } from 'mobx-react'
import { useNavigate, useLocation } from 'react-router-dom'
import SelectedPage from 'components/SelectedPage'
import InfiniteList from 'components/InfiniteList'
import WeChatCell from 'components/WeChatCell'
import OpenEle from 'components/OpenEle'
import SearchBar from 'components/SearchBar'
import useInfiniteHook from 'src/hooks/useInfiniteHook'
import { useBack } from 'src/hooks'
import { decodeUrl } from 'src/utils/paths'
import { GetCustomerList } from 'src/services/modules/customer'
import styles from './index.module.less'

const getRecordKey = (record) => `${record.id}_${record.extCreatorId}`
const Content = ({
  selectedList,
  onSelectedItem,
  className,
  isAdmin,
  ...props
}) => {
  return (
    <div className={className}>
      <InfiniteList
        {...props}
        listItemClassName={styles['customer-list-item']}
        rowKey={(record) => getRecordKey(record)}
        renderItem={(item) => {
          const checked = selectedList.some(
            (ele) => getRecordKey(ele) === getRecordKey(item)
          )
          return (
            <CustomerItem
              data={item}
              onCheck={onSelectedItem}
              checked={checked}
              isAdmin={isAdmin}
            />
          )
        }}></InfiniteList>
    </div>
  )
}

const CustomerItem = ({ data, onCheck, checked, isAdmin }) => {
  const handleCheck = () => {
    const status = !checked
    if (typeof onCheck === 'function') {
      onCheck(data, status)
    }
  }

  return (
    <div className={styles['customer-item']} onClick={handleCheck}>
      <Radio
        checked={checked}
        className={styles['radio-ele']}
        style={{
          '--icon-size': '18px',
          '--font-size': '14px',
          // '--gap': '6px',
        }}
      />
      <WeChatCell
        data={data}
        extra={
          isAdmin ? (
            <p className={styles['follow-info']}>
              <span className={styles['follower']}>跟进人</span>
              <OpenEle
                type="userName"
                openid={get(data, 'extCreatorName')}
                className={styles['follow-staff']}
              />
            </p>
          ) : null
        }
      />
    </div>
  )
}

export const MODE_TYPES = {
  ADD_FOLLOW: 'addFollow',
  EDIT_FOLLOW: 'editFollow',
  ADD_OPP: 'addOpp'
}
export default observer(() => {
  const { ModifyStore, UserStore } = useContext(MobXProviderContext)
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()
  const { search: searchStr } = useLocation()
  const urlParams = searchStr ? decodeUrl(searchStr.slice(1)) : {}
  const [selectedList, setSelectedList] = useState([])
  const {
    tableProps,
    params: fetchParams,
    runAsync: runList,
  } = useInfiniteHook({
    request: GetCustomerList,
    rigidParams: {
      extCreatorId: urlParams.mode === MODE_TYPES.ADD_OPP && toJS(ModifyStore.oppAddData.users).length  ?  [toJS(ModifyStore.oppAddData.users)[0].extId]: [],
      isPermission: true,
    },
  })
  const { fnName, attrName, backUrl, keyName } = useMemo(() => {
    let data = {
      keyName: 'customers',
      fnName: 'updateFollowData',
    }
    switch (urlParams.mode) {
      // case MODE_TYPES.ADD_FOLLOW:
      //   break;
      case MODE_TYPES.EDIT_FOLLOW:
        data.attrName = 'addFollowData'
        data.backUrl = `/editFollow/${ModifyStore.addFollowData.followId}`
        break
      case MODE_TYPES.ADD_OPP:
        data.attrName = 'oppAddData'
        data.fnName = 'updateOppAddData'
        data.backUrl = urlParams.backUrl
        data.keyName = 'customer'
        break;
      default:
        data.attrName = 'addFollowData'
        data.backUrl = `/addFollow`
        break
    }
    return {
      mode: urlParams.mode,
      backUrl: urlParams.backUrl,
      fnName: '',
      ...data,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useBack({
    backUrl,
  })
  useEffect(() => {
    if (keyName && attrName) {
      const arr = toJS(ModifyStore[attrName])[keyName]
      setSelectedList(arr)
    }
  }, [attrName, keyName, ModifyStore])

  const onSearchTextChange = (e) => {
    setSearchText(e.target.value)
  }

  const onSearch = () => {
    runList(
      {},
      {
        name: searchText,
      }
    )
  }

  const onClearSearch = () => {
    runList(
      {},
      {
        name: '',
      }
    )
  }

  const onSelectedItem = (item, checked) => {
    setSelectedList((arr) =>
      checked
        ? [...arr, item]
        : arr.filter((ele) => getRecordKey(ele) !== getRecordKey(item))
    )
  }

  const onSubmit = () => {
    if (typeof onOk === 'function') {
      onOk(selectedList)
    }
  }

  const onOk = (arr) => {
    ModifyStore[fnName]({
      [keyName]: arr,
    })
    onCancel()
  }

  const onCancel = () => {
    navigate(backUrl)
  }

  return (
    <SelectedPage
      title="选择客户"
      backTitle="列表"
      onCancel={onCancel}
      onOk={onSubmit}
      okButtonProps={{
        disabled: selectedList.length === 0,
      }}>
      <div className={styles['search-section']}>
        <SearchBar
          value={searchText}
          onChange={onSearchTextChange}
          onSearch={onSearch}
          onClear={onClearSearch}
        />
      </div>
      <Content
        selectedList={selectedList}
        loadNext={runList}
        {...tableProps}
        searchParams={fetchParams}
        onSelectedItem={onSelectedItem}
        className={styles['selected-ul-wrap']}
        isAdmin={UserStore.userData.isAdmin}
      />
    </SelectedPage>
  )
})
