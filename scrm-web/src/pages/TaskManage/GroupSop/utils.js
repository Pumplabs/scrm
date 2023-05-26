import { TYPE_EN as FILTER_TYPE_EN } from './AddOrEditPage/components/GroupItem'

export const getGroupFilterType = (resData) => {
  let filterType = ''
  if (resData.hasAllGroup) {
    filterType = FILTER_TYPE_EN.ALL
  } else if (Array.isArray(resData.groupIds) && resData.groupIds.length) {
    filterType = FILTER_TYPE_EN.PART
  } else {
    filterType = FILTER_TYPE_EN.FILTER
  }
  return filterType
}