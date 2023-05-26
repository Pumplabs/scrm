import { post, get } from '../request'
import { handleObj, saveFileByRes } from '../utils'

// 上传图片
export const UploadImg = async (params) => {
  return post('/api/common/upload', params, { needForm: true })
}
// 获取文件凭证
export const GetFileCertificate = async(params) => {
  return post('/api/common/getDownloadInfo', params, {needJson: true}).then(res => handleObj(res))
}

// 下载文件
export async function ExportFile (params, fileName) {
  return get('/api/common/downloadFile', params, {
    needHandleResponse: true,
    responseType: 'blob'
  }).then(res => saveFileByRes(res, fileName))
}
// 上传图片到cos
// export const UploadCosImg = async (params) => {
//   return post('/api/common/uploadWithoutWx', params, { needForm: true })
// }
// 根据文件id下载文件
export const DownFileByFileId = async (params, fileName)=> {
  return get(`/api/common/downloadByFileId`, params, {
    needHandleResponse: true,
    responseType: 'blob'
  }).then(res => saveFileByRes(res, fileName))
}