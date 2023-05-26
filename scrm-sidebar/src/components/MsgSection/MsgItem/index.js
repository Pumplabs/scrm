import LinkCell from './components/LinkItem'
import TextCell from './components/TextItem'
import ImgCell from './components/ImgItem';
import AppCell from './components/AppItem'
import VideoCell from './components/VideoItem'
import { MEDIA_MSG_TYPES } from '../constants'

const MsgItem = ({data = {} }) => {
  switch (data.type) {
    case MEDIA_MSG_TYPES.APP:
      return <AppCell data={data.content}/>
    case MEDIA_MSG_TYPES.IMAGE:
      return <ImgCell data={data.content}/>
    case MEDIA_MSG_TYPES.LINK:
      return <LinkCell data={data.content}/>
    case MEDIA_MSG_TYPES.MYLINK:
      return (
        <LinkCell
          data={{
            ...data.content,
            name: data.content.title,
            info: data.content.description,
          }}
        />
      )
    case MEDIA_MSG_TYPES.TEXT:
      return <TextCell text={data.text} />
    case MEDIA_MSG_TYPES.VIDEO:
      return <VideoCell data={data.content}/>
    default:
      return null
  }
}

export default MsgItem