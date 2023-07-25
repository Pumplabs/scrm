import { calcSize, getFileParams } from './fileUtils'

/**
 * 校验文件大小
 * @param {object} file 
 * @param {object} options 
 * @returns 
 * @param {boolean} flag 校验是否通过
 */
export const validFileSize = ({ file }, options = {}) => {
  const { maxFileSize = Number.MAX_SAFE_INTEGER, sizeUnit = 'M' } = options;
  const curFileSize = calcSize(file.size, sizeUnit);
  return curFileSize <= maxFileSize
}

/**
 * 校验文件类型
 */
export const validFileType = ({ file }, options = {}) => {
  const { acceptTypeList = [], excludeTypeList = [] } = options;
  // acceptTypeList优先级大于excludeTypeList，传入了acceptTypeList,excludeTypeList无效
  //正则表达式获取后缀
  let { fileType } = getFileParams(file.name)
  console.log(acceptTypeList, fileType);
  fileType = fileType.toLowerCase();
  // 如果存在可接受类型
  if (acceptTypeList.length) {
    return acceptTypeList.includes(fileType)
  } else if (excludeTypeList) {
    return !excludeTypeList.includes(fileType)
  } else {
    return true
  }
}


/**
 * 校验文件名称是否已重复
 */
export const validFileNameIsExist = ({ file, fileList = [] }, options = {}) => {
  return !fileList.some((item) => item.name === file.name && file.uid !== item.uid);
}

/**
 * 校验文件名称长度
 */
export const validFileNameLength = ({ file }, options = {}) => {
  const { maxFileNameLen } = options
  const { fileName } = getFileParams(file.name)
  return maxFileNameLen ? fileName.length <= maxFileNameLen : true
}
/**
 * 校验文件上传长度
 */
export const validFileTotalLen = ({ file, fileList = [], uploadList = [] }, options = {}) => {
  const { maxFileTotalLen, forbidUids = [] } = options
  const currentLen = fileList.length;
  // 已上传长度
  const uploadedTotal = uploadList.length;
  const total = currentLen + uploadedTotal;
  // 超出的长度
  const currentTotal = maxFileTotalLen - uploadedTotal
  if (total > maxFileTotalLen) {
    let len = 0
    return fileList.some((item) => {
      const isForbidFile = forbidUids.includes(item.uid)
      if (!isForbidFile) {
        len++;
      }
      if (item.uid === file.uid) {
        return len > currentTotal
      } else {
        return false
      }
    })
  }
  return true
}
/**
 * 校验一次文件长度
 */
export const validOnceFileLen = ({ file, fileList = [] }, options = {}) => {
  const { onceFileLen, forbidUids = [] } = options
  if (onceFileLen) {
    let len = 0
    return fileList.some(ele => {
      const flag = forbidUids.includes(ele.uid)
      if (!flag) {
        len++;
      }
      if (ele.uid === file.uid) {
        return len <= onceFileLen
      }
      return false
    })
  } else {
    return true
  }
}