import dataMap from './data';
import { GetMeterialInfo, AddMediaLog, UpdateMediaLog } from './services';
import { checkIsWechat } from './wx/utils';
import { drawPageError, drawPageException, renderMediaContent } from './render';
import wxConfig from './wx';
import { LOCAL_KEY, SUCCESS_CODE } from './constants';
import './index.less';

function updateUserLog(times) {
  const { userInfo } = dataMap;
  console.log("updateUserLog");
  console.log("dataMap", dataMap);
  UpdateMediaLog({
    id: dataMap.logId,
    time: times > 0 ? times : (Date.now() - dataMap.time) / 1000,
    corpId: userInfo.extCorpId
  });
}

const addUserLog = (params) => {
  AddMediaLog(params).then((res) => {
    if (res.code === SUCCESS_CODE && res.data) {
      dataMap.logId = res.data.id;
      dataMap.time = Date.now();
      updateUserLog(1);
      dataMap.timer = setInterval(updateUserLog, 3 * 1000);
    }
  });
};
const getAndRenderFileInfo = (params) => {
  GetMeterialInfo(params)
    .then((res) => {
      if (res.code === SUCCESS_CODE && res.data) {
        const isOpenInWechat = checkIsWechat();
        const { userInfo } = dataMap;
        console.log("dataMap", dataMap);
        console.log("isOpenInWechat", isOpenInWechat);
        userInfo.extId = localStorage.getItem("extId")
        userInfo.extCorpId = res.data.extCorpId
        if (isOpenInWechat && userInfo.extId) {
          addUserLog({
            extStaffId: userInfo.staffId,
            mediaInfoId: userInfo.materialId,
            customerExtId: userInfo.extId,
            corpId: res.data.extCorpId,
          });
        }
        renderMediaContent(res.data);
      } else {
        drawPageException(res.msg);
      }
    })
    .catch((err) => {
      drawPageException(err.msg);
    });
};

function renderByWx(type, { searchParams = {}, customerInfo = {} } = {}) {
  dataMap.userInfo = {
    staffId: searchParams.staffId,
    materialId: searchParams.materialId,
  };
  switch (type) {
    case 'accessIllegal':
      document.getElementById('source-error').style.display = 'block';
      break;
    case 'noNecessaryParams':
      return drawPageException();
    case 'customerInfoSuccess':
      dataMap.userInfo.extId = customerInfo.extId;
      localStorage.setItem(LOCAL_KEY, customerInfo.extId);
      getAndRenderFileInfo({
        id: searchParams.materialId,
      });
      break;
    case 'customerInfoError':
      drawPageError();
      break;
    case 'openIsWxWork':
    case 'noCode':
    case 'existStorage':
    case 'authCancel':
      getAndRenderFileInfo({
        id: searchParams.materialId,
      });
      break;
    default:
      break;
  }
}
window.onload = function () {
  wxConfig({
    allowOpenWechat: true,
    allowOpenWxWork: true,
    render: renderByWx,
    pageUrl: `${dataMap.baseHost}${window.location.pathname}`,
  });
};
window.onbeforeunload = function () {
  if (dataMap.timer) {
    clearInterval(dataMap.timer);
    dataMap.timer = null;
  }
};
