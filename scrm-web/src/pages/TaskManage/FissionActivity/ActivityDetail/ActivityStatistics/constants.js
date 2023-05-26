import { NUM_CN } from 'utils/constants'
import { MAX_LEVEL } from '../../constants'
// 流失状态
export const LOSE_STATUS_OPTIONS = [
  {
    value: false,
    label: '未流失'
  },
  {
    label: '已流失',
    value: true
  }
]
const createLevel = () => {
  let options = []
  for(let i = 1; i <= MAX_LEVEL; i++) {
    options = [
      ...options,
      {
        value: i,
        label: `${NUM_CN[i]}阶段`
      }
    ]
  }
  return options
}
export const LEVEL_OPTIONS = createLevel()