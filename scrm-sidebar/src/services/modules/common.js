import { post } from '../request'
import { handleObj } from '../utils'

// 上传图片
export const UploadImg = async (params) => {
  return post('/api/common/upload', params, { needForm: true })
}
// 获取文件凭证
export const GetFileCertificate = async(params) => {
  return post('/api/common/getDownloadInfo', params, {needJson: true}).then(res => handleObj(res))
}
