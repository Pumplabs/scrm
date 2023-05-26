export { default as TagFormList } from './TagFormList'
export const handleTagsParams = (tags = [], oldTagArr = []) => {
  const oldTags = Array.isArray(oldTagArr) ? oldTagArr : []
  let addList = []
  let editList = []
  let removeIds = []
  let noChangeList = []
  let noRemoveOldIds = []
  tags.forEach((tagItem, tagIdx) => {
    const newOrder = tagIdx + 1
    const tagValue = { order: newOrder, name: tagItem.name }
    if (tagItem.id) {
      noRemoveOldIds = [...noRemoveOldIds, tagItem.id]
      const oldItem = oldTags.find((oldItem) => oldItem.id === tagItem.id)
      if (oldItem) {
        if (oldItem.order !== newOrder || oldItem.name !== tagItem.name) {
          editList = [
            ...editList,
            {
              id: tagItem.id,
              order: newOrder,
              name: tagItem.name,
            },
          ]
        } else {
          noChangeList = [
            ...noChangeList,
            {
              id: tagItem.id,
              order: oldItem.order,
              name: tagItem.name,
            },
          ]
        }
      }
    } else {
      addList = [...addList, tagValue]
    }
  })
  if (noRemoveOldIds.length !== oldTags.length) {
    oldTags.forEach((oldItem) => {
      // 如果这个标签不存在了
      if (!noRemoveOldIds.includes(oldItem.id)) {
        removeIds = [...removeIds, oldItem.id]
      }
    })
  }
  return {
    addList,
    editList,
    removeIds,
    noChangeList
  }
}
