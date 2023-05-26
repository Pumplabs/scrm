import { useState } from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { TagItem, TagItemContent } from 'components/MySelect'
import CustomerModal from './CustomerModal'
import styles from './index.module.less'
const categoryNames = {
  customer: '客户',
  group: '群聊',
}
/**
 * @param {String} type 类型
 */
export default ({ tags, onCloseTag, onAddTags, type = 'customer' }) => {
  const [visible, setVisible] = useState(false)
  const max = 3
  const arr = tags.slice(0, max)
  const isOver = tags.length > max
  const onDetail = () => {
    setVisible(true)
  }
  const onCancel = () => {
    setVisible(false)
  }
  
  return (
    <>
      <CustomerModal
        title={`执行${categoryNames[type]}列表`}
        visible={visible}
        data={tags}
        type={type}
        onCancel={onCancel}
        footer={null}
        bodyStyle={{
          maxHeight: 420,
          overflowY: "auto"
        }}
      />
      <Button
        icon={<PlusOutlined />}
        onClick={onAddTags}
        className={styles['choose-btn']}>
        选择{categoryNames[type]}
      </Button>
      <div className={styles['select-section']}>
        {arr.map((item) => (
          <TagItem
            key={item.id}
            onClose={() => onCloseTag(item)}
            closeable={true}>
            <TagItemContent type={type} data={item} />
          </TagItem>
        ))}
        {isOver ? (
          <span className={styles['part-actions']}>
            <span className={styles['ellipsis-text']}>...</span>
            <span className={styles['look-action']} onClick={onDetail}>
              查看{categoryNames[type]}
            </span>
          </span>
        ) : null}
      </div>
    </>
  )
}
