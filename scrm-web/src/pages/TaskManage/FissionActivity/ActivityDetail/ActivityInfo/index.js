import { useEffect, useMemo, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { message, Button, Spin } from 'antd'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { get, compact } from 'lodash'
import { getFileUrl } from 'utils'
import UserTag from 'components/UserTag'
import { Table } from 'components/TableContent'
import TagCell from 'components/TagCell'
import UsersTagCell from 'components/UsersTagCell'
import MsgPreview from 'components/WeChatMsgEditor/components/MsgPreview'
import PosterViewer from '../../PosterViewer'
import { getMsgList } from 'components/WeChatMsgEditor/utils'
import DescriptionsList from 'components/DescriptionsList'
import { StatusCell } from 'components/TableContent'
import { GetMarketFissionDetail } from 'services/modules/marketFission'
import { ExportFile } from 'services/modules/common'
import { STATUS_OPTIONS } from '../../constants'
import { getPosterConfig, getColor, handleTags } from '../../utils'
import { NUM_CN } from 'utils/constants'
import styles from './index.module.less'

export default ({ data = {} }) => {
  const [copied, setCopied] = useState(false)
  const [msgList, setMsgList] = useState([])
  const [fileUrls, setFileUrls] = useState({})
  const {
    run: runGetData,
    data: activityData = {},
    loading: activityLoading,
  } = useRequest(GetMarketFissionDetail, {
    manual: true,
    onBefore() {
      setFileUrls({})
    },
    onFinally: async () => {
      const fileId = get(activityData, 'msg.media[0].file.id')
      const fileIds = compact([activityData.posterFileId, fileId])
      const urls = fileIds.length ? await getFileUrl({ ids: fileIds }) : {}
      setFileUrls(urls)
      const mList = await getMsgList(activityData.msg, urls)
      setMsgList(mList)
    },
  })
  useEffect(() => {
    if (data.id) {
      setMsgList([])
      runGetData({
        id: data.id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const onCopy = () => {
    if (!copied) {
      setCopied(true)
      message.success('复制链接成功')
    }
  }

  const onMouseOut = () => {
    setCopied(false)
  }

  const posterData = useMemo(() => {
    return {
      ...getPosterConfig(activityData, getColor(activityData)),
      filePath: fileUrls[activityData.posterFileId],
    }
  }, [activityData, fileUrls])

  const onDownloadCode = () => {
    ExportFile(
      {
        url: activityData.qrCode,
      },
      `${activityData.name}-活码.png`
    )
  }

  const { oldStageList, tagList } = useMemo(() => {
    const oldStageList = Array.isArray(activityData.wxFissionStageVOS)?activityData.wxFissionStageVOS.reduce(
      ({ res, total }, ele) => {
        return {
          res: [
            ...res,
            {
              ...ele,
              initNum: ele.num,
              num: total + ele.num,
            },
          ],
          total: total + ele.num,
        }
      },
      { res: [], total: 0 }
    ).res : []
    return {
      oldStageList,
      tagList: handleTags(activityData.tagList, activityData.tags)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activityData.id])

  const columns = [
    {
      title: '阶段名称',
      dataIndex: 'level',
      width: 100,
      render: (_, { stage }) => {
        return `${NUM_CN[stage]}阶段`
      },
    },
    {
      title: '目标客户数',
      width: 100,
      dataIndex: 'num',
    },
    {
      title: '标签',
      dataIndex: 'tagList',
      render: (val) => <TagCell dataSource={val} />,
    },
    {
      title: '兑奖客服',
      dataIndex: 'staffVOList',
      render: (val) => <UsersTagCell dataSource={val} />,
    },
  ]

  const activityLink = activityData.inviteLink  
  return (
    <Spin spinning={activityLoading}>
      <div className={styles['activity-info']}>
        <div className={styles['preview-side']}>
          <div className={styles['preview-section']}>
            <p className={styles['preview-section-title']}>活动海报</p>
            <PosterViewer data={posterData} qcodeUrl={activityData.qrCode} />
          </div>
          <div className={styles['preview-section']}>
            <p className={styles['preview-section-title']}>客户收到的信息</p>
            <MsgPreview mediaList={msgList} />
          </div>
        </div>
        <DescriptionsList labelWidth={160}>
          <DescriptionsList.Item label="活动名称">
            {activityData.name}
          </DescriptionsList.Item>
          <DescriptionsList.Item label="创建人">
            <UserTag data={activityData.creatorInfo} />
          </DescriptionsList.Item>
          <DescriptionsList.Item label="创建时间">
            {activityData.createdAt}
          </DescriptionsList.Item>
          <DescriptionsList.Item label="结束时间">
            {activityData.endTime}
          </DescriptionsList.Item>
          <DescriptionsList.Item label="删除员工好友助力失效">
            {activityData.hasCheckDelete ? '是' : '否'}
          </DescriptionsList.Item>
          <DescriptionsList.Item label="活动状态">
            <StatusCell options={STATUS_OPTIONS} val={activityData.status} />
          </DescriptionsList.Item>
          <DescriptionsList.Item label="邀请链接">
            <span className={styles['link-item']}>
              {activityLink}
              <CopyToClipboard text={activityLink} onCopy={onCopy}>
                <span onMouseOut={onMouseOut} className={styles['copy-action']}>
                  {copied ? (
                    <CheckOutlined className={styles['done-icon']} />
                  ) : (
                    <CopyOutlined className={styles['copy-icon']} />
                  )}
                </span>
              </CopyToClipboard>
            </span>
          </DescriptionsList.Item>
          <DescriptionsList.Item label="接待员工">
            <UsersTagCell dataSource={activityData.staffVOList} />
          </DescriptionsList.Item>
          <DescriptionsList.Item label="阶段信息">
            <Table
              columns={columns}
              dataSource={oldStageList}
              scroll={{ x: 500, y: 240 }}
              pagination={false}
            />
          </DescriptionsList.Item>
          <DescriptionsList.Item label="活动二维码">
            <div className={styles['code-cell']}>
              <img src={activityData.qrCode} alt="" />
              <div className={styles['code-cell-footer']}>
                <Button
                  type="primary"
                  onClick={onDownloadCode}
                  // ghost
                  size="small"
                  style={{ width: '100%' }}>
                  下载活码
                </Button>
              </div>
            </div>
          </DescriptionsList.Item>
          <DescriptionsList.Item label="二维码有效期">
            活动结束{activityData.codeExpiredDays === 0
              ? '立即失效'
              : `${activityData.codeExpiredDays}天后过期`}
          </DescriptionsList.Item>
          <DescriptionsList.Item label="参与活动标签">
            {tagList.length ? (
              <TagCell dataSource={tagList} maxHeight="auto"/>
            ) : (
              '无'
            )}
          </DescriptionsList.Item>
        </DescriptionsList>
      </div>
    </Spin>
  )
}
