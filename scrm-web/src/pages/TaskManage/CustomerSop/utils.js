export const getMediaIdsByRules = (ruleList) => {
  let mediaIds = []
  if (Array.isArray(ruleList)) {
    ruleList.forEach((ele) => {
      if (Array.isArray(ele.msg.media)) {
        ele.msg.media.forEach((mediaItem) => {
          if (mediaItem.file && mediaItem.file.id) {
            mediaIds = [...mediaIds, mediaItem.file.id]
          }
        })
      }
    })
  }
  return mediaIds
}