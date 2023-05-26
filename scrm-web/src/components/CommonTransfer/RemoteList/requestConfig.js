import { getUserByDepId } from 'services/modules/userManage'
import { GetCustomerDropdownList } from 'services/modules/customerManage'
import { USER_STATUS_EN_VAL } from 'pages/UserManage/constants'
export default {
  user: {
    request: getUserByDepId,
    format: (pager = {}, {keyword} = {}) => {
      return [pager, {name: keyword, status: USER_STATUS_EN_VAL.ACTIVE}]
    }
  },
  customer: {
    request: GetCustomerDropdownList,
    format: (pager = {}, {keyword} = {}) => {
      return [pager, {name: keyword}]
    }
  }
}