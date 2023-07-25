import cls from 'classnames'
import styles from './index.module.less'
import defaultAvatorUrl from 'assets/images/defaultAvator.jpg'

/**
 * @param {object} data
 * * @param {string} name
 * * @param {string} corpName 企业名称
 * * @param {string} avatarUrl
 */
export default ({ data: customer, size = 'small', showCorpName, extra }) => {
  if (!customer) {
    return null
  }
  const data = customer ? customer : {}
  return (
    <WeChatEle
      size={size}
      corpName={data.corpName}
      avatarUrl={data.avatarUrl || data.avatar || ''}
      userName={data.name}
      showCorpName={showCorpName}
      extra={extra}
    />
  )
}

/**
 * 
 * @param {String} userName 用户名
 * @param {String} corpName 企业名称
 * @param {String} size 尺寸
 * @param {String} avatarUrl 头像地址
 * @param {Boolean} showCorpName 展示企业信息
 * @param {String|ReactNode} 额外信息
 * @returns 
 */
const WeChatEle = (props) => {
  const { extra, userName, corpName, size = 'small', avatarUrl, showCorpName = true } = props
  return (
    <div
      className={cls({
        'wechat-cell': true,
        [styles['wechat-cell']]: true,
        [styles[`wechat-cell-${size}`]]: size,
        [styles['has-extra']]: extra
      })}>
      <img
        src={avatarUrl ? avatarUrl : defaultAvatorUrl}
        alt=""
        className={cls({
          'wechat-cell-img': true,
          [styles['wechat-cell-img']]: true,
        })}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
        }}
      />
      <span
        className={cls({
          [styles['wechat-text']]: true,
          [styles['company-source']]: corpName,
          [styles['wechat-source']]: !corpName,
        })}>
        <span
          className={cls({
            [styles['wechat-name']]: true,
          })}
          style={{ marginRight: 4 }}>
          {userName}
        </span>
        {showCorpName ? (
          <>@{corpName || '微信'}</>
        ): null}
        {extra ? <p className={styles['extra']}>{extra}</p> : null}
      </span>
    </div>
  )
}

export { WeChatEle }