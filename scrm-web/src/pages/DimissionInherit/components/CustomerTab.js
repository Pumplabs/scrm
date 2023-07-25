import { Button, Form, Spin } from "antd";
import { useAntdTable, useRequest } from "ahooks";
import { HistoryOutlined, SyncOutlined } from "@ant-design/icons";

import SearchForm from "components/SearchForm";
import TableContent from "components/TableContent";
import UserTag from "components/UserTag";
import { DepNames } from "components/DepName";
import {
  GetCustomerResignedInheritance,
  AsyncCustomerResignedInheritance,
} from "services/modules/dimissionInherit";
import { useModalHook } from "src/hooks";
import CustomerDrawer from "./CustomerDrawer";
import CustomerHistoryDrawer from "./HistoryCustomer";

export default () => {
  const [searchForm] = Form.useForm();
  const { openModal, closeModal, visibleMap, modalInfo } = useModalHook([
    "customer",
    "history",
  ]);
  const {
    tableProps,
    refresh: refreshTable,
    search,
  } = useAntdTable(GetCustomerResignedInheritance, {
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
    AsyncCustomerResignedInheritance,
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

  const onDetailCustomer = (record) => {
    openModal("customer", record);
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
        const depArr = record.handoverStaff?.departmentList || [];
        return <DepNames dataSource={depArr} />;
      },
    },
    {
      title: "待分配客户数",
      dataIndex: "waitAssignCustomerNum",
      width: 120,
      render: (val) => (val > 0 ? val : 0),
    },
    {
      dataIndex: "dimissionTime",
      title: "离职时间",
      width: 160,
    },
  ];
  const searchConfig = [
    {
      type: "rangTime",
      label: "离职时间",
      name: "dimissionTime",
    },
  ];

  return (
    <>
      <CustomerHistoryDrawer
        visible={visibleMap.historyVisible}
        onCancel={closeModal}
        title="分配记录"
        footer={null}
      />
      <CustomerDrawer
        data={modalInfo.data}
        visible={visibleMap.customerVisible}
        onCancel={closeModal}
        refreshCustomerList={refreshTable}
        title="待分配客户"
      />
      <SearchForm
        name="customerSearch"
        configList={searchConfig}
        form={searchForm}
        onSearch={search.submit}
        onReset={search.reset}
      />
      <Spin spinning={asyncLoading} tip="正在同步数据...">
        <TableContent
          tableLayout="auto"
          {...tableProps}
          scroll={{ x: 1000 }}
          rowKey="id"
          columns={columns}
          operationCol={{ width: 160 }}
          actions={[
            {
              title: "待分配客户",
              visible: (record) => record.waitAssignCustomerNum > 0,
              onClick: onDetailCustomer,
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
