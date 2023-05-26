import { forwardRef } from 'react'
import { message } from 'antd'
import cls from 'classnames'
import BaseUpload from './BaseUpload'
import styles from './index.module.less'

/**
 * @param {string} listType picture-inline
 */
export default forwardRef((props, ref) => {
  const { children, listType, className, ...otherProps } = props
  const onUploadChange = (info) => {
    const { file } = info
    const { response, name } = file
    switch (file.status) {
      case 'done':
        if (response) {
          if (response.code === 0) {
            message.success(`${name}上传成功`)
          } else {
            message.error(`${name}${response.msg || '上传失败'}`)
          }
        }
        break
      case 'error':
        message.error(`${name} 上传失败!`)
        break
      default:
        break
    }
    if (typeof otherProps.onChange === 'function') {
      otherProps.onChange(info)
    }
  }

  const renderChild = () => {
    if (
      Array.isArray(otherProps.fileList) &&
      otherProps.fileList.length > 0 &&
      listType === 'picture-inline'
    ) {
      return <span className={styles.editTextBtn}>编辑</span>
    } else {
      return children
    }
  }
  return (
    <BaseUpload
      hidedFiles={true}
      className={cls({
        [className]: className,
        'wy-upload': true,
        [styles[`upload-${listType}`]]: true,
      })}
      showUploadList={{
        showPreviewIcon: false,
      }}
      listType={listType === 'picture-inline' ? 'picture-card' : listType}
      {...otherProps}
      onChange={onUploadChange}
      ref={ref}>
      {renderChild()}
    </BaseUpload>
  )
})
