import CommonModal from 'components/CommonModal'

export default ({ visible, data = {}, refresh, ...rest }) => {
  return (
    <CommonModal
      {...rest}
      destroyOnClose={true}
      okButtonProps={{
        style: {
          display: 'none',
        },
      }}
      visible={visible}
      cancelText="关闭"
      width={1000}
      >
        {
          data.mediaSuf === 'pdf' ? (
            <div
            style={{height: "calc(100vh - 100px)"}}
            >
            <embed src={data.filePath} style={{ width: "100%",height: "100%" }} />
          </div>
          ) : (
            <Nonsupport/>
          )
        }
    </CommonModal>
  )
}

const Nonsupport = () => {
  return (
    <div
    style={{padding: 40}}>
      此文件类型不支持预览
    </div>
  )
}