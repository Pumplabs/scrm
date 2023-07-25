import { Tabs } from "antd";

import { PageContent } from "layout";
import CustomerTab from "./components/CustomerTab";
import GroupTab from "./components/GroupTab";

const { TabPane } = Tabs;

export default () => {
  return (
    <PageContent>
      <Tabs defaultActiveKey="customer">
        <TabPane tab="客户" key="customer">
          <CustomerTab />
        </TabPane>
        <TabPane tab="群聊" key="group">
          <GroupTab />
        </TabPane>
      </Tabs>
    </PageContent>
  );
};
