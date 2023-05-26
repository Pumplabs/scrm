import { Tooltip } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import {
  SEND_STATUS_CN,
  SEND_STATUS,
} from 'pages/TaskManage/GroupSop/components/RuleInfoItem/constants'
import styles from './index.module.less'

export default ({ value }) => {
  const isSuccess = SEND_STATUS.SEND === value
  const tip =
    isSuccess || SEND_STATUS.UN_SEND === value ? '' : SEND_STATUS_CN[value]
  const name = isSuccess ? SEND_STATUS_CN[value] : '未发送'
  return (
    <span>
      {tip ? (
        <Tooltip title={tip} placement="topLeft">
          <ExclamationCircleFilled className={styles['exclamation-icon']} />
        </Tooltip>
      ) : null}
      {name}
    </span>
  )
}
