import cls from 'classnames'
import styles from './index.module.less'
import userIconUrl from 'assets/images/icon/user-icon.svg'

/**
 * @param {object} data
 * * @param {string} name
 * * @param {string} source
 * * @param {string} avatarUrl
 */
export default ({
  data: customer,
  size = 'small',
  className,
  extra,
  ...rest
}) => {
  if (!customer) {
    return null
  }
  const data = customer ? customer : {}
  return (
    <WeChatCellEle
      size={size}
      className={className}
      avatarUrl={data.avatarUrl || data.avatar || userIconUrl}
      userName={data.name}
      corpName={data.source || data.corpName}
      extra={extra}
    />
  )
}

const WeChatCellEle = (props) => {
  const {
    size = 'small',
    className,
    avatarUrl = userIconUrl,
    userName,
    corpName = '',
    extra,
    ...rest
  } = props
  return (
    <div
      className={cls({
        [styles['wechat-cell']]: true,
        [styles[`wechat-cell-${size}`]]: size,
        [className]: className,
      })}
      {...rest}>
      <img src={avatarUrl} alt="" className={styles['wechat-cell-img']} />
      <div
        className={cls({
          [styles['wechat-content']]: true,
        })}>
        <span
          className={cls({
            [styles['wechat-text']]: true,
            [styles['company-source']]: corpName,
            [styles['wechat-source']]: !corpName,
          })}>
          <span
            className={cls({
              [styles['wechat-name']]: true,
              'wechat-name': true,
            })}>
            {userName}
            @
          </span>
          {corpName || '微信'}
        </span>
        {extra ? extra : null}
      </div>
    </div>
  )
}

export const getCustomerName = (data) => {
  return data ? `${data.name}@${data.corpName ? data.corpName : '微信'}` : ''
}
export { WeChatCellEle }
