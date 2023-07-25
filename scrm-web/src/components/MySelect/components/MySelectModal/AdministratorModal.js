import { Row, Col, Form, Input, DatePicker } from "antd";
import { get } from "lodash";

import UserTag from "components/UserTag";
import UserCell from "../UserCell";
import { DepNames } from "components/DepName";
import TableSide from "../TableSide";
import ChooseModal from "../../ChooseModal";

const groupColumns = [
  {
    title: "员工",
    dataIndex: "staff",
    render: (val) => <UserTag data={val} />,
  },
  {
    title: "部门",
    dataIndex: "operatorType",
    render: (_, record) => (
      <DepNames dataSource={get(record, "staff.departmentList")} />
    ),
  },
];

export default (props) => {
  const { ...rest } = props;
  const renderLeftContent = ({
    responeData,
    selectedArr,
    onFilterChange,
    onKeysChange,
    valueKey,
  }) => {
    return (
      <TableSide
        valueKey={valueKey}
        tableProps={{
          columns: groupColumns,
          ...responeData,
        }}
        selectedArr={selectedArr}
        onKeysChange={onKeysChange}
        onFilterChange={onFilterChange}
      />
    );
  };
  const renderSelectedItem = (data) => {
    const { staff } = data;
    return (
      <UserCell
        data={{
          ...staff,
          isUser: true,
        }}
      />
    );
  };

  return (
    <ChooseModal
      leftContent={renderLeftContent}
      renderSelectedItem={renderSelectedItem}
      {...rest}
    />
  );
};
