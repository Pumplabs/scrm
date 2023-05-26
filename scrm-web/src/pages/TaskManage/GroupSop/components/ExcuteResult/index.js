import { useMemo } from 'react'
import cls from 'classnames'
import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons'
import styles from './index.module.less'
/**
 *
 * @param {Object} data 结果数据
 * @param {String} name 名称
 * @param {String} doneStr 完成项文字
 * @param {String} undoneStr 未完成项文字
 * @returns
 */
const ExcuteResult = ({
  onClick,
  data = {},
  name = '群聊',
  doneStr,
  undoneStr,
}) => {
  const { successCount = 0, failCount = 0 } = data
  const icon = useMemo(() => {
    if (successCount > 0 && failCount === 0) {
      return (
        <CheckCircleFilled
          className={cls({
            [styles['success-icon']]: true,
            [styles['result-icon']]: true,
          })}
        />
      )
    }
    return (
      <ExclamationCircleFilled
        className={cls({
          [styles['result-icon']]: true,
          [styles['warning-icon']]: true,
        })}
      />
    )
  }, [successCount, failCount])
  return (
    <div className={styles['rule-result']}>
      {icon}
      <span className={styles['result-count']}>{successCount}</span>个
      {typeof doneStr === 'undefined' ? `${name}完成推送` : doneStr}
      <span className={styles['separator-code']}>,</span>
      <span className={styles['result-count']}>{failCount}</span>个
      {typeof undoneStr === 'undefined' ? `${name}未完成` : undoneStr}
      {typeof onClick === 'function' ? (
        <span className={styles['detail-action']} onClick={onClick}>
          查看详情
        </span>
      ) : null}
    </div>
  )
}
export default ExcuteResult
