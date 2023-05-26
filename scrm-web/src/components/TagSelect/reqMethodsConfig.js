import { AddCustomerTagGroup, AddCustomerTag, GetCustomerTagGroup } from 'services/modules/customerTag'
import { AddGroupChatTagGroup, GetGroupChatTagGroupList, AddGroupChatTag } from 'services/modules/groupChatTag'
import { GetMaterialTagGroupList, AddMaterialGroup, AddMaterialTag } from 'services/modules/materialTag'
export default {
  'customer': {
    list: GetCustomerTagGroup,
    addGroup: AddCustomerTagGroup,
    addTag: AddCustomerTag,
    formatParams: (type, vals = {}) => {
      if (type === 'addTag') {
        const {groupData, ...rest } = vals
        return {
          tagGroupId: groupData.id,
          ...rest
        }
      } else {
        return vals
      }
    }
  },
  'group': {
    list: GetGroupChatTagGroupList,
    addGroup: AddGroupChatTagGroup,
    addTag: AddGroupChatTag,
    formatParams: (type, vals = {}) => {
      if (type === 'addTag') {
        const {groupData,...rest } = vals
        return {
          groupChatTagGroupId: groupData.groupId,
          ...rest
        }
      } else {
        return vals
      }
    }
  },
  'material': {
    list: GetMaterialTagGroupList,
    addGroup: AddMaterialGroup,
    addTag: AddMaterialTag,
    formatParams: (type, vals = {}) => {
      if (type === 'addTag') {
        const {groupData,...rest } = vals
        return {
          groupId: groupData.groupId,
          ...rest
        }
      }
      return vals
    }
  }
}