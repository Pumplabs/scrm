export const ADVANCE_FILTER = {
  IN: 1,
  AND: 2,
  NONE: 3
}
export const ADVANCE_FILTER_NAMES = {
  IN: '标签满足其中之一',
  AND: '标签同时满足',
  NONE: '无任何标签'
}
export const ADVANCE_FILTER_OPTIONS = [
  {
    label:ADVANCE_FILTER_NAMES.IN,
    value: ADVANCE_FILTER.IN
  },
  {
    label: ADVANCE_FILTER_NAMES.AND,
    value: ADVANCE_FILTER.AND
  },
  // {
  //   label: ADVANCE_FILTER_NAMES.NONE,
  //   value: ADVANCE_FILTER.NONE
  // }
]