import { get, post } from '../request'
import { handleObj, handlePageParams, handleTable } from '../utils'


export const getOverviewStatics = async () => {
    return get('/api/reports/getTodayDataOverview').then(res => handleObj(res))
}
