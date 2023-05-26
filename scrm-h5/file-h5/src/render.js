import dataMap from './data';
import { GetPreviewInfo, GetCosUrl } from './services';

function converToHtml(nodeList, root) {
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
          const imgUrl = `${dataMap.baseHost}/api/common/downloadByFileId?fileId=${fileId}`;
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
}

export const drawPageError = () => {
  // document.body.innerHTML = '错误';
  const emptyEle = document.createElement('div');
  emptyEle.className = 'empty';
  const emptyIcon = document.createElement('p');
  emptyIcon.className = 'empty-emoji';
  emptyIcon.innerHTML = '╥﹏╥...';
  const emptyDesc = document.createElement('p');
  emptyDesc.className = 'empty-description';
  emptyDesc.innerHTML = '界面出现了一些小状况';
  emptyEle.appendChild(emptyIcon);
  emptyEle.appendChild(emptyDesc);
  document.body.appendChild(emptyEle);
};

// text = '异常'
export const drawPageException = () => {
  // document.body.innerHTML = text;
  const emptyEle = document.createElement('div');
  emptyEle.className = 'empty';
  const emptyIcon = document.createElement('p');
  emptyIcon.className = 'empty-emoji';
  emptyIcon.innerHTML = '╥﹏╥...';
  const emptyDesc = document.createElement('p');
  emptyDesc.className = 'empty-description';
  emptyDesc.innerHTML = '界面访问地址不正确';
  emptyEle.appendChild(emptyIcon);
  emptyEle.appendChild(emptyDesc);
  document.body.appendChild(emptyEle);
};
function drawFileContent(url) {
  const containerEle = document.getElementById('container');
  const imgEle = document.createElement('img');
  imgEle.src = url;
  containerEle.appendChild(imgEle);
}

function drawFile(data) {
  GetPreviewInfo({
    id: data.fileId,
  }).then((res) => {
    if (res.data) {
      res.data.previewPathList.forEach((keyItem) => {
        GetCosUrl({
          mediaId: dataMap.userInfo.materialId,
        }, {
          ...res.data,
          key: keyItem,
        }).then((cosRes) => {
          drawFileContent(cosRes.url);
        }).catch((err) => {
          drawPageError();
        });
      });
    }
  });
}
// 视频
function drawVideo(data) {
  const containerEle = document.getElementById('container');
  const ele = document.createElement('video');
  ele.src = `${dataMap.baseHost}/api/common/downloadByFileId?fileId=${data.fileId}`;
  ele.controls = 'controls';
  ele.autoplay = 'autoplay';
  const titleEle = document.createElement('div');
  titleEle.className = 'video-title';
  titleEle.innerHTML = data.title;
  const titleDescriptionEle = document.createElement('div');
  titleDescriptionEle.className = 'video-description';
  titleDescriptionEle.innerHTML = data.description;
  containerEle.appendChild(titleEle);
  containerEle.appendChild(titleDescriptionEle);
  containerEle.appendChild(ele);
}
// 链接
function drawLink(data) {
  // 跳转到对应地址
  window.location.href = data.link;
}
// 文章
function drawArticle(data) {
  const articleBox = document.createElement('div');
  articleBox.className = 'article';
  // 文章标题
  const articleTitleEle = document.createElement('p');
  articleTitleEle.className = 'article-title';
  articleTitleEle.innerHTML = data.title;
  // 文章摘要
  const articleAbstractEle = document.createElement('p');
  articleAbstractEle.innerHTML = data.summary;
  articleAbstractEle.className = 'article-abstract';
  // 文章内容
  const articleBodyEle = document.createElement('div');
  articleBodyEle.className = 'article-body';
  converToHtml(data.richText, articleBodyEle);
  // articleBodyEle.innerHTML = '文章内容'
  articleBox.appendChild(articleTitleEle);
  articleBox.appendChild(articleAbstractEle);
  articleBox.appendChild(articleBodyEle);
  document.getElementById('container').appendChild(articleBox);
}
export const renderMediaContent = (data) => {
  switch (data.type) {
    case 8:
      drawFile(data);
      break;
    // 视频
    case 6:
      drawVideo(data);
      break;
    // 链接
    case 7:
      drawLink(data);
      break;
    // 文章
    case 5:
      drawArticle(data);
      break;
    default:
      break;
  }
};
