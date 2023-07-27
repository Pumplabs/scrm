import { useMemo, forwardRef } from 'react'
import { uniqueId } from 'lodash'
import { useGetPlatform } from 'src/hooks/wxhook'

export default forwardRef((props, ref) => {
  const { onChange, acceptTypes = []} = props
  const { platform } = useGetPlatform()
  const acceptFileStr = useMemo(
    () => acceptTypes.map((item) => item).join(),
    [acceptTypes]
  )
  const onFilesChange = (e) => {
    const files = e.target.files
    if (files.length && typeof onChange === 'function') {
      const file = files[0]
      onChange({
        file: {
          uid: uniqueId('file_'),
          name: file.name,
          file: file,
          size: file.size,
        },
      })
    }
  }
  return (
    <input
        ref={ref}
        type="file"
        hidden
        onChange={onFilesChange}
        {...(platform === 'pc'
          ? {
              accept: acceptFileStr,
            }
          : {})}
      />
  )
})