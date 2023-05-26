import { useState, useEffect } from 'react'
import DescriptionsList from 'components/DescriptionsList'
import UsersTagCell from 'components/UsersTagCell'
import TagCell from 'components/TagCell'
import { MsgPreview } from 'components/WeChatMsgEditor'
import { getMsgList } from 'components/WeChatMsgEditor/utils'
import { ExportCodeImg } from 'services/modules/channelQrCode'
import styles from './index.module.less'

export default ({ data = {}, groupName }) => {
  const [msgList, setMsgList] = useState([])

  useEffect(() => {
   if (data.id) {
     const setMsgContent = async () => {
      const arr = await getMsgList(data.replyInfo, '', '客户昵称')
      setMsgList(arr)
     }
     setMsgContent()
   }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id])
  const onDownloadImg = () => {
    ExportCodeImg(data.qrCode, `渠道码-${data.name}`)
  }

  return (
    <div className={styles['base-info-section']}>
      <div className={styles['base-info-right-section']}>
        <div className={styles['qcode-box']}>
          <img alt="" src={data.qrCode} className={styles['code-img']} />
          {data.qrCode ? (
            <div className={styles['code-actions']}>
              <span
                className={styles['code-download-action']}
                onClick={onDownloadImg}>
                下载
              </span>
            </div>
          ) : null}
        </div>
        <div>
          <p className={styles['welcome-tip']}>欢迎语内容</p>
          <MsgPreview
            mediaList={msgList}
          />
        </div>
      </div>
      <DescriptionsList mode="wrap">
        <DescriptionsList.Item
          label="渠道码名称"
          style={{ display: 'inline-block', marginRight: 12 }}>
          {data.name}
        </DescriptionsList.Item>
        <DescriptionsList.Item
          label="所属分组"
          style={{ display: 'inline-block', marginRight: 12 }}>
          {groupName}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="使用员工">
          <UsersTagCell dataSource={data.staffs} />
        </DescriptionsList.Item>
        <DescriptionsList.Item label="备份员工">
          <UsersTagCell dataSource={data.backOutStaffs} />
        </DescriptionsList.Item>
        <DescriptionsList.Item label="客户标签">
          <TagCell dataSource={data.customerTags} />
        </DescriptionsList.Item>
        <DescriptionsList.Item label="是否自动通过好友">
          {data.skipVerify ? '是' : '否'}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="每日添加客户上限">
          {data.dailyAddCustomerLimitEnable ? data.dailyAddCustomerLimit : '-'}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="客户备注">
          {data.customerRemark ? data.customerRemark : '-'}
        </DescriptionsList.Item>
      </DescriptionsList>
    </div>
  )
}
