import { useState, useMemo, useEffect } from 'react'
import FileListItem from './components/FileListItem'
import { convertMediaToAttachFiles } from '../utils'

/**
 * @param {Array} mediaArr
 * @param {Array} files
 * @param {Function} onCloseFile 关闭文件
 */
const FileList = ({ mediaArr, files, onCloseFile, className, onClick }) => {
  const [attachList, setAttachList] = useState([])
  const undefinedFiles = typeof files === 'undefined'
  const mediaJson = useMemo(() => {
    return JSON.stringify(mediaArr)
  }, [mediaArr])

  const getAttachList = async () => {
    const arr = Array.isArray(mediaArr) ? mediaArr : []
    if (arr.length) {
      const res = await convertMediaToAttachFiles(arr)
      setAttachList(res)
    } else {
      setAttachList([])
    }
  }
  useEffect(() => {
    if (undefinedFiles) {
      getAttachList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaJson, files])

  const fileList = undefinedFiles
    ? attachList
    : Array.isArray(files)
    ? files
    : []
  return (
    <ul className={className}>
      {fileList.map((fileItem) => (
        <FileListItem
          key={fileItem.uid}
          data={fileItem}
          onClose={onCloseFile}
        />
      ))}
    </ul>
  )
}
FileList.Item = FileListItem
export default FileList
