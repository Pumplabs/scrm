import TextItem from './TextItem'
import ImgItem from './ImgItem'
import LinkItem from './LinkItem'
import AppItem from './AppItem'
import VideoItem from './VideoItem'
import { MEDIA_MSG_TYPES } from 'components/MsgSection/constants'

const MsgItem = ({data = {} }) => {
  switch (data.type) {
    case MEDIA_MSG_TYPES.APP:
      return <AppItem data={data.content}/>
    case MEDIA_MSG_TYPES.IMAGE:
      return <ImgItem data={data.content}/>
    case MEDIA_MSG_TYPES.LINK:
      return <LinkItem data={data.content}/>
    case MEDIA_MSG_TYPES.MYLINK:
      return (
        <LinkItem
          data={{
            ...data.content,
            name: data.content.title,
            info: data.content.description,
          }}
        />
      )
    case MEDIA_MSG_TYPES.TEXT:
      return <TextItem text={data.text} />
    case MEDIA_MSG_TYPES.VIDEO:
      return <VideoItem data={data.content}/>
    default:
      return null
  }
}

export default MsgItem