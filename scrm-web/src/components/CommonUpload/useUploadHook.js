import { useRef } from 'react';
import { message } from 'antd';
import { merge } from 'lodash'
import { MAX_FILE_SIZE, MAX_FILE_NAME_SIZE } from './constants';
import { validFileSize, validFileType, validFileNameLength, validFileNameIsExist, validFileTotalLen, validOnceFileLen, getFileParams } from './validFn'

const defaultOptions = {
  maxFileSize: MAX_FILE_SIZE,
  maxFileNameLen: MAX_FILE_NAME_SIZE,
}
const defaultValidOption = {
  // 文件长度
  fileSize: validFileSize,
  // 文件类型
  fileType: validFileType,
  // 文件名称长度
  fileNameLength: validFileNameLength,
  // 文件重复
  fileRepeat: validFileNameIsExist,
  // 文件总长度
  fileTotalLen: validFileTotalLen,
  // 单次文件总长度
  fileOnceLen: validOnceFileLen
}
const showFileValidFailMsg = (type, { file }, options) => {
  const { maxFileSize = 1, sizeUnit = 'M', maxTotalFileLen, maxNameLen, maxFileCount } = options
  const { fileType } = getFileParams(file.name)
  let msg = ''
  switch (type) {
    case 'fileSize':
      msg = `文件${file.name}大小不能超过${maxFileSize}${sizeUnit}`
      break;
    case 'fileType':
      msg = `不支持上传${fileType}类型,文件${file.name}上传失败!`
      break;
    case 'fileNameLength':
      msg = `文件${file.name}名称长度不能超过${maxNameLen}字`
      break;
    case 'fileRepeat':
      msg = `文件${file.name}已存在`
      break;
    case 'fileTotalLen':
      msg = `文件总数已超过最大总数${maxTotalFileLen}!`
      break;
    case '':
      msg = `单次上传文件总数已超出最大数${maxFileCount}!`
      break;
    default:
      break;
  }
  if (msg) {
    message.error(msg)
  }
}
export default (props) => {
  const { onChange, handleReponseStatus, validOptions = {} } = props;
  const options = merge(defaultOptions, validOptions)
  const forbidUidsRef = useRef([])

  // 文件变化
  const onUploadChange = (event) => {
    const { fileList, file } = event;
    const { uid } = file;
    let newFile = {
      ...file,
    };
    let newFileList = fileList.filter(ele => !forbidUidsRef.current.includes(ele.uid));
    newFile.status = getFileNextStatus(file)
    newFileList = newFileList.map(ele => {
      if (ele.status === 'done' && forbidUidsRef.current.includes(uid)) {
        ele.status = 'error';
      }
      return ele;
    });
    const newEvent = {
      ...event,
      file: newFile,
      fileList: newFileList
    };
    if (typeof onChange === 'function') {
      onChange(newEvent);
    }
    return newEvent
  }

  const getFileNextStatus = (file) => {
    const { uid } = file
    // 如果该文件id出现在需要忽略的id列表中,则设置其状态为removed
    if (forbidUidsRef.current.includes(uid)) {
      return 'removed'
    }
    if (file.status === 'done' && file.response && !forbidUidsRef.current.includes(uid) && typeof handleReponseStatus === 'function') {
      const userStat = handleReponseStatus(file);
      if (userStat === 'error') {
        forbidUidsRef.current = [...forbidUidsRef.current, uid]
      }
      return userStat ? userStat : 'done';
    }
    return file.status
  }

  const validateFn = ({ file, fileList }) => {
    for (const key in defaultValidOption) {
      const fn = defaultValidOption[key]
      if (typeof fn === 'function') {
        const validFlag = fn({ file, fileList }, { ...options, forbidUids: forbidUidsRef.current, uploadList: [] })
        if (!validFlag) {
          forbidUidsRef.current = [...forbidUidsRef.current, file.uid];
          showFileValidFailMsg(key, { file, fileList }, options)
          return validFlag
        }
      }
    }
    return true
  }

  return {
    onChange: onUploadChange,
    validateFn
  }
}