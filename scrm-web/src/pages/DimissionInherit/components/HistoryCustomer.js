import { useEffect } from "react";
import { useAntdTable } from "ahooks";

import CustomerDrawer from 'components/CommonDrawer'
import WeChatCell from "components/WeChatCell";
import UserTag from "components/UserTag";
import { Table } from "components/TableContent";
import TagCell from "components/TagCell";
import { DepNames } from "components/DepName";
import { GetCustomerTransferHistory } from "services/modules/dimissionInherit";

const TAKE_OVER_STATUS_MAP = {
  1: '接替完毕',
  2: '等待接替',
  3: '客户拒绝',
  4: '接替成员客户达到上限',
  5: '无接替记录'
}
export default (props) => {
  const { visible, data = {}, ...rest } = props;
  const { tableProps, run: runGetTableList } = useAntdTable(
    GetCustomerTransferHistory,
    {
      manual: true,
    }
  );

  useEffect(() => {
    if (visible) {
      runGetTableList({
        current: 1,
        pageSize: 10,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const columns = [
    {
      title: "客户昵称",
      dataIndex: "customer",
      render: (val) => <WeChatCell data={val} />,
    },
    {
      title: "分配时间",
      dataIndex: "allocateTime",
    },
    {
      title: "接替人",
      dataIndex: "takeoverStaffExtId",
      render: (val) => <UserTag data={{
        name: val
      }} />,
    },
    {
      title: '接替状态',
      dataIndex: 'status',
      // 明天21:54接替
      // takeoverTime
      render: val => TAKE_OVER_STATUS_MAP[val]
    },
    {
      title: "接替人部门",
      dataIndex: "takeoverStaff",
      render: (val) => {
        const dep = val?.departmentList ? val.departmentList : [];
        return <DepNames dataSource={dep} />;
      },
    },
  ];
  return (
    <CustomerDrawer footer={false} visible={visible} width={1000} {...rest}>
      <Table columns={columns} {...tableProps} />
    </CustomerDrawer>
  );
};
