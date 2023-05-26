import CommonDrawer from 'components/CommonDrawer'
import DescriptionsList from 'components/DescriptionsList'
import { MsgCell } from 'components/WeChatMsgEditor'
import GroupTag from 'components/GroupChatCell'

export default (props) => {
  const { data = {}, ...rest } = props
  const groupList = Array.isArray(data.groupChatList) ? data.groupChatList : []

  return (
    <CommonDrawer footer={false} {...rest}>
      <DescriptionsList.Item label="内容">
        <MsgCell data={data.msg} maxHeight="auto" ninameLabel="客户昵称" />
      </DescriptionsList.Item>
      <DescriptionsList.Item label="所选群聊">
        {groupList.map((ele) => (
          <GroupTag data={ele} key={ele.id} />
        ))}
      </DescriptionsList.Item>
      <DescriptionsList.Item label="通知群主">
        {data.isNoticeOwner ? '是' : '否'}
      </DescriptionsList.Item>
    </CommonDrawer>
  )
}
