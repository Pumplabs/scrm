import React, { forwardRef, useState } from 'react'
import { Upload } from 'antd'
import cls from 'classnames'
import { UPLOAD_API } from './constants'
import { showUserExpiredModal } from 'services/request'
import { TOKEN_KEY, SUCCESS_CODE } from 'utils/constants'
import useUploadHook from './useUploadHook'

/**
 * 文件上传
 * @param {object} validOptions 文件校验参数
 * * @param {number} maxFileSize 单个文件大小
 * * @param {string} sizeUnit 文件大小单位
 * * @param {number} maxFileNameLen 文件名称长度
 * * @param {number} maxFileTotalLen 文件总长度
 * * @param {number} onceFileLen 单次文件总长度
 * * @param {boolean} allowRepeatFile 是否允许存在重复文件
 * * @param {array<string>} acceptTypeList 允许文件类型
 * * @param {array<string>} excludeTypeList 排除的文件类型
 */
export default forwardRef((props, ref) => {
  const {
    children,
    validOptions = {},
    hidedFiles = true,
    onBeforeUpload,
    onChange,
    className,
    ...otherProps
  } = props
  const [selfFileList, setSelfFileList] = useState([])
  const isDefinedValue = typeof props.fileList !== 'undefined'
  const currentFileList = isDefinedValue ? props.fileList : selfFileList
  const { acceptTypeList = [] } = validOptions

  const handleChange = (e) => {
    const { file, fileList } = e
    if (!isDefinedValue) {
      setSelfFileList(fileList)
    }
    const response = file.response
    if (
      file.status === 'done' &&
      response &&
      response.code !== SUCCESS_CODE &&
      typeof response.msg === 'string'
    ) {
      if (response.msg.includes('token')) {
        showUserExpiredModal()
        return
      }
    }
    if (typeof onChange === 'function') {
      onChange(e)
    }
  }

  const { onChange: onUploadChange, validateFn } = useUploadHook({
    validOptions,
    ...otherProps,
    onChange: handleChange,
  })

  const handleBeforeUpload = (file, fileList) => {
    // 判断校验是否通过
    const flag = validateFn({ file, fileList })
    if (typeof onBeforeUpload === 'function') {
      return onBeforeUpload({ file, fileList }, flag)
    } else {
      return flag
    }
  }
  const acceptProps =
    Array.isArray(acceptTypeList) && acceptTypeList.length
      ? {
        accept: acceptTypeList.join(),
      }
      : {}
  const uploadProps = {
    fileList: currentFileList,
    beforeUpload: handleBeforeUpload,
    onChange: onUploadChange,
    ...acceptProps,
    className: cls({
      'wy-upload': true,
      [className]: className,
    }),
    ...otherProps,
  }

  const isOverFiles = currentFileList.length >= validOptions.maxFileTotalLen

  return (
    <div ref={ref} id={props.id}>
      <Upload
        action={UPLOAD_API}
        headers={{
          token: localStorage.getItem(TOKEN_KEY),
        }}
        {...uploadProps}
      >
        {isOverFiles && hidedFiles ? null : children}
      </Upload>
    </div>
  )
})