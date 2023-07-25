import { GetGroupList } from "services/modules/customerChatGroup";
import { getDepTreeAndUser } from "services/modules/userManage";
import {
  GetCustomerList,
  GetCustomerDropdownList,
} from "services/modules/customerManage";
import { GetAdminList } from "services/modules/adminList";

import { TYPES } from "./constants";
export default {
  [TYPES.USER]: {
    request: getDepTreeAndUser,
    isTableRequest: false,
  },
  [TYPES.CUSTOMER]: {
    request: GetCustomerDropdownList,
  },
  [TYPES.GROUP]: {
    request: GetGroupList,
  },
  [TYPES.ALL_CUSTOMER]: {
    request: GetCustomerList,
  },
  [TYPES.STAFF_CUSTOMER]: {
    request: GetCustomerList,
  },
  [TYPES.ADMIN_STAFF]: {
    request: GetAdminList,
    isTableRequest: false,
    defaultParams: {
      roleKey: 'enterpriseAdmin',
    }
  },
};
