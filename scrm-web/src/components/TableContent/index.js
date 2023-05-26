import styles from './index.module.less'
import Table from './components/Table'

export default (props) => {
  return (
    <div className={styles['table-container']}>
      <Table
        {...props}
      />
    </div>
  )
}
export { Table }
export { default as StatusCell } from './components/StatusCell'