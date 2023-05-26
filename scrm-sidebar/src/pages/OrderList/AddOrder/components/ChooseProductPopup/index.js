import { useEffect, useState, useMemo } from 'react'
import { Radio } from 'antd-mobile'
import cls from 'classnames'
import { get } from 'lodash'
import MyPopup from 'components/MyPopup'
import InfiniteList from 'components/InfiniteList'
import { useInfiniteHook } from 'src/hooks'
import { GetProductList } from 'services/modules/product'
import { formatNumber } from 'src/utils'
import styles from './index.module.less'

export default (props = {}) => {
  const { visible, selectedList = [], onOk, ...rest } = props
  const [productList, setProductList] = useState([])
  const { tableProps, run: runGetProductList } = useInfiniteHook({
    request: GetProductList,
    manual: true,
    defaultPageSize: 20,
  })

  useEffect(() => {
    if (visible) {
      runGetProductList()
      setProductList(selectedList)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onRadioChange = (item, checked) => {
    setProductList((arr) =>
      checked ? [item] : arr.filter((ele) => ele.id !== item.id)
    )
  }

  const handleOk = () => {
    if (typeof onOk === 'function') {
      onOk(productList)
    }
  }

  return (
    <MyPopup
      visible={visible}
      popupBodyClassName={styles['product-content']}
      // bodyStyle={{ height: '40vh' }}
      title="选择产品"
      onOk={handleOk}
      okButtonProps={{
        disabled: productList.length === 0,
      }}
      {...rest}>
      <div className={styles['list-wrap']}>
        <InfiniteList
          {...tableProps}
          listItemClassName={styles['list-item']}
          adm-list-item-content-main
          renderItem={(ele) => {
            const checked = productList.some((item) => item.id === ele.id)
            return (
              <ProductWithCheck
                data={ele}
                checked={checked}
                onRadioChange={onRadioChange}>
                <ProductItem data={ele} />
              </ProductWithCheck>
            )
          }}
          bordered={false}></InfiniteList>
      </div>
    </MyPopup>
  )
}

const ProductWithCheck = ({ checked, onRadioChange, data, children }) => {
  return (
    <div
      className={styles['product-check-item']}
      onClick={() => {
        onRadioChange(data, !checked)
      }}>
      <Radio
        checked={checked}
        className={styles['radio-ele']}
        // onChange={(e) => {
        //   console.log('radio-onChange', e)
        //   onRadioChange(data, e)
        //   return
        // }}
        style={{
          '--icon-size': '18px',
          '--font-size': '14px',
          '--gap': '6px',
        }}
      />
      <div className={styles['product-check-content']}>{children}</div>
    </div>
  )
}
const ProductItem = ({ data = {} }) => {
  const mainUrl = useMemo(() => {
    const fileList = Array.isArray(data.atlas) ? data.atlas : []
    const [fileItem] = fileList
    if (fileItem) {
      return `${window.location.origin}/api/common/downloadByFileId?fileId=${fileItem.id}`
    } else {
      return ''
    }
  }, [data.atlas])
  return (
    <div
      className={cls({
        [styles['product-item']]: true,
        [styles['product-with-footer']]: data.profile,
      })}>
      <div className={styles['product-item-content']}>
        <img src={mainUrl} alt="" className={styles['main-pic']} />
        <div className={styles['item-info']}>
          <div className={styles['product-info']}>
            <div className={styles['product-info-header']}>
              <p className={styles['product-name']}>{data.name}</p>
              <span className={styles['product-price']}>
                ¥{formatNumber(data.price)}
              </span>
            </div>
            <span className={styles['product-category']}>
              {get(data, 'productType.name')}
            </span>
          </div>
        </div>
      </div>
      {data.profile ? (
        <div className={styles['product-item-footer']}>{data.profile}</div>
      ) : null}
    </div>
  )
}
