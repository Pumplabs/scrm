import { Button, Form } from "antd";
import { useAntdTable, useRequest } from "ahooks";
import { HistoryOutlined, SyncOutlined } from "@ant-design/icons";
import { Spin } from "antd";

import SearchForm from "components/SearchForm";
import TableContent from "components/TableContent";
import UserTag from "components/UserTag";
import { DepNames } from "components/DepName";
import {
  AsyncGetGroupChatResignedInheritance,
  GetGroupChatResignedInheritance,
} from "services/modules/dimissionInherit";
import { useModalHook } from "src/hooks";
import GroupDrawer from "./GroupDrawer";
import HistoryDrawer from "./HistoryGroup";
import { actionRequestHookOptions } from "services/utils";

export default () => {
  const [searchForm] = Form.useForm();
  const { openModal, closeModal, visibleMap, modalInfo } = useModalHook([
    "customer",
    "group",
    "history",
  ]);
  const {
    tableProps,
    refresh: refreshTable,
    search,
  } = useAntdTable(GetGroupChatResignedInheritance, {
    form: searchForm,
    pageSize: 10,
    defaultParams: [
      {
        current: 1,
        pageSize: 10,
      },
    ],
  });
  const { run: runAsyncListData, loading: asyncLoading } = useRequest(
    AsyncGetGroupChatResignedInheritance,
    {
      onSuccess: refreshTable
      // ...actionRequestHookOptions({
      //   actionName: "同步",
      //   successFn: () => {
      //     refreshTable();
      //   },
      // }),
    }
  );

  const onHistory = () => {
    openModal("history");
  };

  const onAllotOk = () => {};

  const onDetailCustomer = (record) => {
    openModal("customer", record);
  };

  const onDetailGroup = (record) => {
    openModal("group", record);
  };

  const columns = [
    {
      dataIndex: "handoverStaff",
      title: "员工名称",
      width: 200,
      render: (val) => <UserTag data={val} />,
    },
    {
      title: "部门",
      ellipsis: true,
      dataIndex: "dep",
      render: (_, record) => {
        const depArr = record?.handoverStaff?.departmentList || [];
        return <DepNames dataSource={depArr} />;
      },
    },
    {
      dataIndex: "waitAssignNum",
      width: 120,
      title: "待分配群聊数",
      render: (val) => (val > 0 ? val : 0),
    },
    // {
    //   dataIndex: 'resignedTime',
    //   title: '离职时间',
    //   width: 160,
    // },
  ];
  // const searchConfig = [
  //   {
  //     type: 'rangTime',
  //     label: '离职时间',
  //     name: 'createTime',
  //   },
  // ]

  return (
    <>
      {/* <SearchForm
        name="customerSearch"
        configList={searchConfig}
        form={searchForm}
        onSearch={search.submit}
        onReset={search.reset}
      /> */}
      <HistoryDrawer
        data={modalInfo.data}
        visible={visibleMap.historyVisible}
        onCancel={closeModal}
        title="分配记录"
      />
      <GroupDrawer
        data={modalInfo.data}
        visible={visibleMap.groupVisible}
        onCancel={closeModal}
        refreshChatList={refreshTable}
        onOk={onAllotOk}
        title="待分配群"
      />
      <Spin spinning={asyncLoading} tip="正在同步数据...">
        <TableContent
          tableLayout="auto"
          {...tableProps}
          scroll={{ x: 1000 }}
          rowKey="handoverStaffExtId"
          columns={columns}
          operationCol={{ width: 160 }}
          actions={[
            {
              title: "待分配群",
              onClick: onDetailGroup,
              visible: (record) => record.waitAssignNum > 0,
            },
          ]}
          toolBar={[
            <Button
              key="history"
              onClick={onHistory}
              type="primary"
              ghost
              icon={<HistoryOutlined />}
            >
              分配记录
            </Button>,
            <Button
              key="async"
              onClick={runAsyncListData}
              type="primary"
              ghost
              loading={asyncLoading}
              icon={<SyncOutlined />}
            >
              同步数据
            </Button>,
          ]}
        />
      </Spin>
    </>
  );
};
