import { useContext, useEffect, useMemo, useState } from 'react'
import { Radio } from 'antd-mobile'
import { toJS } from 'mobx'
import { observer, MobXProviderContext } from 'mobx-react'
import { useNavigate, useLocation } from 'react-router-dom'
import SelectedPage from 'components/SelectedPage'
import InfiniteList from 'components/InfiniteList'
import SearchBar from 'components/SearchBar'
import OpenEle from 'components/OpenEle'
import useInfiniteHook from 'src/hooks/useInfiniteHook'
import { useBack } from 'src/hooks'
import { decodeUrl } from 'src/utils/paths'
import { getUserByDepId } from 'src/services/modules/userManage'
import userIconUrl from 'assets/images/icon/user-icon.svg'
import styles from './index.module.less'

const Content = ({
  className,
  selectedList,
  disableKeys,
  onSelectedItem,
  uniqueKey,
  ...props
}) => {
  return (
    <div className={className}>
      <InfiniteList
        listItemClassName={styles['user-list-li']}
        {...props}
        renderItem={(item) => {
          const checked = selectedList.some(
            (ele) => ele[uniqueKey] === item[uniqueKey]
          )
          return (
            <CustomerItem
              key={item[uniqueKey]}
              data={item}
              onCheck={onSelectedItem}
              disabled={disableKeys.includes(item[uniqueKey])}
              checked={checked}
            />
          )
        }}></InfiniteList>
    </div>
  )
}

const CustomerItem = ({ data, onCheck, checked, disabled }) => {
  const handleCheck = () => {
    const status = !checked
    if (typeof onCheck === 'function') {
      onCheck(data, status)
    }
  }

  return (
    <div
      className={styles['staff-wrap-item']}
      onClick={disabled ? undefined : handleCheck}>
      <Radio
        checked={checked}
        className={styles['radio-ele']}
        disabled={disabled}
      />
      <StaffItem data={data} />
    </div>
  )
}

const StaffItem = ({ data }) => {
  const imgUrl = data.avatarUrl ? data.avatarUrl : userIconUrl
  return (
    <div className={styles['staff-item']}>
      <img src={imgUrl} alt="" className={styles['staff-item-icon']} />
      <span>
        <OpenEle type="userName" openid={data.name} />
      </span>
    </div>
  )
}

export default observer(() => {
  const uniqueKey = 'extId'
  const { ModifyStore, UserStore } = useContext(MobXProviderContext)
  const [searchText, setSearchText] = useState('')
  const navigate = useNavigate()
  const [selectedList, setSelectedList] = useState([])
  const { search: searchStr } = useLocation()
  const usrParams = useMemo(() => {
    return searchStr ? decodeUrl(searchStr.slice(1)) : {}
  }, [searchStr])
  const shouldIncludeMyself = UserStore.userData.isAdmin && (usrParams.mode === 'oppPartner' || usrParams.mode === 'oppOwner')
  const {
    tableProps,
    params: fetchParams,
    runAsync: runList,
  } = useInfiniteHook({
    request: getUserByDepId,
    rigidParams: {
      excludeMyself: shouldIncludeMyself ? false: true,
      status: 1,
    },
  })

  const { backPath, attrName, fnName, maxCount, disableKeyName, keyName } =
    useMemo(() => {
      const { backUrl = '', mode = 'follow' } = usrParams
      let backPath = ''
      let config = {
        fnName: 'updateFollowData',
        attrName: 'addFollowData',
        keyName: 'users',
        disableKeyName: '',
      }
      let maxCount = Number.MAX_SAFE_INTEGER
      switch (mode) {
        case 'followTask':
          config.attrName = 'followTask'
          config.fnName = 'updateFollowTask'
          maxCount = 1
          break
        case 'customerFollowmentionUser':
          config.attrName = 'customerFollow'
          config.fnName = 'updateCustomerFollow'
          break
        case 'oppOwner':
          // 商机负责人
          config.attrName = 'oppAddData'
          config.fnName = 'updateOppAddData'
          maxCount = 1
          config.disableKeyName = 'partners'
          break
        case 'oppPartner':
          // 商机协作人
          config.attrName = 'oppAddData'
          config.fnName = 'updateOppAddData'
          config.keyName = 'partners'
          config.disableKeyName = 'users'
          break
      case 'order':
        config.attrName = 'orderData'
        config.fnName = 'updateOrderData'
        maxCount = 1
        break;
      case 'follow':
         // 默认为跟进
         config.attrName = 'addFollowData'
         config.fnName = 'updateFollowData'
        break;
        default:
          // 默认为跟进
          config.attrName = 'addFollowData'
          config.fnName = 'updateFollowData'
          break
      }
      if (backUrl) {
        backPath = backUrl
      } else {
        const followId = ModifyStore[attrName].followId
        switch (mode) {
          case 'followTask':
            backPath = '/addCustomerTask'
            break
          case 'order':
            backPath = '/addOrder'
            break
          default:
            if (followId) {
              backPath = `/editFollow/${ModifyStore[attrName].followId}`
            } else {
              backPath = '/addFollow'
            }
            break
        }
      }
      return {
        backPath,
        ...config,
        maxCount,
      }
    }, [usrParams, ModifyStore])

  useEffect(() => {
    if (attrName) {
      const arr = toJS(ModifyStore[attrName])[keyName]
      setSelectedList(arr)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attrName, keyName])

  // 不可选用户
  const disableUsers = useMemo(() => {
    const arr =
      disableKeyName && attrName
        ? toJS(ModifyStore[attrName])[disableKeyName]
        : []
    return arr.map((ele) => ele[uniqueKey])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disableKeyName, attrName])

  const onBack = () => {
    navigate(backPath)
  }

  useBack({
    onBack,
  })

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
        ? maxCount > 1
          ? [...arr, item]
          : [item]
        : arr.filter((ele) => ele[uniqueKey] !== item[uniqueKey])
    )
  }

  const onSubmit = () => {
    onOk(selectedList)
  }

  const onOk = (arr) => {
    ModifyStore[fnName](keyName, arr)
    onBack()
  }

  return (
    <SelectedPage
      title="选择员工"
      backTitle="列表"
      onCancel={onBack}
      onOk={onSubmit}
      // okButtonProps={{
      // disabled: selectedList.length === 0,
      // }}
    >
      <div className={styles['search-section']}>
        <SearchBar
          value={searchText}
          onChange={onSearchTextChange}
          onSearch={onSearch}
          onClear={onClearSearch}
        />
      </div>
      <Content
        disableKeys={disableUsers}
        selectedList={selectedList}
        loadNext={runList}
        {...tableProps}
        searchParams={fetchParams}
        onSelectedItem={onSelectedItem}
        className={styles['selected-ul-wrap']}
        uniqueKey={uniqueKey}
      />
    </SelectedPage>
  )
})
