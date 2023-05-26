import styles from './index.module.less'
export default () => {
  return (
    <div className={styles['page']}>
      <div className={styles['page-content']}>
        <div>抱歉，您所访问的界面不存在</div>
        <div>请联系以下客服人员</div>
      </div>
    </div>
  )
}
