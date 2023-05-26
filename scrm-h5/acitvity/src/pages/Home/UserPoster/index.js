import cls from 'classnames'
import styles from './index.module.less'

export default ({ imgUrl, imgCls, className, ...rest }) => {
  return (
    <div
      className={cls({
        [className]: true,
        [styles['poster-container']]: true,
      })}
      {...rest}>
      {imgUrl ? (
        <>
          <img
            alt=""
            src={imgUrl}
            style={{
              width: '100%',
            }}
            className={imgCls}
          />
          <span className={styles['touch-tip']}>按住图片转发</span>
        </>
      ) : null}
    </div>
  )
}
