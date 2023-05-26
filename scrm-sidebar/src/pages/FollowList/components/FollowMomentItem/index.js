import cls from 'classnames'
import FollowAction from '../FollowAction'
import styles from './index.module.less'

/**
 * 根据动态项，包含顶部，内容块，底部
 * @param {Object} contentProps 内容属性
 */
export default (props) => {
  const {
    data,
    header,
    className,
    onReply,
    onRemove,
    onEdit,
    onDetail,
    children,
  } = props
  const handleDetail = () => {
    if (typeof onDetail === 'function') {
      onDetail(data)
    }
  }
  return (
    <div
      className={cls({
        [styles['moment-item']]: true,
        [className]: className,
      })}
      onClick={handleDetail}>
      {header}
      {children}
      <FollowAction
        data={data}
        onReply={onReply}
        onRemove={onRemove}
        onEdit={onEdit}
      />
    </div>
  )
}
