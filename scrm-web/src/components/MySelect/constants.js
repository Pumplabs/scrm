
export const TYPES = {
  GROUP: 'group',
  USER: 'user',
  CUSTOMER: 'customer',
  ALL_CUSTOMER: 'allCustomer',
  STAFF_CUSTOMER: 'staffCustomer',
  // 管理員
  ADMIN_STAFF: 'administorStaff'
}

export const DEFAULT_VALUE_KEY = {
  [TYPES.GROUP]: 'id',
  [TYPES.USER]: 'id',
  [TYPES.CUSTOMER]: 'extId',
  [TYPES.ALL_CUSTOMER]: 'key',
  [TYPES.STAFF_CUSTOMER]: 'extId',
  [TYPES.ADMIN_STAFF]: 'id'
}
