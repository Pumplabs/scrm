import ArticleContent from './ArticleContent'
import FileContent from './FileContent'
import VideoContent from './VideoContent'
import TextContent from './TextContent'
import { MATERIAL_TYPE_EN_VALS } from '../../constants'
export default ({ data = {}, loading = false}) => {
  const contentProps = {
    data,
    loading
  }
  // 获取文件
  switch(data.type) {
    case MATERIAL_TYPE_EN_VALS.ARTICLE:
      return <ArticleContent {...contentProps}/>
    case MATERIAL_TYPE_EN_VALS.FILE:
      return <FileContent {...contentProps}/>
    case MATERIAL_TYPE_EN_VALS.VIDEO:
      return <VideoContent {...contentProps}/>
    case MATERIAL_TYPE_EN_VALS.LINK:
      return window.location.href = data.link
    case MATERIAL_TYPE_EN_VALS.TEXT:
      return <TextContent {...contentProps}/>
    default:
      return null
  }
}