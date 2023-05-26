import { Tag } from 'antd'
import ExpandCell from 'components/ExpandCell'
import styles from './index.module.less'
export default ({ dataSource = [], empty = '-', renderName,  ...rest }) => {
  const tagList = Array.isArray(dataSource) ? dataSource : []
  if (tagList.length === 0) {
    return empty
  }
  return (
    <ExpandCell
      dataSource={tagList}
      renderItem={(ele) => (
        <Tag className={styles['tag-ele']} key={ele.id}>
          {typeof renderName === 'function' ? renderName(ele) : ele.name}
        </Tag>
      )}
      {...rest}></ExpandCell>
  )
}
