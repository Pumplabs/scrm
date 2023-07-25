import { get, post } from '../request'
import { handleObj, handlePageParams, handleTable } from '../utils'


export const getStaffCurrentMonthSalesTarget = async () => {
    return get('/api/brSaleTarget/getStaffCurrentMonthSalesTarget').then(res => handleObj(res))
}
