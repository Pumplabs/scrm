// 根据员工id获取对应的标签
export const getTagsByStaffId = (record = {}) => {
  const staffList = Array.isArray(record.followStaffList) ? record.followStaffList : []
  const creatorStaff = record.creatorStaff ? record.creatorStaff : {}
  const staffItem = staffList.find(staffItem => {
    return staffItem ? staffItem.extId === creatorStaff.extId : false
  })
  return staffItem && Array.isArray(staffItem.tags) ? staffItem.tags : []
}