import React from 'react';
import CommonDrawer from 'components/CommonDrawer'
import TagCell from 'components/TagCell'
import DescriptionsList from 'components/DescriptionsList'

export default (props) => {
  const { data = {}, onOk, visible, ...rest } = props
  return (
    <CommonDrawer
      visible={visible}
      footer={null}
      {...rest}
    >
      <DescriptionsList.Item
        label="海报名称"
      >
        {data.title}
      </DescriptionsList.Item>
      <DescriptionsList.Item
        label="海报"
      >
        <img
          src={data.filePath}
          alt=""
          height={470}
        />
      </DescriptionsList.Item>
      <DescriptionsList.Item
        label="分类标签"
      >
        <TagCell
          dataSource={data.mediaTagDetailList}
          maxHeight="auto"
        />
      </DescriptionsList.Item>
      <DescriptionsList.Item
        label="发送次数"
      >
         {data.sendNum ? data.sendNum : 0}
      </DescriptionsList.Item>
    </CommonDrawer>
  );
};
