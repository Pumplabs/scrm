import cls from 'classnames'
import styles from '../index.module.less'

const ImgCell = ({ style, data = {} }) => {
  const src = data.file && data.file[0] ? data.file[0].thumbUrl : ''
  return (
    <div
      className={cls({
        [styles['imgCell']]: true,
        [styles['content-cell']]: true,
      })}
      style={style}>
      <img alt="" src={src} className={styles['imgCell-img']} />
    </div>
  )
}
export default ImgCell