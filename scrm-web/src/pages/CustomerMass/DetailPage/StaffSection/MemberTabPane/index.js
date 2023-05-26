import { useEffect, useMemo, useState, useRef } from 'react'
import { AppstoreOutlined, SearchOutlined } from '@ant-design/icons'
import { Input, Empty } from 'antd'
import { useRequest } from 'ahooks'
import { debounce } from 'lodash'
import MemberListItem from '../MemberListItem'
import { QueryStaffByStatus } from 'services/modules/customerMass'
import styles from './index.module.less'

const MemberTabPane = ({ onRemind, hideAction, extra, status, massId }) => {
  const { data: memberList = [], run: runQueryStaffByStatus } = useRequest(
    QueryStaffByStatus,
    {
      manual: true,
    }
  )
  const [searchText, setSearchText] = useState('')
  const paramsRef = useRef({})

  const onSearch = () => {
    if (massId) {
      runQueryStaffByStatus({
        statusList: typeof status !== 'undefined' ? [status] : [],
        id: massId,
        name: paramsRef.current.text,
      })
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const deSearch = useMemo(() => debounce(onSearch, 200), [])

  useEffect(() => {
    paramsRef.current = {
      text: searchText,
    }
    deSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])

  const onTextChange = (e) => {
    setSearchText(e.target.value)
  }

  return (
    <div className={styles['member-tabpane']}>
      <div className={styles['member-tabpane-header']}>
        <div className={styles['member-tabpane-name']}>
          <AppstoreOutlined style={{ marginRight: 4 }} />共{memberList.length}人
        </div>
        {!hideAction && (
          <div className={styles['member-tabpane-extra']}>
            <Input
              placeholder="请输入成员昵称"
              suffix={<SearchOutlined />}
              style={{ width: 200 }}
              value={searchText}
              allowClear={true}
              onChange={onTextChange}
            />
            {extra}
          </div>
        )}
      </div>
      <div style={{ height: 420, overflow: 'auto' }}>
        {memberList.length ? (
          memberList.map((ele) => (
            <MemberListItem key={ele.id} data={ele} onRemind={onRemind} />
          ))
        ) : (
          <Empty description="没有此类型成员" />
        )}
      </div>
    </div>
  )
}
export default MemberTabPane
