import { Tooltip } from 'antd'
import { useMemo } from 'react'
import {
  AudioOutlined,
  DownloadOutlined,
  FileImageOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileWordOutlined,
  VideoCameraOutlined,
  FileOutlined,
} from '@ant-design/icons'
import { get } from 'lodash'

import { getFileParams } from 'components/CommonUpload/validFn'
import { WX_IMG_FILE_TYPE, ACCEPT_VIDEO_FILE_TYPE } from 'utils/constants'
import { DownFileByFileId } from 'services/modules/common'

import styles from './index.module.less'

const XCEL_TYPES = ['.xls', 'xlsx']
const PPT_TYPES = ['.ppt', '.pptx']
const WORD_TYPES = ['.doc', '.docx']
const PDF_TYPEF = ['.pdf']
const AUDIO_TYPES = ['.amr']
const FileIconByFileType = ({ fullName }) => {
  const { fileType } = useMemo(() => getFileParams(fullName), [fullName])
  if (WX_IMG_FILE_TYPE.includes(fileType)) {
    return <FileImageOutlined />
  } else if (ACCEPT_VIDEO_FILE_TYPE.includes(fileType)) {
    return <VideoCameraOutlined />
  } else if (XCEL_TYPES.includes(fileType)) {
    return <FileExcelOutlined />
  } else if (PDF_TYPEF.includes(fileType)) {
    return <FilePdfOutlined />
  } else if (PPT_TYPES.includes(fileType)) {
    return <FilePptOutlined />
  } else if (WORD_TYPES.includes(fileType)) {
    return <FileWordOutlined />
  } else if (AUDIO_TYPES.includes(fileType)) {
    return <AudioOutlined />
  } else {
    return <FileOutlined />
  }
}

// 附件
export default ({ list = [], fieldNames = {} }) => {
  const { id: idKey = 'id', fileName: fileNameKey = 'fileName' } = fieldNames
  const onDownload = ({ fileName, fileId }) => {
    DownFileByFileId(
      {
        fileId,
      },
      fileName
    )
  }

  return (
    <ul className={styles['attach-pane']}>
      {list.map((ele, idx) => {
        const fileName = get(ele, fileNameKey)
        const fileId = get(ele, idKey)
        return (
          <li className={styles['attach-file-item']} key={`${fileId}_${idx}`}>
            <Tooltip title={fileName} placement="topLeft">
              <div className={styles['attach-file-content']}>
                <div className={styles['attach-file-icon']}>
                  <FileIconByFileType fullName={fileName} />
                </div>
                {fileName}
              </div>
            </Tooltip>
            <DownloadOutlined
              className={styles['download-icon']}
              onClick={() =>
                onDownload({
                  fileName,
                  fileId,
                })
              }
            />
          </li>
        )
      })}
    </ul>
  )
}
