import { get } from 'lodash'
export const handleFormValsChange = (vals, form) => {
  const { files = [] } = vals
  let updateVals = {
    ...vals,
  }
  if (Array.isArray(files) && files.length > 0) {
    const [file] = files
    const fileName = get(file, 'content.name') || ''
    const title = form.getFieldValue('title')
    const nextFileName = fileName ? fileName.substr(0, 20): ''
    if (!title && fileName) {
      updateVals = {
        ...updateVals,
        title: nextFileName
      }
      form.setFieldsValue({
        title: nextFileName,
      })
    }
  }
  return updateVals
}
