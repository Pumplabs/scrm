import CommonDrawer from 'components/CommonDrawer'
import DescriptionsList from 'components/DescriptionsList'
import { MsgCell } from 'components/WeChatMsgEditor'
import { UserAndDepTags } from 'components/MySelect'
import { refillUsers } from 'components/MySelect/utils'

export default (props) => {
  const { data = {}, ...rest } = props
  const users = refillUsers({
    userArr: data.staffList,
    depArr: data.departmentList,
  })
  return (
    <CommonDrawer footer={false} {...rest}>
      <DescriptionsList.Item label="内容">
        <MsgCell data={data.msg} maxHeight="auto" ninameLabel="客户昵称" />
      </DescriptionsList.Item>
      <DescriptionsList.Item label="所选员工">
        <UserAndDepTags dataSource={users} />
      </DescriptionsList.Item>
    </CommonDrawer>
  )
}
