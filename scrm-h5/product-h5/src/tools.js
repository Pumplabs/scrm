// 拼接url参数
const joinSearchStr = (str, name, value) => {
  const nextStr = value || value === 0 ? `${name}=${value}` : `${name}`;
  return str ? `${str}&${nextStr}` : nextStr;
};
// 加密url参数
export const encodeSearchParams = (params) => {
  let str = '';
  if (params && typeof params === 'object') {
    if (Array.isArray(params)) {
      params.forEach((item) => {
        str = joinSearchStr(str, item.name, item.value);
      });
    } else {
      for (const attr in params) {
        str = joinSearchStr(str, attr, params[attr]);
      }
    }
  }
  return str;
};
/**
 * 加密url
 * @param {String} url 参数
 * @param {Object|Array} params 参数
 * @returns
 */
export const encodeUrl = (url, params) => {
  const parStr = encodeSearchParams(params);
  if (!parStr) {
    return url;
  }
  if (url.endsWith('?')) {
    return `${url}${parStr}`;
  } if (url.includes('?')) {
    return url.endsWith('&') ? `${url}${parStr}` : `${url}&${parStr}`;
  }
  return url ? `${url}?${parStr}` : parStr;
};
// 解码url参数信息
export const decodeSearchParams = (str) => {
  const arr = str.split('&');
  let opt = {};
  arr.forEach((ele) => {
    const [label, val] = ele.split('=');
    opt = {
      ...opt,
      [label]: val,
    };
  });
  return opt;
};

/**
 * 格式化数值
 * @param {*} num
 * @param {*} config
 * @returns
 */
export const formatNumber = (num = 0, config = {}) => {
  const { padPrecision = 0 } = config;
  const str = `${num}`;
  const isNum = str.length > 0 && !Number.isNaN(str[0]);
  if (isNum) {
    const [intNum, floatNum = ''] = `${num}`.split('.');
    let str = '';
    let len = 0;
    for (let i = intNum.length - 1; i >= 0; i--) {
      const item = intNum[i];
      len++;
      const splitCode = len % 3 === 0 && i !== 0 ? ',' : '';
      str = `${splitCode}${item}${str}`;
    }
    const floatStr = padPrecision ? floatNum.padEnd(padPrecision, 0) : floatNum;
    return `${str}${floatStr ? `.${floatStr}` : ''}`;
  }
  return num;
};
