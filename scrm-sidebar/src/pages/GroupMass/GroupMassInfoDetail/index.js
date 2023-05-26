import { useMemo, useEffect } from 'react'
import { decode } from 'js-base64'
import { useRequest } from 'ahooks'
import { useParams } from 'react-router-dom'
import OpenEle from 'components/OpenEle'
import PageContent from 'components/PageContent'
import List from 'components/List'
import { FileList } from 'components/UploadFile'
import { useBack } from 'src/hooks'
import StatusItem from '../../CustomerMass/StatusItem'
import { getTextMsg } from 'components/MsgSection/utils'
import { GetMassDetail } from 'src/services/modules/groupMass'
import { SEND_STATUS_VAL } from '../contants'
import styles from './index.module.less'
export default () => {
  const { id } = useParams()
  const massId = useMemo(() => {
    return decode(id)
  }, [id])

  const {
    run: runGetMassDetail,
    data: massData = {},
    loading,
  } = useRequest(GetMassDetail, {
    manual: true,
  })
  useBack({
    backUrl:  `/groupMassDetail/${id}`
  })
  useEffect(() => {
    if (massId) {
      runGetMassDetail({
        id: massId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [massId])

  const { textMsg, mediaList } = useMemo(() => {
    let textMsg = ''
    let mediaList = []
    if (massData.msg) {
      const { text, media } = massData.msg
      const textArr = getTextMsg(text)
      return {
        textMsg: textArr[0] ? textArr[0].text : '',
        mediaList: media,
      }
    }
    return {
      mediaList,
      textMsg,
    }
  }, [massData.msg])
  return (
    <PageContent loading={loading}>
      <div className={styles['detail-page']}>
        <List>
          <List.Item title="群发名称"
          extra={<StatusItem data={massData} statusVals={SEND_STATUS_VAL} />}
          >
            {massData.name}
          </List.Item>
        </List>
        <Section title="群发内容">
          <div className={styles['msg-content']}>{textMsg}</div>
        </Section>
        {mediaList.length ? (
          <Section title="附件">
            <FileList mediaArr={mediaList} />
          </Section>
        ) : null}
        <div className={styles['send-info']}>
          <p className={styles['send-info-title']}>发送给</p>
          <div className={styles['send-msg']}>
            <ReceiptObject data={massData} />
          </div>
        </div>
        <SendInfo data={massData} />
      </div>
    </PageContent>
  )
}
const Section = ({ title, children }) => {
  return (
    <div className={styles['section']}>
      <p className={styles['section-title']}>{title}</p>
      <div className={styles['section-content']}>{children}</div>
    </div>
  )
}

const SendInfo = ({ data = {} }) => {
  return (
    <ul className={styles['info-ul']}>
      <li className={styles['info-li-item']}>
        <label className={styles['info-li-item-label']}>创建时间</label>
        <span className={styles['info-li-item-extra']}>{data.createdAt}</span>
      </li>
      <li className={styles['info-li-item']}>
        <label className={styles['info-li-item-label']}>发送时间</label>
        <span className={styles['info-li-item-extra']}>{data.sendTime}</span>
      </li>
    </ul>
  )
}

// 接收对象
const ReceiptObject = ({ data = {} }) => {
  const { extStaffIds = [], sendChatCount = 0, noSendChatCount = 0} = data
  if(Array.isArray(extStaffIds) && extStaffIds.length) {
    const chatTotal = sendChatCount + noSendChatCount
    return <>群主为"<OpenEle type="userName" openid={extStaffIds[0]} />"等{extStaffIds.length}个群主的{chatTotal}个客户群</>
  } else {
    return ''
  }
}
