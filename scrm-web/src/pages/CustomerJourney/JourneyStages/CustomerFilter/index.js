import React, { useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { Row, Col, Input, DatePicker, Empty } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { useAntdTable } from 'ahooks'
import { difference } from 'lodash'
import WeChatCell from 'components/WeChatCell'
import TagCell from 'components/TagCell'
import DescriptionsList from 'components/DescriptionsList'
import { Table } from 'components/TableContent'
import TagSelect from 'components/TagSelect'
import { GetCustomerListByJoureny } from 'services/modules/customerJourney'
import styles from './index.module.less'

const { RangePicker } = DatePicker

export default React.forwardRef(({ value, onChange, journeyId }, ref) => {
  const {
    tableProps,
    run: runGetTableList,
    cancel,
    loading,
  } = useAntdTable(GetCustomerListByJoureny, {
    manual: true,
  })
  const [selectedList, setSelectedList] = useState([])
  const [filterVals, setFilterVals] = useState({})
  const isDefinedValue = typeof value !== 'undefined'
  const selectedArr = useMemo(() => {
    return isDefinedValue ? (Array.isArray(value) ? value : []) : selectedList
  }, [isDefinedValue, value, selectedList])

  const tableSelectedKeys = useMemo(() => {
    return selectedArr.map((ele) => ele.id)
  }, [selectedArr])

  useEffect(() => {
    if (journeyId) {
      const { tags, ...rest } = filterVals
      const extTagIds = Array.isArray(tags) ? tags.map((ele) => ele.extId) : []
      runGetTableList(
        {},
        {
          journeyId,
          extTagIds,
          ...rest,
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterVals, journeyId])

  const onReset = () => {
    setFilterVals({})
    if (loading) {
      cancel()
    }
  }

  useEffect(() => {
    window.addEventListener('reset', onReset)
    return () => {
      window.addEventListener('reset', onReset)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const changeSelectedList = (arr) => {
    if (typeof onChange === 'function') {
      onChange(arr)
    }
    if (!isDefinedValue) {
      setSelectedList(arr)
    }
  }

  const onFiltersChange = (vals) => {
    setFilterVals(vals)
  }

  const onTableRowChange = (keys, rows, e) => {
    const diffKeys = difference(keys, tableSelectedKeys)
    const isAdd = keys.length > tableSelectedKeys.length
    const newArr = rows.filter((ele) => diffKeys.includes(ele.id))
    if (isAdd) {
      changeSelectedList([...selectedArr, ...newArr])
    } else {
      changeSelectedList(
        selectedArr.filter((ele) => !diffKeys.includes(ele.id))
      )
    }
  }

  const onRemoveItem = (item) => {
    changeSelectedList(selectedArr.filter((ele) => ele.id !== item.id))
  }

  const onRemoveAll = () => {
    changeSelectedList([])
  }
  const columns = [
    {
      title: '客户名称',
      width: 200,
      dataIndex: 'customer',
      render: (_, record) => {
        return (
          <WeChatCell
            data={{
              name: record.name,
              avatar: record.avatar,
              corpName: record.corpName,
            }}
          />
        )
      },
    },
    {
      title: '客户标签',
      dataIndex: 'tags',
      render: (val) => {
        return <TagCell dataSource={val} />
      },
    },
    {
      title: '添加时间',
      width: 160,
      dataIndex: 'createdAt',
    },
  ]

  return (
    <Row gutter={20} ref={ref}>
      <Col span={18}>
        <Filters value={filterVals} onChange={onFiltersChange} />
        <Table
          {...tableProps}
          columns={columns}
          rowSelection={{
            preserveSelectedRowKeys: true,
            selectedRowKeys: tableSelectedKeys,
            onChange: onTableRowChange,
          }}
          scroll={{ y: 320 }}
        />
      </Col>
      <Col span={6}>
        <CustomerList
          dataSource={selectedArr}
          onRemoveItem={onRemoveItem}
          onRemoveAll={onRemoveAll}
        />
      </Col>
    </Row>
  )
})
const Filters = ({ value, onChange }) => {
  const [values, setValues] = useState({})
  const isDefinedValue = typeof value !== 'undefined'
  const filterVals = isDefinedValue ? value : values
  const changeValues = (key, val) => {
    if (typeof onChange === 'function') {
      onChange({
        ...value,
        [key]: val,
      })
    }
    if (!isDefinedValue) {
      setValues((preValues) => ({
        ...preValues,
        [key]: val,
      }))
    }
  }
  const onNameChange = (e) => {
    changeValues('name', e.target.value)
  }
  const onTimeChange = (val) => {
    changeValues('times', val)
  }
  const onTagsChange = (val) => {
    changeValues('tags', val)
  }
  return (
    <div>
      <DescriptionsList.Item label="客户昵称">
        <Input
          onChange={onNameChange}
          value={filterVals.name}
          placeholder="请输入"
          style={{ width: '50%' }}
        />
      </DescriptionsList.Item>
      <DescriptionsList.Item label="添加时间">
        <RangePicker
          format="YYYY-MM-DD"
          onChange={onTimeChange}
          value={filterVals.times}
          style={{ width: '50%' }}
        />
      </DescriptionsList.Item>
      <DescriptionsList.Item label="客户标签" style={{ marginBottom: 12 }}>
        <TagSelect
          placeholder="请选择客户标签"
          tagType="customer"
          style={{ width: '50%' }}
          value={filterVals.tags}
          onChange={onTagsChange}
        />
      </DescriptionsList.Item>
    </div>
  )
}
const CustomerList = ({ onRemoveItem, onRemoveAll, dataSource }) => {
  return (
    <div className={styles['selected-list']}>
      <div className={styles['selected-list-header']}>
        <span className={styles['selected-header-name']}>
          已选择
          <span className={styles['selected-count']}>{dataSource.length}</span>
          项
        </span>
        <span className={styles['selected-header-extra']} onClick={onRemoveAll}>
          清除
        </span>
      </div>
      <ul className={styles['selected-list-body']}>
        {dataSource.length ? (
          dataSource.map((ele) => (
            <CustomerListItem onRemove={onRemoveItem} data={ele} key={ele.id} />
          ))
        ) : (
          <Empty description="暂无数据" />
        )}
      </ul>
    </div>
  )
}

const CustomerListItem = ({ data = {}, onRemove }) => {
  const handleRemove = () => {
    if (typeof onRemove === 'function') {
      onRemove(data)
    }
  }
  return (
    <li className={styles['seleced-list-item']}>
      <WeChatCell
        data={{ name: data.name, avatar: data.avatar, corpName: data.corpName }}
      />
      <span className={styles['list-item-action']} onClick={handleRemove}>
        <CloseOutlined />
      </span>
    </li>
  )
}
