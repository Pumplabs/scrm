import dataMap from './data';
import { GetProductInfo, AddProductView } from './services';
import { drawProductInfo, drawPageError, drawPageException } from './render';
import wxConfig from './wx';
import { LOCAL_KEY } from './constants';
import './index.less';

export { ExplicitAuthLogin, SilentAuthLogin, GetCustomerInfo } from 'src/wx/api';

const showLoading = () => {
  document.getElementById('loading-text').style = 'display:block';
};
const hideLoading = () => {
  document.getElementById('loading-text').style = 'display:none';
};
const getAndRenderProductInfo = (params) => {
  showLoading();
  GetProductInfo(params)
    .then((res) => {
      hideLoading();
      const template = `
      <div class="product-content" id="product-content">
      <div class="product-pics" id="product-pics">
        <ul class="product-pic-content" id="product-pics-ul"></ul>
        <div class="pic-pager">
          <span id="pager-current">0</span>
          /
          <span id="pager-total">0</span>
        </div>
      </div>
      <div class="product-infos">
      <div class="product-name-info">
      <h6 class="product-name" id="product-name"></h6>
      <span class="product-price" id="product-price"></span>
    </div>
    <div class="product-category-info">
      <span class="product-category" id="product-category"></span>
      <span class="views">
        浏览：
        <span class="views-count" id="views-count">0</span>
      </span>
    </div>
    <div class="product-code-info">
      <span class="product-code-label">产品编码</span>
      <span class="product-code-value" id="product-code"> </span>
    </div>
    <div class="product-attr" id="product-attr"></div>
    <div class="product-desc" id="description"></div>
    </div>
    </div>
    `;
      document.body.innerHTML = template;
      if (res.code === 0 && res.data) {
        drawProductInfo(res.data);
        AddProductView(params);
      } else {
        dataMap.drawPageException(res.msg);
      }
    })
    .catch((err) => {
      hideLoading();
      drawPageException(err.msg);
    });
};

function renderByWx(type, { searchParams = {}, customerInfo = {} }) {
  dataMap.userInfo = {
    staffId: searchParams.staffId,
    productId: searchParams.productId,
  };
  switch (type) {
    case 'accessIllegal':
      drawPageException('请在微信端打开');
      // document.getElementById('source-error').style.display = 'block'
      break;
    case 'noNecessaryParams':
      return drawPageException();
    case 'customerInfoSuccess':
      dataMap.userInfo.extId = customerInfo.extId;
      localStorage.setItem(LOCAL_KEY, customerInfo.extId);
      getAndRenderProductInfo({
        id: searchParams.productId,
      });
      break;
    case 'customerInfoError':
      drawPageError();
      break;
    case 'openIsWxWork':
    case 'noCode':
    // getAndRenderProductInfo({
    //   id: searchParams.productId,
    // })
    // break;
    case 'existStorage':
    // getAndRenderProductInfo({
    //   id: searchParams.productId,
    // })
    // break;
    case 'authCancel':
      getAndRenderProductInfo({
        id: searchParams.productId,
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
