import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { useGetEntry } from 'src/hooks/wxhook'
import { GetCustomerInfo } from 'src/services/modules/customer'

export default ({ staffId }) => {
  const [searchParams] = useSearchParams()
  const { pageEntry } = useGetEntry()
  const customerId = searchParams.get('extCustomerId')
  const {data: customerInfo = {}, loading: customerLoading, run: runGetCustomerInfo, refresh} = useRequest(GetCustomerInfo, {
    manual: true,
  })

  const getCurCustomerInfo = async (extId) => {
    runGetCustomerInfo({
      extId,
      id: '',
      staffId
    })
  }

  const checkEnter = () => {
    if (pageEntry === 'single_chat_tools') {
      getUserInfoByChat()
    } else if (customerId) {
      getCurCustomerInfo(customerId)
    }
  }

  const getUserInfoByChat = () => {
    window.wx.invoke('getCurExternalContact', {}, function (res) {
      if (res.err_msg === 'getCurExternalContact:ok') {
        //返回当前外部联系人userId
        getCurCustomerInfo(res.userId)
      }
    })
  }

  useEffect(() => {
    if (staffId && !customerInfo.id) {
      checkEnter()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffId, pageEntry])

  return {
    refresh,
    customerInfo,
    loading: customerLoading
  }
}