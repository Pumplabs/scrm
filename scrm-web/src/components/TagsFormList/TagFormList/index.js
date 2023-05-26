import { useRef } from 'react'
import { Form, Button, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import TagItem from '../TagItem'
import styles from './index.module.less'

const TagFormItem = (props) => {
  const { name, idx, add, remove, move, maxIdx, ...rest } = props
  const onAction = (type) => {
    switch (type) {
      case 'add':
        add(
          {
            name: '',
          },
          idx + 1
        )
        break
      case 'remove':
        remove(idx)
        break
      case 'up':
        move(idx, idx - 1)
        break
      case 'down':
        move(idx, idx + 1)
        break
      case 'top':
        move(idx, 0)
        break
      case 'bottom':
        move(idx, maxIdx)
        break
      default:
        break
    }
  }
  return (
    <>
      <Form.Item name={[name, 'id']} hidden>
        <Input />
      </Form.Item>
      <Form.Item name={[name, 'name']} {...rest}>
        <TagItem
          placeholder="请输入标签名称"
          maxLength={30}
          isFirst={idx === 0}
          isLast={idx === maxIdx}
          onAction={onAction}
        />
      </Form.Item>
    </>
  )
}

export default ({ name, getFieldValue, onRemove, ...rest }) => {
  const tagsRef = useRef()
  const errorIdx = useRef(-1)

  const scrollToTag = (count = 1) => {
    const itemHeight = 32 + 24
    if (tagsRef.current) {
      const scrollHeight = tagsRef.current.scrollHeight
      if (scrollHeight) {
        const scrollY = count * itemHeight
        setTimeout(() => {
          tagsRef.current.scrollTo(0, scrollY)
        }, 0)
      }
    }
  }

  const scrollToErrorField = (idx) => {
    if (errorIdx.current === -1) {
      errorIdx.current = idx
      scrollToTag(idx)
    }
  }
  const handleRemove = (idx, removeFn) => {
    const itemName = getFieldValue([name, idx, 'name'])
    const itemId = getFieldValue([name, idx, 'id'])
    if (typeof onRemove === 'function') {
      onRemove(idx, removeFn, { name: itemName, id: itemId })
    } else {
      removeFn(idx)
    }
  }
  return (
    <Form.List name={name} {...rest}>
      {(fields, { add, move, remove }, { errors }) => (
        <>
          <div
            className={styles.tagContainer}
            ref={(ref) => (tagsRef.current = ref)}>
            {fields.map((field, idx) => (
              <TagFormItem
                idx={idx}
                add={add}
                remove={() => handleRemove(idx, remove)}
                maxIdx={fields.length - 1}
                move={move}
                {...field}
                rules={[
                  {
                    validator: async (_, value) => {
                      const allTags = getFieldValue(name) || []
                      if (idx === 0) {
                        errorIdx.current = -1
                      }
                      if (value) {
                        const isExist = allTags.some(
                          (ele, eleIdx) => ele.name === value && eleIdx !== idx
                        )
                        if (isExist) {
                          scrollToErrorField(idx)
                          return Promise.reject(new Error(`标签名称已经存在`))
                        } else {
                          return Promise.resolve()
                        }
                      } else {
                        scrollToErrorField(idx)
                        return Promise.reject('请输入标签名称')
                      }
                    },
                  },
                ]}
              />
            ))}
          </div>
          <Button
            onClick={() => {
              scrollToTag(fields.length)
              add({
                name: '',
              })
            }}
            icon={<PlusOutlined />}
            type="primary"
            ghost>
            添加标签
          </Button>
          <Form.ErrorList errors={errors} />
        </>
      )}
    </Form.List>
  )
}
