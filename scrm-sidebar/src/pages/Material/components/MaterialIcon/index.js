import { isEmpty } from 'lodash'
import { VideoOutline,FileOutline, PlayOutline, LinkOutline, TextOutline } from 'antd-mobile-icons'
import {
  FilePptOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileWordOutlined,
} from '@ant-design/icons'
import circleMinAppUrl from 'src/assets/images/circleMinApp.png'
import { MATERIAL_TYPE_EN_VALS } from 'src/pages/Material/constants'

const covertStyle = (data = {}) => {
  if (isEmpty(data)) {
    return {}
  }
  let res = {}
  for(const attr in data) {
    const val = data[attr]
    if (typeof val === 'number') {
      res[attr] = `${val / 3.75}vw`
    } else {
      res[attr] = val
    }
  }
  return res
}
export default ({ data = {}, className, size = 40, style = {} }) => {
  const eleProps = {
    className,
    style: covertStyle(style)
  }
  const fontIconProps = {
    style: covertStyle({
      fontSize: size
    })
  }
  const imgProps = {
    className,
    style: covertStyle({
      width: size,
      height: size,
      ...style,
    })
  }
  switch (data.type) {
    case MATERIAL_TYPE_EN_VALS.FILE:
      return (
        <div {...eleProps}>
          <FileIcon data={data} size={size} />
        </div>
      )
    case MATERIAL_TYPE_EN_VALS.TEXT:
      return (
        <div {...eleProps}>
          <TextOutline {...fontIconProps}/>
        </div>
      )
    case MATERIAL_TYPE_EN_VALS.VIDEO:
      return (
        <div {...eleProps}>
          <PlayOutline  {...fontIconProps} />
        </div>
      )
    case MATERIAL_TYPE_EN_VALS.MINI_APP:
      return (
        <img
          alt=""
          src={circleMinAppUrl}
          {...imgProps}
        />
      )
    default:
      return data.filePath ? (
        <img
          alt=""
          src={data.filePath}
          {...imgProps}
        />
      ) : (
        <div {...eleProps}>
          <LinkOutline  {...fontIconProps} />
        </div>
      )
  }
}
const FileIcon = ({ data = {}, style = {}, size }) => {
  const iconProps = {
    style: covertStyle({
      ...style,
      fontSize: size
    })
  }
  switch (data.mediaSuf) {
    case 'ppt':
    case 'pptx':
      return <FilePptOutlined {...iconProps} />
    case 'xls':
    case 'xlsx':
      return <FileExcelOutlined {...iconProps} />
    case 'pdf':
      return <FilePdfOutlined {...iconProps} />
    case 'doc':
    case 'docx':
      return <FileWordOutlined {...iconProps} />
    case 'mp4':
      return <VideoOutline {...iconProps} />
    default:
      return <FileOutline {...iconProps} />
  }
}
