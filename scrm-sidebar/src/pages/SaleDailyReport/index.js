import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { Toast } from 'antd-mobile'
import IndexPane from './components/IndexPane'
import { GetReportData } from 'services/modules/dailyReport'
import styles from './index.module.less'
import { get } from 'lodash'
export default () => {
  const toastRef = useRef(null)
  const { run: runGetReportData, data: reportData = {} } = useRequest(
    GetReportData,
    {
      manual: true,
      onBefore: () => {
        toastRef.current = Toast.show({
          icon: 'loading',
          duration: 0,
        })
      },
      onFinally: () => {
        if (toastRef.current) {
          toastRef.current.close()
        }
      },
    }
  )
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')
  useEffect(() => {
    if (id) {
      runGetReportData({
        id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  useEffect(() => {
    const dateStr = reportData.createdAt
      ? reportData.createdAt.substr(0, 'YYYY-MM-DD'.length)
      : ''
    document.title = `${dateStr} 销售日报`
  }, [reportData.createdAt])
  const list = Array.isArray(reportData.countData) ? reportData.countData : []
  return (
    <div className={styles['report-page']}>
      {list.map((ele, idx) => (
        <IndexPane
          className={styles['user-pane']}
          data={ele}
          key={`${get(ele, 'staff.id')}_${idx}`}
        />
      ))}
    </div>
  )
}
