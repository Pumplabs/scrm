import PosterDetail from 'pages/SaleOperations/OrdinaryMaterial/Poster/DetailDrawer'
import ImageDetail from 'pages/SaleOperations/OrdinaryMaterial/Images/DetailDrawer'
import TextDetail from 'pages/SaleOperations/OrdinaryMaterial/Text/DetailDrawer'
import ArticleDetail from 'pages/SaleOperations/TrackMaterial/Article/ArticleDetailDrawer'
import VideoDetail from 'pages/SaleOperations/TrackMaterial/Video/DetailDrawer'
import LinkDetail from 'pages/SaleOperations/TrackMaterial/Link/DetailDrawer'
import FilesDetail from 'pages/SaleOperations/TrackMaterial/Files/DetailDrawer'
import { MATERIAL_TYPE_EN_VALS } from 'pages/SaleOperations/constants'
export default ({ data = {}, ...rest }) => {
  const props = {
    data,
    ...rest
  }
  switch (data.type) {
    case MATERIAL_TYPE_EN_VALS.POSTER:
      return <PosterDetail {...props}/>
    case MATERIAL_TYPE_EN_VALS.PICTUER:
      return <ImageDetail {...props}/>
    case MATERIAL_TYPE_EN_VALS.TEXT:
      return <TextDetail {...props}/>
    case MATERIAL_TYPE_EN_VALS.ARTICLE:
      return <ArticleDetail {...props}/>
    case MATERIAL_TYPE_EN_VALS.VIDEO:
      return <VideoDetail {...props}/>
    case MATERIAL_TYPE_EN_VALS.LINK:
      return <LinkDetail {...props}/>
    case MATERIAL_TYPE_EN_VALS.FILE:
      return <FilesDetail {...props}/>
    default:
      return null
  }
}
