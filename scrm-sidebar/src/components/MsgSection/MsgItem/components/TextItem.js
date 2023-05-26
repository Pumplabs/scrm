import styles from '../index.module.less'

const TextCell = ({ style, text }) => {
  return (
    <div style={style} className={styles['content-cell']}>
      {text}
    </div>
  )
}
export default TextCell