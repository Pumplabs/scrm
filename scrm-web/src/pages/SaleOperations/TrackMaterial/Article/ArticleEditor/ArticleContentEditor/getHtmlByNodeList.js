/**
 * @description 从nodeList json格式中遍历生成dom元素
 */

 import E from 'wangeditor'
const { $ } = E

export function refillHtmlByNodeList(nodeList, parent, urls = {}) {
  if (!parent || !Array.isArray(nodeList)) {
    return;
  }
   let root = parent

   // 遍历节点JSON
   nodeList.forEach(item => {
       let elem

       // 当为文本节点时
       if (typeof item === 'string') {
           elem = document.createTextNode(item)
       }

       // 当为普通节点时
       if (typeof item === 'object') {
           elem = document.createElement(item.tag)
           let fileId = ''
          if (item.tag === 'img') {
            const attrItem = item.attrs.find(attr => attr.name === 'data-href')
            fileId = attrItem ? attrItem.value : ''
          }
           item.attrs.forEach(attr => {
               if (item.tag === 'img' && attr.name === 'src' && fileId) {
                $(elem).attr(attr.name, urls[fileId])
               } else {
                $(elem).attr(attr.name, attr.value)
               }
           })

           // 有子节点时递归将子节点加入当前节点
           if (item.children && item.children.length > 0) {
             refillHtmlByNodeList(item.children, elem.getRootNode(), urls)
           }
       }
       elem && root.appendChild(elem)
   })
}

function getHtmlByNodeList(
    nodeList = [],
    parent
) {
    // 设置一个父节点存储所有子节点
    let root = parent

    // 遍历节点JSON
    nodeList.forEach(item => {
        let elem

        // 当为文本节点时
        if (typeof item === 'string') {
            elem = document.createTextNode(item)
        }

        // 当为普通节点时
        if (typeof item === 'object') {
            elem = document.createElement(item.tag)
            item.attrs.forEach(attr => {
                $(elem).attr(attr.name, attr.value)
            })

            // 有子节点时递归将子节点加入当前节点
            if (item.children && item.children.length > 0) {
                getHtmlByNodeList(item.children, elem.getRootNode())
            }
        }
        elem && root.appendChild(elem)
    })
    return $(root)
}

export default getHtmlByNodeList
