import { encodeUrl } from 'src/tools';

const request = (options = {}) => {
  const {
    type = 'GET', url, params, headers,
  } = options;
  return new Promise((resolve, reject) => {
    // XMLHttpRequest对象用于在后台与服务器交换数据
    const xhr = new XMLHttpRequest();
    // var requestUrl = MyUtils.createLoginHref(url, data)
    xhr.open(type, url, false);
    if (headers) {
      for (const attr in headers) {
        xhr.setRequestHeader(attr, headers[attr]);
        // xhr.setRequestHeader('Content-Type', 'application/json')
      }
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        const { status } = xhr;
        let res = {};
        try {
          res = JSON.parse(xhr.responseText);
        } catch (e) {}
        if (status === 200 || status === 304) {
          resolve(res);
        } else {
          reject(res);
        }
      }
    };
    xhr.send(params);
  });
};
export function get(url, params, config = {}) {
  return request({
    type: 'GET',
    url: encodeUrl(url, params),
    ...config,
  });
}
export function post(url, params, config = {}) {
  return request({
    type: 'POST',
    url,
    params: params ? JSON.stringify(params) : '',
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });
}
