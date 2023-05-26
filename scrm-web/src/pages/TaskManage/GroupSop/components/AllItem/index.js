import styles from './index.module.less'
const AllItem = ({ children }) => {
  return <span className={styles['all-item']}>{children}</span>
}
export default AllItem
