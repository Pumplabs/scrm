import { useRef, useEffect, useMemo } from 'react'
import { Swiper, Toast } from 'antd-mobile'
import cls from 'classnames'
import { useParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { decode } from 'js-base64'
import { get } from 'lodash'
import { useBack } from 'src/hooks'
import { formatNumber } from 'src/utils'
import { converToHtml } from 'src/utils/covertRichToHtml'
import { GetProductById } from 'services/modules/product'
import styles from './index.module.less'

export default () => {
  const toastRef = useRef(null)
  const descRef = useRef(null)
  const { id: parId } = useParams()
  useBack({
    backUrl: '/productList'
  })
  const { run: runGetProductById, data: productData = {} } = useRequest(
    GetProductById,
    {
      manual: true,
      onBefore() {
        toastRef.current = Toast.show({
          icon: 'loading',
          duration: 0,
        })
      },
      onFinally() {
        if (toastRef.current) {
          toastRef.current.close()
          toastRef.current = null
        }
      },
    }
  )
  const productId = useMemo(() => decode(parId), [parId])

  useEffect(() => {
    if (productId) {
      runGetProductById({
        id: productId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  useEffect(() => {
    if (productData.description) {
      converToHtml(productData.description, descRef.current)
    }
  }, [productData.description])
  const imbueList = Array.isArray(productData.imbue) ? productData.imbue : []
  const files = Array.isArray(productData.atlas) ? productData.atlas : []
  const descList = [
    {
      name: '产品编码',
      value: productData.code,
    },
    ...imbueList,
  ]
  return (
    <div className={styles['product-detail-page']}>
      <Swiper autoplay>
        {files.map((ele) => (
          <Swiper.Item key={ele.id}>
            <div className={styles['swiper-item']}>
              <img
                src={`${window.location.origin}/api/common/downloadByFileId?fileId=${ele.id}`}
                alt=""
              />
            </div>
          </Swiper.Item>
        ))}
      </Swiper>
      <div className={styles['product-base-info']}>
        <p className={styles['product-header']}>
          <span className={styles['product-name']}>{productData.name}</span>
          <span className={styles['product-price']}>
            <strong className={styles['coin-icon']}>¥</strong>
            {formatNumber(productData.price)}
          </span>
        </p>
        <div className={styles['product-category-box']}>
          <span className={styles['category-item']}>
            {get(productData, 'productType.name')}
          </span>
          <span className={styles['view-item']}>
            浏览：
            {productData.views || 0}
          </span>
        </div>
        <InfoList list={descList}
        className={styles['product-attrs']}/>
        <div
          className={styles['product-desc']}
          ref={(r) => (descRef.current = r)}></div>
      </div>
    </div>
  )
}

const InfoList = ({ list = [], className }) => {
  return (
    <ul
      className={cls({
        [styles['info-list']]: true,
        [className]: className,
      })}>
      {list.map((ele) => (
        <li className={styles['info-list-item']} key={ele.name}>
          <span className={styles['info-list-item-name']}>{ele.name}</span>
          <span className={styles['info-list-item-value']}>{ele.value}</span>
        </li>
      ))}
    </ul>
  )
}
