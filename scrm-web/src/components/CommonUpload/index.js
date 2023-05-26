import Upload from './BaseUpload'

export { default as UploadImgBtn } from './UploadImgBtn'
export { default as UploadFileBtn } from './UploadFileBtn'
export { default as PictureUpload } from './PictureUpload'
export default Upload

export const UploadTips = ({ rules = [] }) => {
  const renderText = (ruleItem) => {
    if (typeof ruleItem === 'string') {
      return ruleItem
    }
    if (ruleItem.type === 'acceptType') {
      const list = Array.isArray(ruleItem.types) ? ruleItem.types : []
      return `仅支持上传${list.join()}类型文件`
    } else if (ruleItem.type === 'maxSize') {
      return `文件大小不超过${ruleItem.maxSize}M`
    } else {
      return ''
    }
  }
  return (
    <div>
      <ul>
        {rules.map((ruleItem, ruleIdx) => {
          return (
            <li key={ruleIdx}>
              {ruleIdx + 1}. {renderText(ruleItem)}
            </li>
          )
        })}
      </ul>
    </div>
  )
}