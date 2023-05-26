export function converToHtml(nodeList, root) {
  // 遍历节点JSON
  nodeList.forEach((item) => {
    let elem
    // 当为文本节点时
    if (typeof item === 'string') {
      elem = document.createTextNode(item)
    }
    // 当为普通节点时
    if (typeof item === 'object') {
      elem = document.createElement(item.tag)
      var fileId = ''
      if (item.tag === 'img') {
        var res = item.attrs.find((ele) => ele.name === 'data-href')
        if (res) {
          fileId = res.value
        }
      }
      item.attrs.forEach((attr) => {
        if (item.tag === 'img' && attr.name === 'src' && fileId) {
          var imgUrl =
            window.location.origin +
            '/api/common/downloadByFileId?fileId=' +
            fileId
          elem[attr.name] = imgUrl
        } else {
          elem[attr.name] = attr.value
        }
      })

      // 有子节点时递归将子节点加入当前节点
      if (item.children && item.children.length > 0) {
        converToHtml(item.children, elem.getRootNode())
      }
    }
    elem && root.appendChild(elem)
  })
}