import { PlayCircleOutlined, FileOutlined, FilePptOutlined,FileExcelOutlined, FilePdfOutlined,  FileWordOutlined } from '@ant-design/icons'
export default ({ data = {}, style = {}, ...rest }) => {
  const iconStyle = {
    fontSize: 40,
    ...style
  }
  const iconProps = {
    style: iconStyle,
    ...rest
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
      return <PlayCircleOutlined {...iconProps}/>
    default:
      return <FileOutlined {...iconProps}/>
  }
}