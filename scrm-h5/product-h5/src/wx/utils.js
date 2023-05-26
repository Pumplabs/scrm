import { WX_CB_KEY } from 'src/constants';

const { isMock } = window;
// 判断是否在微信打开
export const checkIsWechat = () => {
  const ua = navigator.userAgent.toLowerCase();
  const iswxwork = ua.indexOf('wxwork') > -1;
  return ua.indexOf('micromessenger') != -1 && !iswxwork;
};
export const checkIsWxWork = () => {
  const ua = navigator.userAgent.toLowerCase();
  const iswxwork = ua.indexOf('wxwork') > -1;
  return ua.indexOf('micromessenger') > -1 && iswxwork;
};
const getRuleItemRequired = (item, envArgs = {}) => {
  const { isOpenInWechat, isOpenIsWxWork } = envArgs;
  if (isOpenInWechat) {
    return item.wxRequired || item.required;
  } if (isOpenIsWxWork) {
    return item.wwRequired || item.required;
  }
  return item.required;
};
// 是否携带了必要参数
/**
 *
 * @param {Object} searchParams
 * @param {*} rules
 * @param {Array<Object>} rules
 * * @param {String} name 参数名称
 * * @param {Boolean} wxRequired 是否为微信端必须参数，可选
 * * @param {Boolean} wwRequired 是否为企微端必须参数，可选
 * * @param {Boolean} required 是否为微信端、企微端必须参数，可选，权重高于其它xxRequired
 * @returns
 */
export const checkHasCarrayNecessaryParams = (
  searchParams,
  options = {},
  rules = [],
) => {
  const { envArgs } = options;
  // 是否携带必要参数, 必须有search参数，如果为企微，则必须要有productId
  if (searchParams[WX_CB_KEY]) {
    return true;
  }
  if (rules.length) {
    return rules.every((item) => {
      const itemIsRequired = getRuleItemRequired(item, envArgs);
      return Reflect.has(searchParams, item.name) || itemIsRequired;
    });
  }
  return true;
};

/**
 * 判断访问环境是否合法
 * @param {Boolean} allowOpenWechat
 * @returns
 */
export const checkAccessEnv = (envArgs, options) => {
  const { isOpenInWechat, isOpenIsWxWork } = envArgs;
  const { allowOpenWechat, allowOpenWxWork } = options;
  if (isMock) {
    return true;
  }
  if (isOpenInWechat) {
    return allowOpenWechat;
  }
  if (isOpenIsWxWork) {
    return allowOpenWxWork;
  }
};
