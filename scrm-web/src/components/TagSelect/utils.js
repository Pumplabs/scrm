export const convertTags = (tags, names) => {
  if (Array.isArray(tags)) {
    const hasName = Array.isArray(names) && names.length
    return tags.map((ele, idx) => {
      return {
        id: ele,
        extId: ele,
        name: hasName && names[idx] ? names[idx] : ele,
      }
    })
  } else {
    return []
  }
}