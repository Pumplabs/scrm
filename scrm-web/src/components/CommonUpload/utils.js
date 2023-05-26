// 校验文件大小
export const validateFileSize = (currentSize, maxSize, unit = 'M') => {
  const curFileSize = calcSize(currentSize, unit);
  return curFileSize < maxSize;
}

// 校验文件名称长度
export const validateFileNameSize = (fileFullyName, maxSize) => {
  const fileName = fileFullyName.replace(/(.*\/)*([^.]+).*/ig, "$2");
  return fileName.length < maxSize;
}

/**
 *  校验文件总长度是否溢出
 *  @param {Object} fileProps 文件相关的数据
 *  @param {Object} file 当前处理的文件
 *  @param {Array<Object>} fileList 当前处理的文件列表
 *  @param {Array<Object>} uploadedFiles 已处理的文件列表
 *  @param {Object} props 用户传入的props
 *  @param {Number} maxFileCount 最大文件长度
 *  @param {Array<String>} forbidUids 需要忽略的文件uId
 * @returns {boolean} true: 已超过,false: 未超过
 */
export const validateFileTotalCountIsOver = ({ file, fileList = [], uploadedFiles = [] }, { maxFileCount, forbidUids = [] }) => {
  const { uid } = file;
  const currentTotal = fileList.length;
  const preTotal = uploadedFiles.length;
  const fileCount = currentTotal + preTotal;
  const isOver = fileCount > maxFileCount;
  if (isOver) {
    // 校验不通过的文件
    const notForbidFileList = fileList.filter(ele => !forbidUids.includes(ele.uid));
    // 判断当前文件是否处于超出的部分里边
    const sliceLen = maxFileCount - preTotal;
    // 从超出部分过滤掉不通过的文件
    const overList = notForbidFileList.slice(sliceLen);
    // 判断当前文件是否处于超出的列表中
    const idx = overList.findIndex(ele => ele.uid === uid);
    return idx > -1;
  }
  return isOver;
}

/**
 * 校验文件类型是否合法
 *  @param {Object} fileProps 文件相关的数据
 *  @param {Object} file 当前处理的文件
 *  @param {Array<Object>} fileList 当前处理的文件列表
 *  @param {Array<Object>} uploadedFiles 已处理的文件列表
 *  @param {Object} props 用户传入的props
 *  @param {Array<String>} acceptTypeList 可接受的文件类型列表
 *  @param {Array<String>} excludeTypeList 不接受的文件类型列表
 *  @returns {boolean} true: 合法; false: 不合法
 */
export const validateFileType = ({ file }, { acceptTypeList = [], excludeTypeList = [] }) => {
  // acceptTypeList优先级大于excludeTypeList，传入了acceptTypeList,excludeTypeList无效
  const { name } = file;
  //正则表达式获取后缀
  const fileType = name.replace(/.+\./, "").toLowerCase();
  if (excludeTypeList.length || acceptTypeList.length) {
    // 是否为接受的类型
    const isAcceptType = acceptTypeList.length > 0 ? acceptTypeList.includes(fileType) : true;
    // 是否为排除的文件类型
    const isExcludeType = excludeTypeList.length > 0 ? excludeTypeList.includes(fileType) : false;
    if (isExcludeType || !isAcceptType) {
      return false;
    }
  }
  return true;
}
/**
 * 校验文件名称长度是否溢出
 * @param {Object} fileProps 文件相关的数据
 *  @param {Object} file 当前处理的文件
 *  @param {Array<Object>} fileList 当前处理的文件列表
 *  @param {Array<Object>} uploadedFiles 已处理的文件列表
 * @param {Object} props 用户传入的props
 *   @param {Array<String>} maxNameLen 文件名称最大长度
 *   @param {Array<String>} excludeTypeList 不接受的文件类型列表
 * @returns {Boolean} true: 未超出;false: 已超出
 */
export const validateFileNameLenIsOver = ({ file }, { maxNameLen }) => {
  const { name } = file;
  return validateFileNameSize(name, maxNameLen);
}

/**
 * 校验文件名称是否已重复
 * @param {Object} fileProps 文件相关的数据
 *  @param {Object} file 当前处理的文件
 *  @param {Array<Object>} fileList 当前处理的文件列表
 *  @param {Array<Object>} uploadedFiles 已处理的文件列表
 * @param {Object} props 用户传入的props
 *   @param {Array<String>} maxNameLen 文件名称最大长度
 * @returns {Boolean} true: 已存在;false: 不存在
 */
export const validateNameIsExist = ({ file, uploadedFiles = [] }) => {
  const { name } = file;
  // 判断文件是否存在
  const fileIsExist = uploadedFiles.some((item) => item.name === name);
  return fileIsExist;
}

/**
 * 校验单个文件大小是否溢出
 * @param {Object} fileProps 文件相关的数据
 *  @param {Object} file 当前处理的文件
 *  @param {Array<Object>} fileList 当前处理的文件列表
 *  @param {Array<Object>} uploadedFiles 已处理的文件列表
 * @param {Object} props 用户传入的props
 *   @param {Array<String>} maxSize 最大文件大小
 *   @param {Array<String>} sizeUnit 文件大小单位
 * @returns {Boolean} true: 已超出;false: 未超出
 */
export const validateFileSizeIsOver = ({ file }, { maxSize, sizeUnit }) => {
  // 已上传的文件
  const isNotOver = validateFileSize(file.size, maxSize, sizeUnit);
  return isNotOver;
}

const normFile = e => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
}
export const uploadRules = {
  valuePropName: 'fileList',
  getValueFromEvent: normFile,
}

/**
 * 计算文件大小
 * @param {number} val 文件大小
 * @param {string} targetUnit 目标单位
 * @param {string} curUnit 当前文件单位
 * @returns {number} 计算后的文件大小
 */
export const calcSize = (val = 0, targetUnit = 'M', curUnit = 'B') => {
  const units = ['B', 'KB', 'M', 'G'];
  const curIndx = units.indexOf(curUnit);
  const targetIndx = units.indexOf(targetUnit);
  const sub = (curIndx > -1) && (targetIndx > -1) ? (targetIndx - curIndx) : 0;
  const value = Number.isNaN(val * 1) ? 0 : val * 1;
  let res = 0;
  if (sub > 0) {
    res = value / (Math.pow(1024, sub));
  } else if (sub < 0) {
    res = value * (Math.pow(1024, Math.abs(sub)));
  } else {
    res = value;
  }
  return res;
}