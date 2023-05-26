import DescriptionsList from 'components/DescriptionsList'
import TagSelect from 'components/TagSelect'
import MySelect from 'components/MySelect'
import styles from './index.module.less'

export default ({ value = {}, onChange }) => {
  const triggerChange = (key, val) => {
    if (typeof onChange === 'function') {
      onChange({
        ...value,
        [key]: val,
      })
    }
  }

  const onUserChange = (val) => {
    triggerChange('users', val)
  }

  const onTagsChange = (val) => {
    triggerChange('tags', val)
  }

  return (
    <div className={styles['filter-box']}>
      <DescriptionsList.Item label="标签">
        <TagSelect
          placeholder="请选择客户标签"
          tagType="customer"
          value={value.tags}
          onChange={onTagsChange}
        />
      </DescriptionsList.Item>
      <DescriptionsList.Item label="成员">
        <MySelect
          type="user"
          onChange={onUserChange}
          value={value.users}
          title="选择成员"
          placeholder="选择成员"
        />
      </DescriptionsList.Item>
    </div>
  )
}
