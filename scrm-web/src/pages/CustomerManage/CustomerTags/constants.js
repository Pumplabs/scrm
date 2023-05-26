export const SCOPE_TYPE_VALS = {
  ALL_USER: 1,
  DEP: 2
}
export const SCOPE_TYPE_NAMES = {
  ALL_USER: '全部员工',
  DEP: '部门可用'
}
export const SCOPE_TYPE_OPTIONS = [
  {
    label: SCOPE_TYPE_NAMES.ALL_USER,
    value: SCOPE_TYPE_VALS.ALL_USER
  },
  {
    label: SCOPE_TYPE_NAMES.DEP,
    value: SCOPE_TYPE_VALS.DEP
  }
]
export const SORT_TYPE_VALS = {
  BEFORE: 1,
  AFTER: 2
}
export const SORT_TYPE_OPTIONS = [
  {
    label: '排最前面',
    value: SORT_TYPE_VALS.BEFORE
  },
  {
    label: '排最后面',
    value: SORT_TYPE_VALS.AFTER
  }
]