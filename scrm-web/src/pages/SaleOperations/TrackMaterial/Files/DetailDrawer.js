import React, { useEffect, useState } from 'react'
import CommonDrawer from 'components/CommonDrawer'
import TagCell from 'components/TagCell'
import DescriptionsList from 'components/DescriptionsList'
import FileViewModal from './FileViewModal'
import FileIcon from './FileIcon'

export default (props) => {
  const { data = {}, onOk, visible, ...rest } = props
  const [fileVisible, setFileVisible] = useState(false)

  useEffect(() => {
    if (!visible) {
      setFileVisible(false)
    }
  }, [visible])

  return (
    <CommonDrawer visible={visible} footer={null} {...rest}>
      <FileViewModal
        title={data.title}
        data={data}
        visible={fileVisible}
        onCancel={() => {
          setFileVisible(false)
        }}
      />
      {/* TODO: 预览文件 */}
      <DescriptionsList.Item label="文件">
        <FileIcon
          data={data}
          onClick={() => {
            setFileVisible(true)
          }}
        />
        {/* <FileVier
        type={data.mediaSuf}
        url={data.filePath}
        /> */}
      </DescriptionsList.Item>
      <DescriptionsList.Item label="文件名">{data.title}</DescriptionsList.Item>
      <DescriptionsList.Item label="文件描述">
        {data.description}
      </DescriptionsList.Item>
      <DescriptionsList.Item label="分类标签">
        <TagCell dataSource={data.mediaTagDetailList} maxHeight="auto" />
      </DescriptionsList.Item>
      <DescriptionsList.Item label="动态通知">
        {data.hasInform ? '开启' : '关闭'}
      </DescriptionsList.Item>
      <DescriptionsList.Item label="客户标签">
        <TagCell dataSource={data.wxTagDetailList} maxHeight="auto" />
      </DescriptionsList.Item>
      <DescriptionsList.Item label="发送次数">
        {data.sendNum ? data.sendNum : 0}
      </DescriptionsList.Item>
      <DescriptionsList.Item label="浏览次数">
        {data.lookNum ? data.lookNum : 0}
      </DescriptionsList.Item>
    </CommonDrawer>
  )
}
