import styles from './index.module.less'
export default ({ label, extra}) => {
  return (
    <>
      {label}
      {extra ? (
        <span className={styles['sub-text']}>
          {extra}
        </span>
      ): null}
    </>
  )
}
