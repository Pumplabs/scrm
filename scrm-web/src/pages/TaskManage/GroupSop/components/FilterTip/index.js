import { Fragment } from 'react'
import { isEmpty } from 'lodash'
import { InfoCircleOutlined } from '@ant-design/icons'
import OpenEle from 'components/OpenEle'
import styles from './index.module.less'

export const convertArrayToEllipsisStr = (data, name) => {
  const maxCount = 2
  if (isEmpty(data)) {
    return ''
  } else {
    const len = data.length
    const str = data
      .slice(0, maxCount)
      .map((ele) => `"${ele.name}"`)
      .join('、')
    const suffixStr = len > maxCount ? `等${len}个${name}` : ''
    return `${str}${suffixStr}`
  }
}

/**
 * 用户缩略展示组件
 * @param {Array} dataSource 用户源数据
 * @param {String} suffix 后缀
 * @returns 
 */
export const UsersEllipsisItem = ({ dataSource = [], suffix }) => {
  if (!Array.isArray(dataSource)) {
    return null
  }
  const prefixLen = 2
  const suffixStr =
    dataSource.length > 0 ? `等${dataSource.length}个${suffix}` : ''
  return (
    <>
      {dataSource.slice(0, prefixLen).map((item) => {
        const type = item.isDep ? 'departmentName' : 'userName'
        return (
          <span key={item.key}>
            "<OpenEle type={type} openid={item.name} />"
          </span>
        )
      })}
      {suffixStr}
    </>
  )
}

/**
 * @param {Array} filterOptions 筛选数据
 * @param {String} name 名称
 * @param {Number} count 数量
 * @param {Function} onGetCount 点击查看
 */
export default ({ filterOptions = [], name = '', count, onGetCount }) => {
  if (filterOptions.length === 0) {
    return null
  }
  return (
    <div className={styles['filter-tip']}>
      <InfoCircleOutlined className={styles['info-icon']} />
      满足
      {filterOptions.map((item, idx) => (
        <Fragment key={item.label}>
          {idx > 0 ? ' 且 ' : ''}
          <span>{item.label}</span>为
          {item.type === 'users' ? (
            <UsersEllipsisItem dataSource={item.value} suffix={item.label} />
          ) : (
            <span>{item.value}</span>
          )}
        </Fragment>
      ))}
      的{name}
      <div className={styles['filter-res']}>
        {count >=0  ? (
          <span className={styles['filter-res-count']}>{name}{count}个</span>
        ) : (
          <span className={styles['look-action']} onClick={onGetCount}>
            查看{name}
          </span>
        )}
      </div>
    </div>
  )
}
