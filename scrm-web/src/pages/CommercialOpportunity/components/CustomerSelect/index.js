import { forwardRef } from 'react'
import { DownOutlined, CloseCircleOutlined } from '@ant-design/icons'
import MySelect from 'components/MySelect'
import WeChatCell from 'components/WeChatCell'
import styles from './index.module.less'

export default forwardRef((props, ref) => {
  const { placeholder = '请选择', style, ...rest } = props
  const sectionProps = {
    disabled: rest.disabled,
    style,
  }
  return (
    <MySelect
      ref={ref}
      onlyChooseUser={true}
      title={placeholder}
      style={{ width: '100%' }}
      {...rest}
      type="staffCustomer"
      fileldNames={{
        value: 'extId',
      }}
      baseSearchParams={{
        extCreatorId: rest.staffId ? [rest.staffId]: []
      }}
      max={1}
    >
      {({ tags, onAddTags, onCloseTag }) => {
        return tags.length ? (
          <UserSection tags={tags} onClose={onCloseTag} {...sectionProps} />
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
        <UserItem data={ele} key={ele.id} />
      ))}
      <CloseCircleOutlined
        className={styles['input-close-icon']}
        onClick={() => {
          onClose(tags[0])
        }}
      />
    </span>
  )
}
const UserItem = ({ data }) => {
  return <WeChatCell data={data}/>
}