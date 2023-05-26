import { useEffect, useState, useRef, useMemo } from 'react'
import { Spin } from 'antd'
import cls from 'classnames'
import { isEmpty } from 'lodash'
import CommonDrawer from 'components/CommonDrawer'
import DescriptionsList from 'components/DescriptionsList'
import StatusItem from '../StatusItem'
import { refillHtmlByNodeList } from 'src/pages/SaleOperations/TrackMaterial/Article/ArticleEditor/ArticleContentEditor/getHtmlByNodeList'
import { getFileUrl, formatNumber } from 'src/utils'
import { findAllImgFileIds } from 'src/pages/SaleOperations/TrackMaterial/Article/ArticleDetailDrawer/ArticlePreview/utils'
import styles from './index.module.less'

export default (props) => {
  const { visible, data = {}, ...rest } = props
  const [dataLoading, setDataLoading] = useState(false)
  const [picUrls, setPicUrls] = useState({})
  const descRef = useRef(null)
  const { imbue = [], atlas = [] } = data
  const picIds = Array.isArray(atlas) ? atlas : []
  const jsonStr = useMemo(() => JSON.stringify(data), [data])

  const getPicUrls = async () => {
    if (picIds.length) {
      setDataLoading(true)
    }
    const fileUrls = await getFileUrl({
      ids: picIds.map((ele) => ele.id),
    })
    setPicUrls(fileUrls)
    setDataLoading(false)
  }

  useEffect(() => {
    if (!visible) {
      setDataLoading(false)
      setPicUrls({})
    } else {
      getPicUrls()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  useEffect(() => {
    if (data.description) {
      refillArticle(data.description)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonStr])

  const refillArticle = async (richText) => {
    const imgFileIds = findAllImgFileIds(richText)
    let imgUrls = {}
    if (descRef.current) {
      descRef.current.innerHTML = ''
    }
    imgFileIds.forEach((item) => {
      imgUrls[
        item
      ] = `${window.location.origin}/api/common/downloadByFileId?fileId=${item}`
    })
    refillHtmlByNodeList(richText, descRef.current, imgUrls)
  }

  return (
    <CommonDrawer visible={visible} width={680} {...rest} footer={null}>
      <Spin spinning={dataLoading}>
        <DescriptionsList>
          <DescriptionsList.Item label="产品名称">
            {data.name}
          </DescriptionsList.Item>
          <DescriptionsList.Item label="产品分类">
            {data.productType ? data.productType.name : ''}
          </DescriptionsList.Item>
          <DescriptionsList.Item label="产品状态">
            <StatusItem type={data.status} />
          </DescriptionsList.Item>
          <DescriptionsList.Item label="产品图册">
            {picIds.map((ele) => (
              <img
                src={picUrls[ele.id]}
                className={styles['product-img']}
                alt=""
                key={ele.id}
              />
            ))}
          </DescriptionsList.Item>
          <DescriptionsList.Item label="价格">
            {data.price > 0
              ? `¥ ${formatNumber(data.price, {
                  padPrecision: 2,
                })}`
              : ''}
          </DescriptionsList.Item>
          <DescriptionsList.Item label="产品编码">
            {data.code || '-'}
          </DescriptionsList.Item>
          <DescriptionsList.Item label="产品简介">
            {data.profile || '-'}
          </DescriptionsList.Item>
          <DescriptionsList.Item label="产品描述">
            {isEmpty(data.description) ? '-' : ''}
            <div
              className={cls({
                'w-e-text': true,
                [styles['article-content']]: true,
              })}
              ref={(r) => (descRef.current = r)}></div>
          </DescriptionsList.Item>
          <DescriptionsList.Item label="属性">
            {Array.isArray(imbue) && imbue.length ? (
              <ul className={styles['attr-ul']}>
                {imbue.map((attrItem) => (
                  <li key={attrItem.name} className={styles['attr-li']}>
                    <span className={styles['attr-name']}>{attrItem.name}</span>
                    <span className={styles['attr-value']}>
                      {attrItem.value}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              '暂无'
            )}
            {data.code}
          </DescriptionsList.Item>
        </DescriptionsList>
      </Spin>
    </CommonDrawer>
  )
}
