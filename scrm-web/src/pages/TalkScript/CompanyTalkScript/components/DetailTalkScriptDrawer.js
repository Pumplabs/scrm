import CustomerDrawer from 'components/CommonDrawer'
import DescriptionsList from 'components/DescriptionsList'
import TagCell from 'components/TagCell'
import UserTag from 'components/UserTag'
import { MsgPreview } from 'components/WeChatMsgEditor'
import styles from './modal.module.less'

export default (props) => {
  const { data = {}, isPerson, ...rest } = props
  return (
    <CustomerDrawer footer={false} {...rest}>
      <div className={styles['modalContent']}>
        <div className={styles['preview-section']}>
          <MsgPreview msg={data.msg} />
        </div>
        {
          !isPerson ? (
            <DescriptionsList.Item label="创建人">
            <UserTag data={data.creator} />
          </DescriptionsList.Item>
          ) : null
        }
         <DescriptionsList.Item label="话术名称">
          {data.name}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="所在分组">
          {data.groupName}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="发送次数">
          {data.sendNum || 0}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="话术标签">
          <TagCell dataSource={data.tagList} empty="无" maxHeight="auto"/>
        </DescriptionsList.Item>
      </div>
    </CustomerDrawer>
  )
}
