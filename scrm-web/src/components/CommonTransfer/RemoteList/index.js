import { useRef, useMemo, useEffect } from 'react'
import { useAntdTable } from 'ahooks'
import InfiniteScrollList from '../InfiniteScrollList'
import OpenEle from 'components/OpenEle'
import defaultAvatorUrl from 'assets/images/defaultAvator.jpg'
import requestConfig from './requestConfig'

const typeList = ['user', 'customer']

const getType = (type = 'user') => {
  const item = typeList.find(ele => ele === type)
  return item ? item : 'user'
}

/**
 * @param {String}  remoteType 请求的类型 user, customer 
 */
export default (props = {}) => {
  const { remoteType, ...rest } = props
  const curType = useMemo(() => {
    return getType(remoteType)
  }, [remoteType])
  const reqConfig = requestConfig[curType]
  const preList = useRef([])
  const { tableProps, run: runGetData, mutate } = useAntdTable(reqConfig.request, {
    manual: true,
    defaultPageSize: 10,
    onBefore: () => {
      preList.current = tableProps.dataSource
    },
    onFinally: ([{ current }], resData) => {
      if (current > 1) {
        mutate({
          total: resData.total,
          list: [...preList.current, ...resData.list]
        })
      }
    }
  })

  useEffect(() => {
    runGetData(...formatParams())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const formatParams = (...args) => {
    const params = typeof reqConfig.format === 'function' ? reqConfig.format(...args) || args : args
    return params
  }

  const requestData = (...args) => {
    runGetData(...formatParams(...args))
  }

  return (
    <InfiniteScrollList
      placeholder="请选择"
      request={requestData}
      {...tableProps}
      renderTooltipTitle={(_, ele) => {
        if (curType === 'user') {
          return (
            <OpenEle type="userName" openid={ele.name} />
          )
        } else {
          return ele.name
        }
      }}
      renderLabel={(_, ele) => {
        if (curType === 'user') {
          return (
            <ItemLabel
              ele={ele}
            />
          )
        }
      }}
      {...rest}
    />
  )
}

const ItemLabel = ({ ele }) => {
  return (
    <>
      <span>
        <img
          width={18}
          height={18}
          alt=""
          style={{ marginRight: 2, marginTop: "-2px", borderRadius: 2 }}
          src={ele.avatarUrl ? ele.avatarUrl : defaultAvatorUrl}
        />
        <OpenEle type="userName" openid={ele.name} />
      </span>
    </>
  )
}