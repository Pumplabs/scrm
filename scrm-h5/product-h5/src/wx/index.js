import { decodeSearchParams } from 'src/tools';
import {
  LOCAL_KEY, SUCCESS_CODE, WX_CB_KEY, PARAMS_RULE,
} from 'src/constants';
import { ExplicitAuthLogin, GetAuthInfo, GetCustomerInfo } from './api';
import {
  checkIsWechat,
  checkIsWxWork,
  checkAccessEnv,
  checkHasCarrayNecessaryParams,
} from './utils';

const getEnvData = () => {
  const isOpenIsWxWork = checkIsWxWork();
  const isOpenInWechat = checkIsWechat();
  return {
    isOpenIsWxWork,
    isOpenInWechat,
  };
};

const wxDefaultRender = (type) => {
  // { searchParams = {}, customerInfo = {} }
  switch (type) {
  //  访问非法
    case 'accessIllegal':
      break;
    // 没有携带必要信息
    case 'noNecessaryParams':
      break;
    // 成功获取用户信息
    case 'customerInfoSuccess':
      break;
    // 获取用户信息错误
    case 'customerInfoError':
      break;
    // 在企微中打开
    case 'openIsWxWork':
      break;
    // url没有code
    case 'noCode':
      break;
    // 本地有信息（上次登录过）
    case 'existStorage':
      break;
    // 用户拒绝授权
    case 'authCancel':
      break;
    default:
      break;
  }
};

/**
 * @param {Object} 配置项
 * * @param {Boolean} allowOpenWxWork 允许在企业微信打开
 * * @param {Boolean} allowOpenWechat 允许在微信打开
 * * @param {Function} render
 * * @param {String} pageUrl 授权成功回调界面
 */
export default (options = {}) => {
  const {
    allowOpenWechat = true,
    allowOpenWxWork = true,
    render,
    pageUrl,
  } = options;
  const locSearch = window.location.search;
  const searchText = locSearch ? locSearch.slice(1) : '';
  const searchParams = decodeSearchParams(searchText);
  const envArgs = getEnvData();

  const renderFn = (type, data) => {
    if (typeof render === 'function') {
      render(type, data);
    } else {
      wxDefaultRender(type, data);
    }
  };
  if (
    !checkAccessEnv(envArgs, {
      allowOpenWechat,
      allowOpenWxWork,
    })
  ) {
    renderFn('accessIllegal', { searchParams });
    return;
  }

  // 是否携带必要参数, 必须有search参数，如果为企微，则必须要有productId
  const hasCarrayNecessaryParams = checkHasCarrayNecessaryParams(
    searchParams,
    {
      envArgs,
    },
    PARAMS_RULE,
  );
  // 如果没有携带必要参数
  if (!hasCarrayNecessaryParams) {
    renderFn('noNecessaryParams', {
      searchParams,
    });
    return;
  }
  // 如果在企微打开，不需要授权，直接访问
  if (envArgs.isOpenIsWxWork) {
    return renderFn('openIsWxWork', {
      searchParams,
    });
  }
  // 否则默认为微信端打开
  // 如果有search参数，代表授权回调界面
  if (searchParams[WX_CB_KEY]) {
    const newParams = {
      ...searchParams,
      ...decodeSearchParams(decodeURIComponent(searchParams[WX_CB_KEY])),
    };
    if (searchParams.code) {
      // 如果当前地址栏带了code,表示为授权成功的回调界面
      GetCustomerInfo({
        code: newParams.code,
      }).then((res) => {
        if (res.code === SUCCESS_CODE && res.data) {
          renderFn('customerInfoSuccess', {
            customerInfo: res.data,
            searchParams: newParams,
          });
        } else {
          renderFn('customerInfoError', {
            searchParams: newParams,
          });
        }
      });
    } else {
      // 用户没授权，则直接访问界面
      return renderFn('noCode', {
        searchParams: newParams,
      });
    }
  } else {
    // 如果本地已经存了extId
    if (localStorage.getItem(LOCAL_KEY)) {
      return renderFn('existStorage', {
        searchParams,
      });
    }
    GetAuthInfo().then((res) => {
      if (res.code === 0 && res.data) {
        const { data } = res;
        const redirectUrl = `${pageUrl}?${WX_CB_KEY}=${encodeURIComponent(
          searchText,
        )}`;
        ExplicitAuthLogin({
          appId: data,
          redirectUrl,
        }).then(() => {
          renderFn('authCancel', {
            searchParams,
          });
        });
      }
    });
  }
};
