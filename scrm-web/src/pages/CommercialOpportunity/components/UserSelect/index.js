import { forwardRef } from 'react'
import { DownOutlined, CloseCircleOutlined } from '@ant-design/icons'
import OpenEle from 'components/OpenEle'
import MySelect from 'components/MySelect'
import styles from './index.module.less'

export default forwardRef((props, ref) => {
  const { placeholder = '请选择', style, ...rest } = props
  const sectionProps = {
    style,
  }
  return (
    <MySelect
      ref={ref}
      onlyChooseUser={true}
      title={placeholder}
      style={{ width: '100%' }}
      {...rest}
      type="user"
      fileldNames={{
        value: 'extId',
      }}
      max={1}
    >
      {({ tags, onAddTags, onCloseTag }) => {
        return tags.length ? (
          <UserSection tags={tags} onClose={onCloseTag} {...sectionProps} onClick={onAddTags} />
        ) : (
          <InputSection onClick={onAddTags} {...sectionProps}>
            {placeholder}
          </InputSection>
        )
      }}
    </MySelect>
  )
})

const InputSection = ({ children, ...rest }) => {
  return (
    <span className={styles['input-section']} {...rest}>
      {children}
      <DownOutlined className={styles['input-arrow']} />
    </span>
  )
}

const UserSection = ({ tags, onClose, ...rest }) => {
  return (
    <span className={styles['input-section']} {...rest}>
      {tags.map((ele) => (
        <UserItem extId={ele.extId} key={ele.key} />
      ))}
      <CloseCircleOutlined
        className={styles['input-close-icon']}
        onClick={(e) => {
          e.stopPropagation()
          onClose(tags[0])
        }}
      />
    </span>
  )
}
const UserItem = ({ extId }) => {
  return <OpenEle type="userName" openid={extId} />
}