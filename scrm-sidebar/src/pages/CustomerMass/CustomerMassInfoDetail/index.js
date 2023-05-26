import { useMemo, useEffect, Fragment } from 'react'
import { decode } from 'js-base64'
import { useRequest } from 'ahooks'
import { useParams } from 'react-router-dom'
import OpenEle from 'components/OpenEle'
import PageContent from 'components/PageContent'
import List from 'components/List'
import { FileList } from 'components/UploadFile'
import StatusItem from '../StatusItem'
import { getTextMsg } from 'components/MsgSection/utils'
import { useBack } from 'src/hooks'
import { GetMassDetail } from 'src/services/modules/customerMass'
import {
  NAME_LEN,
  ADVANCE_FILTER,
  ADVANCE_FILTER_NAMES,
  SEND_STATUS_VAL,
} from '../constants'
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
  useBack({
    backUrl: `/customerMassDetail/${id}`
  })
  return (
    <PageContent loading={loading}>
      <div className={styles['detail-page']}>
        <List>
          <List.Item
            title="群发名称"
            extra={<StatusItem data={massData} statusVals={SEND_STATUS_VAL} />}>
            {massData.name || textMsg.substr(0, NAME_LEN)}
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

// 账号
const getAccountName = (data = {}) => {
  const { hasAllStaff, staffList = [] } = data
  if (hasAllStaff) {
    return '全部账号'
  }
  const staffArr = Array.isArray(staffList) ? staffList : []
  const staffCount = staffArr.length
  if (staffCount) {
    const staff = staffArr[0]
    return (
      <>
        <OpenEle type="userName" openid={staff.name} />等{staffCount}个账号
      </>
    )
  } else {
    return ''
  }
}

// 接收对象
const ReceiptObject = ({ data = {} }) => {
  const { customerList = [], staffList } = data
  if (data.hasPerson) {
    return (
      <>
        {Array.isArray(customerList) && customerList.length
          ? `"${customerList[0].customerName}"等${customerList.length}个客户`
          : ''}
      </>
    )
  }
  if (!Array.isArray(staffList) || staffList.length === 0) {
    return '无'
  }
  // 企业
  if (data.hasAllCustomer) {
    return <>添加人为{getAccountName(data)}的全部客户</>
  } else {
    // 条件
    return <FiltersCustomer data={data} />
  }
}

const FiltersCustomer = ({ data = {} }) => {
  const {
    chatNames = [],
    chooseTags = [],
    excludeTagNames = [],
    chooseTagType,
  } = data
  const tagArr = Array.isArray(chooseTags) ? chooseTags : []
  const list = [
    {
      label: '添加人',
      render: () => getAccountName(data),
    },
    {
      label: '所在群聊',
      visible: Array.isArray(chatNames) && chatNames.length > 0,
      render: () => {
        return (
          <>
            "{chatNames[0]}"等{chatNames}个群聊
          </>
        )
      },
    },
    {
      label: '添加时间',
      visible: data.addEndTime && data.addStartTime,
      render: () => (
        <>
          {data.addStartTime}~{data.addEndTime}
        </>
      ),
    },
    {
      label: '标签',
      visible: chooseTagType === ADVANCE_FILTER.NONE || tagArr.length > 0,
      showLabel: chooseTagType !== ADVANCE_FILTER.NONE,
      render: () => {
        if (chooseTagType === ADVANCE_FILTER.NONE) {
          return '无任何标签'
        } else {
          return (
            <>
              {ADVANCE_FILTER_NAMES[chooseTagType]}"{chooseTags[0]}"等
              {chooseTags.length}个标签
            </>
          )
        }
      },
    },
    {
      label: '排除标签',
      visible: Array.isArray(excludeTagNames) && excludeTagNames.length > 0,
      render: () => {
        return (
          <>
            "{excludeTagNames[0]}"等{excludeTagNames.length}个标签
          </>
        )
      },
    },
  ]
  const filters = useMemo(() => {
    return list.filter(({ visible = true }) => visible)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])
  return (
    <>
      {filters.map((item, idx) => {
        const { showLabel = true } = item
        return (
          <Fragment key={idx}>
            {idx > 0 && filters.length > 1 ? ',' : ''}
            {showLabel ? <>{item.label}为</> : null}
            {item.render()}
          </Fragment>
        )
      })}
      的客户
    </>
  )
}
