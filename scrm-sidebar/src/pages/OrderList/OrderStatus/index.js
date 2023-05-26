import { useMemo } from 'react'
import StatusItem from '../StatusItem'
import { STATUS_NAMES, STATUS_VALS } from '../constants'
export default ({ status, className }) => {
  const statusColor = useMemo(() => {
    switch (status) {
      // 审核中
      case STATUS_VALS.WAIT_CHECK:
        return 'yellow'
      // 已确认
      case STATUS_VALS.CONFIRM:
        return 'green'
      case STATUS_VALS.DONE:
        // 已完成
        return 'blue'
      case STATUS_VALS.REJECT:
        // 不通过
        return 'pink'
      default:
        break
    }
  }, [status])
  return (
    <StatusItem color={statusColor} className={className}>
      {STATUS_NAMES[status]}
    </StatusItem>
  )
}
