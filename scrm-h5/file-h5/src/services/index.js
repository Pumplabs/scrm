import { get, post } from './request';

// 获取素材信息
export const GetMeterialInfo = (params) => get(
  `/api/mediaH5/${params.id}`,
);
// 添加用户日志
export const AddMediaLog = (params) => post('/api/wxDynamicMedia/save', params);
// 更新用户日志
export const UpdateMediaLog = (params) => post('/api/wxDynamicMedia/updateTime', params);
// 获取文件预览信息
export const GetPreviewInfo = (params) => get('/api/common/getPreviewInfo', params);

export const GetCosUrl = ({ mediaId }, data, cb) => {
  const cos = new COS({
    // getAuthorization 必选参数
    getAuthorization(options, callback) {
      callback({
        TmpSecretId: data.tmpSecretId,
        TmpSecretKey: data.tmpSecretKey,
        SecurityToken: data.sessionToken,
        // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
        StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
        ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
      });
    },
  });
  return new Promise((resolve, reject) => {
    cos.getObjectUrl(
      {
        Bucket: data.bucket,
        Region: data.region,
        Key: data.key,
        Sign: true /* 获取带签名的对象URL */,
      },
      (err, data) => {
        if (err) {
          // if (typeof cb === 'function') {
          //   cb(null);
          // }
          reject(err);
          return;
        }
        if (typeof cb === 'function') {
          // cb({ mediaId, url: data.Url });
          resolve({ mediaId, url: data.Url });
        }
      },
    );
  });
};
