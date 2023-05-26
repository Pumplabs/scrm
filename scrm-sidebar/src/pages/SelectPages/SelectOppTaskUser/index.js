import { useContext, useEffect, useMemo, useState } from 'react'
import { Radio } from 'antd-mobile'
import { toJS } from 'mobx'
import { observer, MobXProviderContext } from 'mobx-react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { decode } from 'js-base64'
import { useRequest } from 'ahooks'
import SelectedPage from 'components/SelectedPage'
import OpenEle from 'components/OpenEle'
import { useBack } from 'src/hooks'
import { decodeUrl } from 'src/utils/paths'
import { GetOppDetail } from 'services/modules/opportunity'
import userIconUrl from 'assets/images/icon/user-icon.svg'
import styles from './index.module.less'

const Content = ({
  className,
  selectedList = [],
  onSelectedItem,
  uniqueKey,
  dataSource,
}) => {
  return (
    <div className={className}>
      <div className={styles['user-list-content']}>
      {dataSource.map((item) => {
        const checked = selectedList.some(
          (ele) => ele[uniqueKey] === item[uniqueKey]
        )
        return (
          <div className={styles['user-list-li']} key={item[uniqueKey]}>
            <StaffCheckItem
              data={item}
              onCheck={onSelectedItem}
              checked={checked}
            />
          </div>
        )
      })}
      </div>
    </div>
  )
}

const StaffCheckItem = ({ data, onCheck, checked }) => {
  const handleCheck = () => {
    const status = !checked
    if (typeof onCheck === 'function') {
      onCheck(data, status)
    }
  }

  return (
    <div className={styles['staff-wrap-item']} onClick={handleCheck}>
      <Radio checked={checked} className={styles['radio-ele']} />
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
  const { ModifyStore } = useContext(MobXProviderContext)
  const navigate = useNavigate()
  const { search: searchStr } = useLocation()
  const { oppId: oppSearchId } = useParams()
  const [selectedList, setSelectedList] = useState([])
  const { run: runGetOppDetail, data: oppData = {} } = useRequest(
    GetOppDetail,
    {
      manual: true,
      onSuccess: (res) => {
        if (res.name) {
          document.title = `跟进-${res.name}`
        }
      },
    }
  )
  const mentionUsers = useMemo(() => {
    return Array.isArray(oppData.cooperatorList) ? oppData.cooperatorList.map(ele => ele.cooperatorStaff ? ele.cooperatorStaff: ({
      extId: ele.cooperatorId,
      name: ele.cooperatorId,
    })) : []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oppData.cooperatorList])

  const urlParams = useMemo(() => {
    return searchStr ? decodeUrl(searchStr.slice(1)) : {}
  }, [searchStr])

  const oppId = useMemo(() => {
    return decode(oppSearchId)
  }, [oppSearchId])

  useEffect(() => {
    if (oppId) {
      runGetOppDetail({
        id: oppId,
      })
    }
  }, [oppId])

  const uniqueKey = 'extId'

  const { backPath, mapName, fnName, maxCount } = useMemo(() => {
    const { backUrl = '', mode = 'oppFollow' } = urlParams
    let backPath = ''
    let config = {
      fnName: 'updateFollowTask',
      mapName: 'followTask',
    }
    let maxCount = Number.MAX_SAFE_INTEGER
    switch (mode) {
      case 'oppFollow':
        config.mapName = 'followTask'
        config.fnName = 'updateFollowTask'
        maxCount = 1
        break
      default:
        break
    }
    if (backUrl) {
      backPath = backUrl
    } else {
      switch (mode) {
        case 'oppFollow':
          backPath = `/addOppFollowTask/${oppSearchId}`
          break
        default:
          break
      }
    }
    return {
      backPath,
      ...config,
      maxCount,
    }
  }, [urlParams])

  useEffect(() => {
    if (mapName) {
      const arr = toJS(ModifyStore[mapName]).users
      setSelectedList(arr)
    }
  }, [mapName])

  const onBack = () => {
    navigate(backPath)
  }

  useBack({
    onBack,
  })

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
    if (typeof onOk === 'function') {
      onOk(selectedList)
    }
  }
  const onOk = (arr) => {
    ModifyStore[fnName]('users', arr)
    onBack()
  }

  return (
    <SelectedPage
      title="选择负责人"
      backTitle="列表"
      onCancel={onBack}
      onOk={onSubmit}
      // okButtonProps={{
      // disabled: selectedList.length === 0,
      // }}
    >
      <Content
        selectedList={selectedList}
        dataSource={mentionUsers}
        onSelectedItem={onSelectedItem}
        className={styles['selected-ul-wrap']}
        uniqueKey={uniqueKey}
      />
    </SelectedPage>
  )
})
