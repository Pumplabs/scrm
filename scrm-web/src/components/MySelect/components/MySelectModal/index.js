import { useMemo } from 'react'
import { isEmpty } from 'lodash'
import GroupModal from './GroupModal'
import UserModal from './UserModal'
import CustomerModal from './CustomerModal'
import AllCustomerModal from './AllCustomerModal'
import StaffCustomerModal from './StaffCustomerModal'
import AdministratorModal from './AdministratorModal'
import requestConfig from '../../requestUrls'
import { DEFAULT_VALUE_KEY, TYPES } from '../../constants'

export default ({ type = 'user', request, ...props }) => {
  const { requestFn } = useMemo(() => {
    if (typeof request === 'function') {
      return {
        requestFn: request,
      }
    }
    const dataType = Reflect.has(requestConfig, type) ? type : 'user'
    const configItem = requestConfig[dataType]
    return {
      requestFn: configItem.request,
    }
  }, [type, request])

  const valueKey = DEFAULT_VALUE_KEY[type]
  const modalProps = {
    request: requestFn,
    valueKey,
    ...props,
  }
  if (type === TYPES.GROUP) {
    return <GroupModal {...modalProps} />
  }
  if (type === TYPES.USER) {
    return <UserModal {...modalProps} />
  }
  if (type === TYPES.CUSTOMER) {
    return <CustomerModal {...modalProps} />
  }
  if (type === TYPES.ALL_CUSTOMER) {
    return <AllCustomerModal {...modalProps} />
  }
  if (type === TYPES.STAFF_CUSTOMER) {
    return <StaffCustomerModal {...modalProps} />
  }
  if (type === TYPES.ADMIN_STAFF) {
    return <AdministratorModal {...modalProps} />
  }
}
