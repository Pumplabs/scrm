import emojiUrl from 'src/assets/image/fail-emoji.png'
import styles from './index.module.less'

export default () => {
  return (
    <div className={styles['page']}>
      <div className={styles['tip-wrap']}>
        <img src={emojiUrl} alt="" className={styles['emoji-icon']} />
        <div>
          <p>你来早了哦，</p>
          <p>活动尚未开始</p>
        </div>
      </div>
    </div>
  )
}
