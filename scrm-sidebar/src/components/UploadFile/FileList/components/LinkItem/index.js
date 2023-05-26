import cls from 'classnames'
import { LinkOutlined } from '@ant-design/icons'
import styles from './index.module.less'

const MaterialIcon = ({ className, src }) => {
  return (
    <div
      className={cls({
        [styles['material-cover']]: true,
        [styles['icon-cover']]: !src,
        [className]: className,
      })}>
      {src ? (
        <img src={src} alt="" className={styles['img-icon']} />
      ) : (
        <LinkOutlined className={styles['link-icon']} />
      )}
    </div>
  )
}

const LinkContent = ({ data = {} }) => {
  return (
    <div className={styles['link-content']}>
      <p className={styles['link-title']}>
        <span className={styles['link-title-text']}>{data.title}</span>
      </p>
      <div className={styles['link-description']}>{data.description}</div>
    </div>
  )
}
/**
 * 
 * @param {Object} data 数据 
 * @returns 
 */
const MaterialLinkItem = ({data = {}}) => {
  return (
    <div
      className={cls({
        [styles['material-item']]: true,
      })}>
      <MaterialIcon src={data.coverSrc}/>
      <LinkContent data={data} />
    </div>
  )
}
export default MaterialLinkItem