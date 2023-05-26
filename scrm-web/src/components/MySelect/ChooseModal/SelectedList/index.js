import { Empty } from 'antd'
import cls from 'classnames'
import { CloseCircleOutlined } from '@ant-design/icons'
import styles from './index.module.less'

const SelectedList = ({
  valueKey,
  onRemoveAll,
  onRemove,
  dataSource,
  renderItem,
  disableArr = []
}) => {
  const handleRemove = (data) => {
    if (typeof onRemove === 'function') {
      onRemove(data)
    }
  }
  const isAllDisabled = () => {
    return dataSource.every(item => disableArr[item[valueKey]])
  }
  return (
    <div className={styles['selected-list']}>
      <div className={styles['selected-list-header']}>
        <span className={styles['selected-header-name']}>
          已选择
          <span className={styles['selected-count']}>{dataSource.length}</span>
          项
        </span>
        <span
          className={cls({
            [styles['selected-header-extra']]: true,
            [styles['diabled-action']]: dataSource.length === 0 || isAllDisabled,
          })}
          onClick={onRemoveAll}
        >
          清除
        </span>
      </div>
      <ul className={styles['selected-list-body']}>
        {dataSource.length ? (
          dataSource.map((ele) => {
            const isDisabled = disableArr.includes(ele[valueKey])
            if (typeof renderItem === 'function') {
              return (
                <li key={ele[valueKey]} className={styles['seleced-list-item']}>
                  {renderItem(ele)}
                  {isDisabled ? null : (
                    <span
                      className={styles['remove-action']}
                      onClick={() => handleRemove(ele)}>
                      <CloseCircleOutlined />
                    </span>
                  )}
                </li>
              )
            } else {
              return null
            }
          })
        ) : (
          <Empty description="暂无数据" />
        )}
      </ul>
    </div>
  )
}

export default SelectedList
