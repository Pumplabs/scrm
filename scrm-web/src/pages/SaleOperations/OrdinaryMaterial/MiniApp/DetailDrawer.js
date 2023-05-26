import React from 'react';
import { get } from 'lodash'
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
      <DescriptionsList
        labelWidth={100}
      >
        <DescriptionsList.Item
          label="小程序名称"
        >
          {get(data, 'appInfo.name')}
        </DescriptionsList.Item>
        <DescriptionsList.Item
          label="APPID"
        >
          {get(data, 'appInfo.appId')}
        </DescriptionsList.Item>

        <DescriptionsList.Item
          label="APP路径"
        >
          {get(data, 'appInfo.appPath')}
        </DescriptionsList.Item>
        <DescriptionsList.Item
          label="小程序封面"
        >
          <img
            alt=""
            height={200}
            src={data.filePath}
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
      </DescriptionsList>
    </CommonDrawer>
  );
};
