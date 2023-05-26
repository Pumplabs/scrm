import cls from 'classnames'
import styles from '../index.module.less'

const AppCell = ({ data = {}, style = {} }) => {
  const src = data.file && data.file[0] ? data.file[0].thumbUrl : ''
  return (
    <div
      style={style}
      className={cls({
        [styles['app-cell']]: true,
        [styles['content-cell']]: true,
      })}>
      <span>{data.name}</span>
      <div>
        <img alt="" src={src} className={styles['app-cover']} />
      </div>
    </div>
  )
}
export default AppCell