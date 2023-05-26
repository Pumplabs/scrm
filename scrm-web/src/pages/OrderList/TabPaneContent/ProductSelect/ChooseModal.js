import { Row, Col, Form, Input, Tooltip } from 'antd'
import TableSide from 'src/components/MySelect/components/TableSide'
import CategorySelect from 'src/pages/ProductList/TabPaneContent/components/CategorySelect'
import ChooseModal from 'src/components/MySelect/ChooseModal'
import { formatNumber } from 'src/utils'
import styles from './index.module.less'
const productColumns = [
  {
    title: '产品名称',
    width: 120,
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '分类',
    width: 100,
    dataIndex: 'productType',
    ellipsis: true,
    render: (val) => (val ? val.name : ''),
  },
  {
    title: '价格',
    dataIndex: 'price',
    render: (val) =>
      `¥ ${formatNumber(val, {
        padPrecision: 2,
      })}`,
  },
  {
    title: '描述',
    dataIndex: 'profile',
    ellipsis: true,
  },
]
const CustomerFormContent = () => {
  return (
    <>
      <Row>
        <Col span={12}>
          <Form.Item
            name="name"
            label="产品名称"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}>
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="tags"
            label="产品分类"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}>
            <CategorySelect />
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}
export default (props) => {
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
          columns: productColumns,
          ...responeData,
        }}
        selectedArr={selectedArr}
        onKeysChange={onKeysChange}
        onFilterChange={onFilterChange}
        formContent={<CustomerFormContent />}
        visible={props.visible}
      />
    )
  }
  const renderSelectedItem = (data) => {
    return (
      <Tooltip title={data.name} placement="topLeft">
        <p className={styles['product-item']}>
          <span className={styles['product-item-text']}>{data.name}</span>
        </p>
      </Tooltip>
    )
  }

  return (
    <ChooseModal
      leftContent={renderLeftContent}
      renderSelectedItem={renderSelectedItem}
      {...props}
    />
  )
}
