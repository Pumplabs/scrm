import { forwardRef, Fragment } from 'react'
import cls from 'classnames'
import { MoreOutline } from 'antd-mobile-icons'
import styles from './index.module.less'

const MyTable = forwardRef(
  ({ columns = [], dataSource = [], rowDesc, footer, onAction }, ref) => {
    return (
      <div>
        <ul className={styles['detail-table']} ref={ref}>
        <li
          className={cls({
            [styles['detail-thead-tr']]: true,
            [styles['detail-tr']]: true,
          })}>
          {columns.map((ele) => (
            <span className={styles['detail-cell']} key={ele.dataIndex}>
              {ele.title}
            </span>
          ))}
          <span className={styles['tr-action']}></span>
        </li>
        {dataSource.length ? (
          dataSource.map((record) => (
            <Fragment key={record.id}>
              <li
                className={cls({
                  [styles['detail-tbody-tr']]: true,
                  [styles['detail-tr']]: true,
                })}>
                {columns.map((ele, idx) => (
                  <span className={styles['detail-cell']} key={ele.dataIndex}>
                    {typeof ele.render === 'function'
                      ? ele.render(ele, idx)
                      : record[ele.dataIndex]}
                  </span>
                ))}
                 <span className={styles['action-cell']}>
                  <MoreOutline className={styles['more-icon']}
                  onClick={() => {
                    if (typeof onAction === 'function') {
                      onAction(record)
                    }
                  }}/>
                 </span>
              </li>
              {typeof rowDesc === 'function' ? rowDesc(record) : null}
            </Fragment>
          ))
        ) : (
          <div className={styles['empty-content']}>暂无数据</div>
        )}
      </ul>
      {footer}
      </div>
    )
  }
)
export default MyTable
