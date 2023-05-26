import { DatePicker, Input } from 'antd'
import DescriptionsList from 'components/DescriptionsList'
import TagSelect from 'components/TagSelect'
import MySelect from 'components/MySelect'

export default ({ data, onChange }) => {
  const onTimeChange = (val) => {
    onChange('createTimes', val)
  }
  const onGroupNameChange = (e) => {
    onChange('groupName', e.target.value)
  }
  const onTagChange = (val) => {
    onChange('groupTags', val)
  }
  const onGroupChange = (val) => {
    onChange('groupOwner', val)
  }
  return (
    <DescriptionsList labelWidth={100}>
      <DescriptionsList.Item label="创建时间">
        <DatePicker.RangePicker
          onChange={onTimeChange}
          value={data.createTimes}
        />
      </DescriptionsList.Item>
      <DescriptionsList.Item label="群名关键字">
        <Input
          placeholder="请输入"
          onChange={onGroupNameChange}
          value={data.groupName}
          allowClear
        />
      </DescriptionsList.Item>
      <DescriptionsList.Item label="群标签">
        <TagSelect
          tagType="group"
          style={{ width: '100%' }}
          onChange={onTagChange}
          value={data.groupTags}
        />
      </DescriptionsList.Item>
      <DescriptionsList.Item label="群主">
        <MySelect
          type="user"
          onChange={onGroupChange}
          value={data.groupOwner}
          title="选择群主"
          placeholder="选择群主"
          style={{ width: '100%' }}
        />
      </DescriptionsList.Item>
    </DescriptionsList>
  )
}
