import { post, get } from '../request';
import { handleObj, saveFileByRes } from '../utils';

export const UploadFile = async params => {
  return post('/api/common/uploadWithoutWx', params, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: params
  }).then(res => handleObj(res))
}
export const UploadWx = async params => {
  return post('/api/common/upload', params, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: params
  }).then(res => handleObj(res))
}

// mediaId
export const ReUploadToWx = async (params) => {
  return get('/api/common/recordUploadToWx', params).then(res => handleObj(res))
}

export const DowloadFileById = async (params, fileName) => {
  return get('/api/common/downloadByFileId', params, {
    needHandleResponse: true,
    responseType: 'blob'
  }).then(res => saveFileByRes(res, fileName))
}