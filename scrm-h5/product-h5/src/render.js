import { formatNumber } from './tools';
import productSpace from './data';

export const converToHtml = (nodeList, root) => {
  // 遍历节点JSON
  nodeList.forEach((item) => {
    let elem;
    // 当为文本节点时
    if (typeof item === 'string') {
      elem = document.createTextNode(item);
    }
    // 当为普通节点时
    if (typeof item === 'object') {
      elem = document.createElement(item.tag);
      let fileId = '';
      if (item.tag === 'img') {
        const res = item.attrs.find((ele) => ele.name === 'data-href');
        if (res) {
          fileId = res.value;
        }
      }
      item.attrs.forEach((attr) => {
        if (item.tag === 'img' && attr.name === 'src' && fileId) {
          const imgUrl = `/api/common/downloadByFileId?fileId=${
            fileId}`;
          elem[attr.name] = imgUrl;
        } else {
          elem[attr.name] = attr.value;
        }
      });

      // 有子节点时递归将子节点加入当前节点
      if (item.children && item.children.length > 0) {
        converToHtml(item.children, elem.getRootNode());
      }
    }
    if (elem) {
      root.appendChild(elem);
    }
  });
};

export const drawPageError = () => {
  document.body.innerHTML = '错误';
};
export const drawPageException = (text = '异常') => {
  document.body.innerHTML = text;
};

export const drawProductInfo = (data = {}) => {
  const contentEle = document.getElementById('product-content');
  contentEle.style.display = 'block';
  document.getElementById('product-name').innerHTML = data.name;
  document.getElementById('product-price').innerHTML = `￥${formatNumber(data.price)}`;
  document.getElementById('product-category').innerHTML = data.productType
    ? data.productType.name
    : '';
  document.getElementById('views-count').innerHTML = data.views || 0;
  document.getElementById('product-code').innerHTML = data.code;
  const attrContent = document.getElementById('product-attr');
  const picsList = Array.isArray(data.atlas) ? data.atlas : [];
  // 如果有产品图
  if (picsList.length) {
    renderPics(picsList);
  }
  // 属性
  if (Array.isArray(data.imbue) && data.imbue) {
    data.imbue.forEach((attrItem) => {
      const attrInfo = document.createElement('div');
      attrInfo.className = 'product-attr-info';
      const attrLabel = document.createElement('div');
      attrLabel.className = 'product-attr-label';
      attrLabel.innerHTML = attrItem.name;
      const attrValue = document.createElement('div');
      attrValue.className = 'product-attr-value';
      attrValue.innerHTML = attrItem.value;
      attrInfo.appendChild(attrLabel);
      attrInfo.appendChild(attrValue);
      attrContent.appendChild(attrInfo);
    });
  }
  if (Array.isArray(data.description)) {
    converToHtml(data.description, document.getElementById('description'));
  }
};

/**
 * 根据滑动方向计算滑动的数量
 * @param {*} newValue
 * @param {*} oldValue
 * @returns
 */
function calcMoveCountByDirection(newValue, oldValue) {
  const screenWidth = window.screen.width;
  const n = Math.abs(newValue) / screenWidth;
  const intNum = Math.floor(n);
  // 左滑
  if (newValue > oldValue) {
    // return intNum - 1
    return intNum;
    // return Math.max(intNum - 1, 0)
  } if (newValue < oldValue) {
    // 右滑
    return intNum + 1;
    // return Math.min(intNum+1, maxN - 1)
  }
  // return Math.min(intNum, maxN - 1)
  return intNum;
}
/**
 * 计算滑动过的数量
 * @param {Number} newValue 当前位置
 * @param {Number} oldValue 上一次的位置
 * @returns
 */
function calcMoveCount(newValue, oldValue) {
  const screenWidth = window.screen.width;
  // 划过了多少个整个
  const n = Math.abs(newValue) / screenWidth;
  const intNum = Math.floor(n);
  const floatNum = n - intNum;
  // 左滑小于0.4则算新
  if (newValue > oldValue) {
    return floatNum < 0.6 ? intNum : intNum + 1;
  }
  // 右滑0.7则算新一个
  return floatNum >= 0.6 ? intNum + 1 : intNum;
}
export const renderPics = (pics) => {
  const picLen = pics.length;
  const screenWidth = window.screen.width;
  const ulEle = document.getElementById('product-pics-ul');
  ulEle.style.width = `${picLen * 100}vw`;
  document.getElementById('pager-total').innerHTML = picLen;
  document.getElementById('pager-current').innerHTML = 1;
  pics.forEach((picEle) => {
    const liEle = document.createElement('li');
    liEle.className = 'img-wrap';
    const imgEle = document.createElement('img');
    // imgEle.src =
    //   productSpace.baseHost + '/api/common/downloadByFileId?fileId=' + picEle.id
    imgEle.src = `/api/common/downloadByFileId?fileId=${picEle.id}`;
    liEle.appendChild(imgEle);
    ulEle.appendChild(liEle);
  });
  // 添加事件
  ulEle.ontouchstart = function (e) {
    const { clientX, clientY } = e.touches[0];
    // touches：表示当前跟踪的触摸操作的touch对象的数组。
    // targetTouches：特定于事件目标的Touch对象的数组。
    // changeTouches：表示自上次触摸以来发生了什么改变的Touch对象的数组。
    productSpace.touchInfo = {
      startTime: Date.now(),
      baseLeft: parseInt(ulEle.style.left || 0),
      startX: clientX,
      startY: clientY,
    };
  };
  ulEle.ontouchmove = function (e) {
    e.preventDefault();
    const { clientX } = e.touches[0];
    const diffX = clientX - productSpace.touchInfo.startX;
    let nextUlLeft = productSpace.touchInfo.baseLeft + diffX;
    nextUlLeft = nextUlLeft > 0 ? 0 : nextUlLeft;
    productSpace.touchInfo.x = clientX;
    productSpace.touchInfo.left = nextUlLeft;
    ulEle.style.left = `${nextUlLeft}px`;
  };
  ulEle.ontouchend = function (e) {
    const times = Date.now() - productSpace.touchInfo.startTime;
    const oldLeft = productSpace.touchInfo.baseLeft;
    const newLeft = productSpace.touchInfo.left;
    // 如果滑动时间小于1秒，则默认为翻页处理
    let n = times <= 500
      ? calcMoveCountByDirection(newLeft, oldLeft)
      : calcMoveCount(newLeft, oldLeft);
    n = Math.min(Math.max(0, n), picLen - 1);
    // 判断当前滑动到第几个图片
    const left = n * screenWidth;
    ulEle.style.left = `-${left}px`;
    document.getElementById('pager-current').innerHTML = n + 1;
    productSpace.touchInfo = {};
  };
};
