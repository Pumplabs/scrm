import { useRef, useEffect, useMemo } from 'react'
import { uniqueId } from 'lodash'

export default ({ visible, acceptTypes, onCancel, onOk }) => {
  const fileRef = useRef(null)
  // 已经处理过文件
  const hasHandleFile = useRef(false)
  const acceptFileStr = useMemo(
    () => acceptTypes.map((item) => item).join(),
    [acceptTypes]
  )

  useEffect(() => {
    if (visible && fileRef.current) {
      hasHandleFile.current = false
      fileRef.current.click()
    }
  }, [visible])

  const onFilesChange = (e) => {
    const files = e.target.files
    hasHandleFile.current = true
    if (files.length && typeof onOk === 'function') {
      const file = files[0]
      onOk({
        file: {
          uid: uniqueId('file_'),
          name: file.name,
          file: file,
          size: file.size,
        },
      })
    } else {
      onCancel()
    }
  }
  return (
    <input
      name="files"
      type="file"
      hidden
      ref={fileRef}
      onChange={onFilesChange}
      accept={acceptFileStr}
    />
  )
}
