export const converTreeData = (list, fieldNames) => {
  const { childKey = 'children' } = fieldNames
  for (const item of list) {
    if (item[childKey]) {
      continue;
    }
    const opt = findAllTreeNodeByPid(item, list, fieldNames);
    const { surplusList: remainder, data } = opt;
    item._order = item.order
    item[childKey] = data.sort((a, b) => a.order - b.order);
    console.log("remainder", data)
    return converTreeData(remainder, fieldNames);
  }
  return list;
}

// 根据pid查找所有子节点
const findAllTreeNodeByPid = (data, list, fieldNames) => {
  const { pKey = 'parentId', key = 'id', childKey = 'children' } = fieldNames

  const child = list.filter(citem => `${citem[pKey]}` === `${data[key]}`);
  // 过滤父节点不为Pid的节点
  let surplusList = list.filter(citem => `${citem[pKey]}` !== `${data[key]}`);
  if (child.length === 0) {
    return {
      surplusList,
      data: []
    }
  }
  const arr = child.map((item) => {
    if (item[childKey]) {
      return item;
    }
    const opt = findAllTreeNodeByPid(item, surplusList, fieldNames);
    const { surplusList: remainder, data } = opt;
    surplusList = [...remainder];
    item._order = item.order
    item[childKey] = data.sort((a, b) => a.order - b.order)
    return item;
  });
  return {
    surplusList,
    data: arr
  }
}