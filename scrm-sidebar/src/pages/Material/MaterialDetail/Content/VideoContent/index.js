import styles from './index.module.less'
export default ({ data = {} }) => {
  const url =
    window.location.origin +
    '/api/common/downloadByFileId?fileId=' +
    data.fileId
  return (
    <div className={styles['video-item']}>
      <p className={styles['video-title']}>{data.title}</p>
      <div className={styles['video-description']}>{data.description}</div>
      <video controls autoPlay src={url} className={styles['video-ele']} />
    </div>
  )
}
