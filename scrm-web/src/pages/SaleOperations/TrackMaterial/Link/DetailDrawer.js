import React from 'react'
import CommonDrawer from 'components/CommonDrawer'
import TagCell from 'components/TagCell'
import DescriptionsList from 'components/DescriptionsList'

export default (props) => {
  const { data = {}, onOk, visible, ...rest } = props

  return (
    <CommonDrawer visible={visible} footer={null} {...rest}>
      <DescriptionsList.Item label="链接地址">
        <a href={data.link} alt={data.title} target="_blank" rel="noreferrer">
          {data.link}
        </a>
      </DescriptionsList.Item>
      <DescriptionsList.Item label="链接封面">
        <img src={data.filePath} alt="" height={80} />
      </DescriptionsList.Item>
      <DescriptionsList.Item label="链接标题">
        {data.title}
      </DescriptionsList.Item>
      <DescriptionsList.Item label="链接摘要">
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
