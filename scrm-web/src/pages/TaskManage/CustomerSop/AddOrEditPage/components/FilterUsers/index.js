import React, { useMemo } from 'react'
import { Radio } from 'antd'
import { isEmpty } from 'lodash'
import { useRequest } from 'ahooks'
import DescriptionsList from 'components/DescriptionsList'
import MySelect from 'components/MySelect'
import PartCustomers from 'pages/TaskManage/GroupSop/components/PartSelectContent'
import FilterTip, {
  convertArrayToEllipsisStr,
} from 'pages/TaskManage/GroupSop/components/FilterTip'
import { GetCustomerDropdownList } from 'services/modules/customerManage'
import { GetCustomerCount } from 'services/modules/customerSop'
import Filters from './Filters'
import styles from './index.module.less'
import { SUCCESS_CODE } from 'utils/constants'

export const FILTER_TYPES = {
  ALL: 'all',
  FILTER: 'filter',
  PART: 'part',
}

export default React.forwardRef((props, ref) => {
  const { value = {}, onChange } = props
  const {
    run: runGetCustomerCount,
    data: customerCount,
    mutate,
  } = useRequest(GetCustomerCount, {
    manual: true,
    onSuccess: (res) => {
      const count =
        res.code === SUCCESS_CODE && !Number.isNaN(res.data * 1) ? res.data : 0
      mutate(count)
    },
    onError: () => {
      mutate(0)
    },
  })

  const handleChange = (nextVals) => {
    if (typeof onChange === 'function') {
      onChange(nextVals)
    }
  }

  const triggerChange = (key, val) => {
    handleChange({
      ...value,
      [key]: val,
    })
  }

  const restCustomerCount = () => {
    mutate(-1)
  }

  const onRadioChange = (e) => {
    triggerChange('type', e.target.value)
  }

  const onCustomersChange = (val) => {
    triggerChange('customers', val)
  }

  const onFiltersChange = (...vals) => {
    restCustomerCount()
    handleChange(...vals)
  }

  const onGetCount = () => {
    const { tags = [], users = [] } = value
    let departmentIds = []
    let staffIds = []
    if (Array.isArray(users)) {
      users.forEach((ele) => {
        if (ele.isDep) {
          departmentIds = [...departmentIds, ele.extId]
        } else {
          staffIds = [...staffIds, ele.extId]
        }
      })
    }
    runGetCustomerCount({
      chooseTags: tags.map((ele) => ele.id),
      departmentIds,
      staffIds,
    })
  }

  const filterOptions = useMemo(() => {
    if (value) {
      mutate(undefined)
    }
    if (value.type === FILTER_TYPES.FILTER) {
      const options = [
        {
          label: '标签',
          value: convertArrayToEllipsisStr(value.tags, '标签'),
        },
        {
          label: '成员',
          type: 'users',
          suffix: '成员',
          value: value.users,
        },
      ]
      return options.filter((ele) => !isEmpty(ele.value))
    } else {
      return []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div ref={ref} style={{ paddingTop: 5 }}>
      <Radio.Group value={value.type} onChange={onRadioChange}>
        <Radio value={FILTER_TYPES.PART}>部分客户</Radio>
        <Radio value={FILTER_TYPES.FILTER}>筛选客户</Radio>
        <Radio value={FILTER_TYPES.ALL}>全部客户</Radio>
      </Radio.Group>
      {value.type === FILTER_TYPES.ALL ? (
        <div>
          <span className={styles['all-customer-item']}>全部客户</span>
        </div>
      ) : null}
      {value.type === FILTER_TYPES.FILTER ? (
        <>
          <Filters value={value} onChange={onFiltersChange} />
          <FilterTip
            filterOptions={filterOptions}
            name="客户"
            count={customerCount}
            onGetCount={onGetCount}
          />
        </>
      ) : null}
      {value.type === FILTER_TYPES.PART ? (
        <div className={styles['filter-box']}>
          <DescriptionsList.Item label="客户">
            <MySelect
              type="customer"
              onChange={onCustomersChange}
              value={value.customers}
              title="选择客户"
              placeholder="选择客户"
              request={GetCustomerDropdownList}>
              {({ tags, onCloseTag, onAddTags }) => (
                <PartCustomers
                  tags={tags}
                  onCloseTag={onCloseTag}
                  onAddTags={onAddTags}
                />
              )}
            </MySelect>
          </DescriptionsList.Item>
        </div>
      ) : null}
    </div>
  )
})
