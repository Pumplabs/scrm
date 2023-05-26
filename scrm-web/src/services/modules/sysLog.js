import { post } from '../request'
import { handlePageParams, handleTable } from '../utils'
import { handleTimes } from 'src/utils/times'

export const GetSysLog = async (pager, formVals = {}) => {
  const { times, ...rest }  = formVals
  const [operBeginTime = '', operEndTime = ''] = handleTimes(times)
  const params = {
    operBeginTime,
    operEndTime,
    ...rest,
    ...handlePageParams(pager)
  }
  return post('/api/sysOperLog/pageList', params, {needJson: true}).then(res => handleTable(res))
}
export const ExportLog = () => {}