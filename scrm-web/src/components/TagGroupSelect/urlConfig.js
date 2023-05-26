import {GetCustomerTagGroup } from 'services/modules/customerTag'
import { GetGroupChatTagGroupList } from 'services/modules/groupChatTag'
import { GetMaterialTagGroupList } from 'services/modules/materialTag'
export default {
  'customer': {
    list: GetCustomerTagGroup
  },
  'group': {
    list: GetGroupChatTagGroupList
  },
  'material': {
    list: GetMaterialTagGroupList,
    formatParams: (type, vals = {}) => {
      if (type === 'list') {
        return {
          title: vals.name
        }
      }
      return vals
    }
  }
}