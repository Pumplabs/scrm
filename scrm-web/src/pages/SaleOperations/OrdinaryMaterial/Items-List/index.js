import { Pagination, Spin, Empty } from 'antd'
import styles from './index.module.less'
export default ({
  loading,
  pagination,
  onChange,
  dataSource = [],
  renderItem,
}) => {
  const onPagerChange = (pageNo, pageSize) => {
    if (typeof onChange === 'function') {
      onChange({
        current: pageNo,
        pageSize,
      })
    }
  }
  return (
    <div className={styles['item-list']}>
      <Spin spinning={loading}>
        <div className={styles['items-container-wrap']}>
          {dataSource.length === 0 ? (
            <div className={styles['empty-content']}>
              <Empty description={'暂无数据'} />
            </div>
          ) : null}
          <ul className={styles['items-container']}>
            {dataSource.map((ele) => (
              <li className={styles['item-col']} key={ele.id}>
                {typeof renderItem === 'function' ? renderItem(ele) : null}
              </li>
            ))}
          </ul>
        </div>
      </Spin>
      <div className={styles['item-list-pager']}>
        <Pagination
          {...pagination}
          showTotal={(total) => `共${total}条`}
          showSizeChanger={false}
          onChange={onPagerChange}
        />
      </div>
    </div>
  )
}
