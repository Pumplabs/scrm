import cls from 'classnames'
import MyTag from 'components/MyTag'
import styles from './index.module.less'

export default ({ dataSource = [], onSelectedTag, selectedTags }) => {
  return (
    <>
      {dataSource.map((item) => (
        <GroupItem
          data={item}
          key={item.id}
          onSelectedTag={onSelectedTag}
          selectedTags={selectedTags}
        />
      ))}
    </>
  )
}
const GroupItem = ({ data = {}, onSelectedTag, selectedTags = [] }) => {
  const onClickTag = (item, checked) => {
    if (typeof onSelectedTag === 'function') {
      onSelectedTag(item, checked)
    }
  }
  return (
    <div className={styles['tag-group-item']}>
      <p className={styles['group-name']}>{data.name}</p>
      <div className={styles['tag-content']}>
        {data.tags.map((item) => {
          const checked = selectedTags.includes(item.id)
          return (
            <MyTag
              key={item.id}
              className={cls({
                [styles['tag-item']]: true,
              })}
              color={checked ? 'primary': ''}
              fill="solid"
              onClick={() => onClickTag(item, checked)}
            >
              {item.name}
            </MyTag>
          )
        })}
      </div>
    </div>
  )
}
