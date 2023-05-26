import { useMemo, useState } from 'react'
import { Input, Empty } from 'antd'
import { AppstoreOutlined, SearchOutlined } from '@ant-design/icons'
import CustomerListItem from '../CustomerListItem'
import styles from './index.module.less'

const CustomerTabPane = ({ list = [], hideAction, status }) => {
  const [searchText, setSearchText] = useState('')

  const onTextChange = (e) => {
    setSearchText(e.target.value)
  }

  const customerList = useMemo(() => {
    return status === undefined
      ? list
      : list.filter((ele) => ele.sendStatus === status)
  }, [list, status])

  const filterCustomerList = useMemo(() => {
    return searchText
      ? customerList.filter((ele) => ele.customerName.includes(searchText))
      : customerList
  }, [customerList, searchText])
  return (
    <div className={styles['member-tabpane']}>
      <div className={styles['member-tabpane-header']}>
        <div className={styles['member-tabpane-name']}>
          <AppstoreOutlined style={{ marginRight: 4 }} />共{list.length}人
        </div>
        {!hideAction && (
          <div className={styles['member-tabpane-extra']}>
            <Input
              placeholder="请输入客户名称"
              suffix={<SearchOutlined />}
              onChange={onTextChange}
              value={searchText}
            />
          </div>
        )}
      </div>
      <div style={{ height: 420, overflow: 'auto' }}>
        {filterCustomerList.length ? (
          filterCustomerList.map((ele) => (
            <CustomerListItem key={ele.id} data={ele} />
          ))
        ) : (
          <Empty description="没有此类型客户" />
        )}
      </div>
    </div>
  )
}
export default CustomerTabPane