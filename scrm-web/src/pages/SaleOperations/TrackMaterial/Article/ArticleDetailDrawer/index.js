import React, { useEffect } from 'react'
import { useRequest } from 'ahooks'
import { isEmpty } from 'lodash'
import { message } from 'antd'
import DescriptionsList from 'components/DescriptionsList'
import CommonDrawer from 'components/CommonDrawer'
import TagCell from 'components/TagCell'
import ArticlePreview from './ArticlePreview'
import { getRequestError } from 'services/utils'
import { GetMaterialDetail } from 'services/modules/trackMaterial'
import { getFileUrl } from 'src/utils'
import styles from './index.module.less'

export default (props) => {
  const { data = {}, onOk, visible, ...rest } = props
  const {
    run: runGetArticleData,
    data: articleData = {},
    mutate,
  } = useRequest(GetMaterialDetail, {
    manual: true,
    onSuccess: async (data) => {
      if (isEmpty(data)) {
        message.error('查询的数据不存在')
      } else {
        const coverUrl = await getFileUrl(data.mediaId)
        mutate({
          ...articleData,
          filePath: coverUrl,
        })
      }
    },
    onError: (e) => getRequestError(e, '查询失败'),
  })

  useEffect(() => {
    if (visible && data.id) {
      runGetArticleData({
        id: data.id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, data.id])

  return (
    <CommonDrawer
      title="文章详情"
      visible={visible}
      footer={null}
      width={720}
      {...rest}>
      <div className={styles['drawer-content']}>
        <ArticlePreview data={articleData} />
        <div className={styles['article-side']}></div>
        <Card title="其它信息">
          <div className={styles['other-info']}>
            <DescriptionsList.Item label="素材标签">
              <TagCell
                dataSource={articleData.mediaTagDetailList}
                maxHeight="auto"
              />
            </DescriptionsList.Item>
            <DescriptionsList.Item label="动态通知">
              {articleData.hasInform ? '开启' : '关闭'}
            </DescriptionsList.Item>
            <DescriptionsList.Item label="客户标签">
              <TagCell
                dataSource={articleData.wxTagDetailList}
                maxHeight="auto"
              />
            </DescriptionsList.Item>
            <DescriptionsList.Item label="发送次数">
              {data.sendNum ? data.sendNum : 0}
            </DescriptionsList.Item>
            <DescriptionsList.Item label="浏览次数">
              {data.lookNum ? data.lookNum : 0}
            </DescriptionsList.Item>
            <div className={styles['article-cover']}>
              <img src={articleData.filePath} width={200} alt="" />
              <p className={styles['cover-name']}>文章封面</p>
            </div>
          </div>
        </Card>
      </div>
    </CommonDrawer>
  )
}

const Card = ({ title, children }) => {
  return (
    <div className={styles['card-section']}>
      <div className={styles['card-header']}>
        <div className={styles['card-title']}>{title}</div>
      </div>
      <div>{children}</div>
    </div>
  )
}
