import { useMemo } from 'react'
import { isEmpty } from 'lodash'
import { Radio } from 'antd'
import { useRequest } from 'ahooks'
import { handleUsersParams } from 'components/MySelect/utils'
import PartSelectGroup from 'pages/TaskManage/GroupSop/components/PartSelectContent'
import FilterTip, {
  convertArrayToEllipsisStr,
} from 'pages/TaskManage/GroupSop/components/FilterTip'
import AllItem from 'pages/TaskManage/GroupSop/components/AllItem'
import GroupFilters from './GroupFilters'
import { GetGroupCountByFilter } from 'services/modules/groupSop'
import MySelect from 'components/MySelect'
import { handleTimes } from 'utils/times'
import { SUCCESS_CODE } from 'src/utils/constants'
import styles from './index.module.less'

export const TYPE_EN = {
  ALL: 1,
  PART: 2,
  FILTER: 3,
}

export default ({ value = {}, onChange }) => {
  const {
    run: runGetGroupCountByFilter,
    data: groupCount,
    mutate,
  } = useRequest(GetGroupCountByFilter, {
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
  const type = value.type
  const triggerChange = (key, val) => {
    if (typeof onChange === 'function') {
      onChange({
        ...value,
        [key]: val,
      })
    }
  }
  const onTypeChange = (e) => {
    triggerChange('type', e.target.value)
  }

  const onPartGroupChange = (val) => {
    triggerChange('partGroup', val)
  }

  const onLookGroup = () => {
    const [startTime, endTime] = handleTimes(value.createTimes)
    const groupTags = Array.isArray(value.groupTags)
      ? value.groupTags.map((ele) => ele.id)
      : []
    const { depIds: departmentIds, userIds: leaderIds } = handleUsersParams(
      value.groupOwner
    )
    const params = {
      startTime,
      endTime,
      hasAllGroup: false,
      groupTags,
      departmentIds,
      leaderIds,
      groupName: value.groupName,
      groupIds: [],
    }
    runGetGroupCountByFilter(params)
  }

  const filterOptions = useMemo(() => {
    if (value) {
      mutate(undefined)
    }
    if (value.type === TYPE_EN.FILTER) {
      const [createStime, createEndTime] = handleTimes(value.createTimes)
      const options = [
        {
          label: '创建时间',
          value: createStime ? `${createStime}~${createEndTime}` : '',
        },
        {
          label: '群名关键字',
          value: value.groupName ? `"${value.groupName}"` : '',
        },
        {
          label: '群标签',
          value: convertArrayToEllipsisStr(value.groupTags, '标签'),
        },
        {
          label: '群主',
          type: 'users',
          value: value.groupOwner,
        },
      ]
      return options.filter((ele) => !isEmpty(ele.value))
    } else {
      return []
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div>
      <Radio.Group onChange={onTypeChange} value={value.type}>
        <Radio value={TYPE_EN.PART}>选择群聊</Radio>
        <Radio value={TYPE_EN.FILTER}>按条件筛选</Radio>
        <Radio value={TYPE_EN.ALL}>全部群聊</Radio>
      </Radio.Group>
      <div className={styles['radio-content']}>
        {type === TYPE_EN.PART ? (
          <div className={styles['part-section']}>
            <MySelect
              type="group"
              title="选择群聊"
              value={value.partGroup}
              onChange={onPartGroupChange}>
              {({ tags, onCloseTag, onAddTags }) => (
                <PartSelectGroup
                  tags={tags}
                  onCloseTag={onCloseTag}
                  onAddTags={onAddTags}
                  type="group"
                />
              )}
            </MySelect>
          </div>
        ) : null}
        {type === TYPE_EN.FILTER ? (
          <div className={styles['filters-box']}>
            <div style={{ width: '50%' }}>
              <GroupFilters data={value} onChange={triggerChange} />
            </div>
            <FilterTip
              filterOptions={filterOptions}
              name={'群聊'}
              count={groupCount}
              onGetCount={onLookGroup}
            />
          </div>
        ) : null}
        {type === TYPE_EN.ALL ? (
          <div style={{ paddingTop: 12 }}>
            <AllItem>全部群聊</AllItem>
          </div>
        ) : null}
      </div>
    </div>
  )
}
