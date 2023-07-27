import { useState, useRef, useEffect, useMemo, forwardRef } from 'react'
import { Toast } from 'antd-mobile'
import cls from 'classnames'
import { isEmpty, uniqueId } from 'lodash'
import { ActionSheet } from 'antd-mobile'
import { AudioFill, AddOutline } from 'antd-mobile-icons'
import { UploadFile, UploadWx } from 'services/modules/file'
import SelectLocalFile from './SelectLocalFile'
import SelectMaterialFilesModal from './SelectMaterialFileModal'
import FileList from './FileList'
import { validFileType } from './fileValid'
import { getFileParams, calcSize } from './fileUtils'
import { useModalHook } from 'src/hooks'
import { fillZero } from 'src/utils'
import { covertMetrialToFileItem, convertLocalFileToFileItem } from './utils'
import { getRequestError } from 'src/services/utils'
import { ReUploadToWx } from 'services/modules/file'
import { ACCEPT_FILE_TYPES, VIDEO_TYPES, IMG_TYPES } from './constants'
import {
  WX_OTHER_FILE_SIZE,
  WX_IMAGE_FILE_SIZE,
  WX_VIDEO_FILE_SIZE,
} from 'src/utils/constants'
import recordingUrl from 'assets/images/icon/recording-icon.svg'
import styles from './index.module.less'

const validFileSize = ({ file }) => {
  const sizeUnit = 'M'
  const { fileType } = getFileParams(file.name)
  const maxSize = getFileMaxsize(fileType)
  return calcSize(file.size, sizeUnit) <= maxSize
}

const defaultValidOption = {
  // 文件长度
  fileSize: validFileSize,
  // 文件类型
  fileType: validFileType,
}

const getFileMaxsize = (fileType) => {
  if (VIDEO_TYPES.includes(fileType)) {
    return WX_VIDEO_FILE_SIZE
  } else if (IMG_TYPES.includes(fileType)) {
    return WX_IMAGE_FILE_SIZE
  } else {
    return WX_OTHER_FILE_SIZE
  }
}

const showFileValidFailMsg = (type, { file }) => {
  const sizeUnit = 'M'
  const { fileType } = getFileParams(file.name)
  const maxSize = getFileMaxsize(fileType)
  let msg = ''
  switch (type) {
    case 'fileSize':
      msg = `文件${file.name}大小不能超过${maxSize}${sizeUnit}`
      break
    case 'fileType':
      msg = `不支持上传${fileType}类型,文件${file.name}上传失败!`
      break
    default:
      break
  }
  if (msg) {
    Toast.show({
      icon: 'fail',
      content: msg,
    })
  }
}
const MAX_FILE_COUNT = 9
const UploadFileItem = forwardRef(
  (
    {
      onChange,
      fileList,
      children,
      acceptTypeList = ACCEPT_FILE_TYPES,
      uploadWx = true,
      maxFileCount = MAX_FILE_COUNT,
      attachmentConfig = {},
    },
    ref
  ) => {
    const [files, setFiles] = useState([])
    const currentFileListRef = useRef(fileList)
    const localFileRef = useRef(null)
    const { openModal, closeModal, visibleMap } = useModalHook([
      'material',
      'file',
      'localFile',
    ])
    const hasDefined = Array.isArray(fileList)
    const currentFileList = hasDefined ? fileList : files
    const {
      showTrackMaterial = true,
      showNormalMaterial = true,
      showLocal = true,
    } = attachmentConfig
    const { shouldShowSelectModal, openModalType } = useMemo(() => {
      const showMaterial = showNormalMaterial || showTrackMaterial
      const openModalType = showMaterial ? 'material' : 'localFile'
      return {
        shouldShowSelectModal: showMaterial && showLocal,
        openModalType,
      }
    }, [showTrackMaterial, showNormalMaterial, showLocal])

    useEffect(() => {
      currentFileListRef.current = hasDefined ? fileList : files
    }, [fileList, files, hasDefined])

    const uploadFn = uploadWx ? UploadWx : UploadFile
    const runUploadFile = async (params, { uid }) => {
      try {
        const res = await uploadFn(params)
        const isSuccess = !!res.id
        const fileData = isSuccess
          ? {
            fileSize: res.size,
            filePath: `${window.location.origin}/api/common/downloadByFileId?fileId=${res.id}`,
            fileId: res.id,
          }
          : {}
        updateFileStatus(uid, isSuccess ? 'done' : 'fail', fileData)
      } catch (e) {
        getRequestError(e, '上传失败')
        updateFileStatus(uid, 'fail')
      }
    }

    // 根据uid更新文件状态
    const updateFileStatus = (uid, status, data = {}) => {
      updateFiles((arr) =>
        arr.map((item) => {
          if (item.uid === uid) {
            return {
              ...item,
              status,
              content: {
                ...item.content,
                ...data,
              },
            }
          } else {
            return item
          }
        })
      )
    }

    const updateFiles = (nextVal) => {
      const isFn = typeof nextVal === 'function'
      if (typeof onChange === 'function') {
        onChange({
          files: isFn ? nextVal(currentFileListRef.current) : nextVal,
        })
      }
      if (!hasDefined) {
        setFiles(nextVal)
      }
    }

    const validFiles = (file, fileList) => {
      for (const key in defaultValidOption) {
        const fn = defaultValidOption[key]
        if (typeof fn === 'function') {
          const validFlag = fn({ file, fileList }, { acceptTypeList })
          if (!validFlag) {
            showFileValidFailMsg(key, { file, fileList })
            return validFlag
          }
        }
      }
      return true
    }

    const onLocalFileOk = async ({ file }) => {
      closeModal()
      const validFlag = validFiles(file, files)
      if (validFlag) {
        const formData = new FormData()
        formData.append('file', file.file)
        runUploadFile(formData, { uid: file.uid })
        const { fileType } = getFileParams(file.name)
        updateFiles((arr) => [
          ...arr,
          {
            uid: file.uid,
            status: 'uploading',
            ...convertLocalFileToFileItem({
              ...file,
              fileType,
            }),
          },
        ])
      }
    }

    const onCloseFile = (file) => {
      updateFiles((arr) => arr.filter((item) => item.uid !== file.uid))
    }

    const onSelectFile = () => {
      const type = shouldShowSelectModal ? 'file' : openModalType
      if (type === 'localFile') {
        showLocalFile()
      } else {
        openModal(type)
      }
    }

    const onMaterialOk = ({ selectedList = [] }) => {
      closeModal()
      updateFiles((arr) => [
        ...arr,
        ...selectedList.map((item) => ({
          uid: uniqueId('material_'),
          fileId: item.fileId,
          status: 'done',
          ...covertMetrialToFileItem(item),
        })),
      ])
    }

    const onAction = (action) => {
      if (action.key)
        switch (action.key) {
          case 'material':
            openModal('material')
            break
          case 'file':
            closeModal()
            openModal('localFile')
            break
          default:
            closeModal()
            break
        }
    }

    const addFile = (file) => {
      const files = Array.isArray(file) ? file : [file]
      updateFiles((arr) => [...arr, ...files])
    }
    const showLocalFile = () => {
      localFileRef.current.click()
    }
    const currentCount = currentFileList.length
    const selectActions = [
      {
        text: '从素材库选择',
        key: 'material',
        onClick: () => {
          openModal('material')
        },
      },
      {
        text: '从本地选择',
        key: 'file',
        onClick: () => {
          closeModal()
          showLocalFile()
        },
      },
      {
        text: '取消',
        key: 'cancel',
        onClick: () => {
          closeModal()
        },
      },
    ]
    return (
      <div ref={ref}>
        <ActionSheet
          visible={visibleMap.fileVisible}
          actions={selectActions}
          onAction={onAction}
          onClose={closeModal}
        />
        <SelectLocalFile
             ref={localFileRef}
             acceptTypes={acceptTypeList}
             onChange={onLocalFileOk}
        />
        <SelectMaterialFilesModal
          visible={visibleMap.materialVisible}
          onOk={onMaterialOk}
          max={maxFileCount - currentCount}
          onCancel={closeModal}
          showNormalMaterial={showNormalMaterial}
          showTrackMaterial={showTrackMaterial}
        />
        {typeof children === 'function'
          ? children({
            currentCount,
            currentFileList,
            onCloseFile,
            onSelectFile,
            addFile,
          })
          : null}
      </div>
    )
  }
)

/**
 * @param {Array} acceptTypeList 接受的类型
 */
const MyUpload = forwardRef(
  (
    {
      className,
      showLabel,
      maxFileCount = MAX_FILE_COUNT,
      showAudio,
      onAudioUploadChange,
      ...rest
    },
    ref
  ) => {
    return (
      <UploadFileItem {...rest} maxFileCount={maxFileCount} ref={ref}>
        {({
          currentCount,
          currentFileList,
          onCloseFile,
          onSelectFile,
          addFile,
        }) => (
          <div
            className={cls({
              [styles['files-section']]: true,
              [className]: className,
            })}>
            {showLabel ? (
              <p className={styles['files-title']}>
                附件({currentCount}/{maxFileCount})
              </p>
            ) : null}
            {currentFileList.length ? (
              <FileList files={currentFileList} onCloseFile={onCloseFile} />
            ) : null}
            {currentCount < maxFileCount ? (
              <div className={styles['upload-handler-section']}>
                <IconBtn onClick={onSelectFile}>
                  <AddOutline className={styles['add-icon']} />
                </IconBtn>
                {showAudio ? (
                  <RecordHandle
                    onUploadChange={onAudioUploadChange}
                    className={styles['record-icon-btn']}
                    addFile={addFile}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </UploadFileItem>
    )
  }
)
export const RECORD_STATUS = {
  INIT: 'init',
  RECORDING: 'recording',
  UPLOADING: 'uploading',
}
const MAX_RECORD_TIME_LEN = 60
const RecordHandle = ({ addFile, onUploadChange, ...rest }) => {
  const recordBtnRef = useRef(null)
  const timer = useRef(null)
  const [recordTimes, setRecordTimes] = useState(0)
  const [recordStatus, setRecordStatus] = useState(RECORD_STATUS.INIT)
  const isRecording = recordStatus === RECORD_STATUS.RECORDING
  const isUploading = recordStatus === RECORD_STATUS.UPLOADING
  const addTimer = () => {
    if (!timer.current) {
      timer.current = setInterval(() => {
        setRecordTimes((val) => {
          const nextNum = val + 1
          if (MAX_RECORD_TIME_LEN - nextNum === 10) {
            Toast.show({
              content: `10"后将停止录音`,
            })
          }
          return nextNum
        })
      }, 1000)
    }
  }
  const removeTimer = () => {
    setRecordStatus(RECORD_STATUS.INIT)
    setRecordTimes(0)
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
  }
  const touchStartHandler = (e) => {
    e.preventDefault()
    setRecordStatus(RECORD_STATUS.RECORDING)
    addTimer()
    if (window.wx) {
      window.wx.startRecord()
    }
  }

  useEffect(() => {
    if (typeof onUploadChange === 'function') {
      onUploadChange(recordStatus)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordStatus])
  useEffect(() => {
    recordBtnRef.current.addEventListener('touchstart', touchStartHandler, {
      passive: false,
    })
    if (window.wx) {
      window.wx.onVoiceRecordEnd({
        complete: function (res) {
          removeTimer()
          if (res.localId) {
            uploadRecord(res.localId)
          }
        },
      })
    }
    return () => {
      if (recordBtnRef.current) {
        recordBtnRef.current.removeEventListener(
          'touchstart',
          touchStartHandler,
          { passive: false }
        )
      }
      removeTimer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 上传录音
  const uploadRecord = (localId) => {
    if (window.wx) {
      setRecordStatus(RECORD_STATUS.UPLOADING)
      window.wx.uploadVoice({
        localId,
        isShowProgressTips: 1,
        success: async function (res) {
          const mediaId = res.serverId
          const uploadRes = await ReUploadToWx({
            mediaId,
          })
          if (typeof addFile === 'function') {
            addFile({
              uid: uploadRes.id,
              status: 'done',
              type: 'audio',
              content: {
                name: uploadRes.fileName,
                fileSize: uploadRes.size,
                fileId: uploadRes.id,
                mediaInfoId: uploadRes.mediaId,
                fileType: '.amr',
              },
            })
          }
          setRecordStatus(RECORD_STATUS.INIT)
          if (isEmpty(uploadRes)) {
            Toast.show({
              icon: 'fail',
              content: '录音上传失败',
            })
          }
        },
        onerror: () => {
          setRecordStatus(RECORD_STATUS.INIT)
          Toast.show({
            icon: 'fail',
            content: '录音上传失败',
          })
        },
      })
    }
  }

  const onStopRecord = () => {
    if (window.wx && isRecording) {
      removeTimer()
      window.wx.stopRecord({
        success: function (res) {
          if (res.localId) {
            uploadRecord(res.localId)
          }
        },
      })
    }
  }
  return (
    <>
      <IconBtn
        onTouchEnd={onStopRecord}
        onTouchCancel={onStopRecord}
        ref={(r) => (recordBtnRef.current = r)}
        {...rest}>
        <AudioFill className={styles['add-audio-icon']} />
      </IconBtn>
      {isUploading || isRecording ? (
        <span className={styles['record-tip']}>
          {isUploading ? (
            <span className={styles['record-upload-tip']}>录音上传中...</span>
          ) : null}
          {isRecording ? (
            <>
              <img
                src={recordingUrl}
                alt=""
                className={styles['recording-icon']}
              />
              <span className={styles['record-time']}>
                00:{fillZero(recordTimes)}
              </span>
            </>
          ) : null}
        </span>
      ) : null}
    </>
  )
}
const IconBtn = forwardRef(({ className, ...rest }, ref) => {
  return (
    <span
      ref={ref}
      className={cls({
        [styles['icon-wrap']]: true,
        [className]: className,
      })}
      {...rest}></span>
  )
})
export { default as FileList } from './FileList'
export {
  convertMediaToAttachFiles,
  convertAttachItemToMediaParams,
} from './utils'

const UploadFormItem = forwardRef((props, ref) => {
  const { onChange, ...rest } = props
  const handleChange = ({ files }) => {
    if (typeof onChange === 'function') {
      onChange(files)
    }
  }
  return <MyUpload ref={ref} onChange={handleChange} {...rest} />
})
export { UploadFormItem }
export default MyUpload
