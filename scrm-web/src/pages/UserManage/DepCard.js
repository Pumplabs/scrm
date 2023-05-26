import { Empty, Spin } from 'antd'
import styles from './index.module.less'
import TreeContent from './TreeContent'

export default (props) => {
  const {
    selectedKeys,
    dataSource = [],
    isSelectedCompany,
    loading,
    onAsync,
    asyncLoading,
    ...rest
  } = props
  return (
    <div className={styles['dep-card']}>
      <div className={styles['dep-card-header']}>
        <h6 className={styles['dep-card-title']}>部门信息
        </h6>
      </div>
      <div className={styles['dep-card-body']}>
        <Spin spinning={loading}>
          {dataSource.length > 0 ? (
            <TreeContent
              treeData={dataSource}
              selectedKeys={selectedKeys}
               {...rest}
            />
          ) : <Empty />}
        </Spin>
      </div>
    </div>
  )
}
