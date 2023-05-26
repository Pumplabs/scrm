import miniAppUrl from 'assets/images/mini-app-icon2.svg'
import styles from './item.module.less'
/**
 * 小程序消息
 * @param {string} appLogo 小程序logo
 * @param {string} appName 小程序名称
 * @param {string} name 小程序标题
 * @param {array} files 小程序封面
 * @returns 
 */
 const MsgAppItem = (props) => {
  const { pathName, thumbUrl, name, appLogo, appName } = props
  return (
    <div className={styles.miniAppItem}>
      {
        appLogo || appName ? (
          <div className={styles.miniAppHeader}>
            {
              appLogo ? (<img
                alt=""
                src={miniAppUrl}
                className={styles.appLogo}
              />) : null
            }
            <span>{appName}</span>
          </div>
        ) : null
      }
      <p
        className={styles.appTitle}
      >{name}</p>
      <div className={styles.miniAppContent}>
        <img
          src={thumbUrl}
          alt=""
          className={styles.miniAppCover}
        />
      </div>
      <div
        className={styles.appFooter}
      >
        <img
          alt=""
          src={miniAppUrl}
          className={styles.appIcon}
        />
        小程序
      </div>
    </div>
  )
}

export default MsgAppItem