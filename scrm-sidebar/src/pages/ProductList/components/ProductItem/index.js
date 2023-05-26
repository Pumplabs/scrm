import { useMemo, useContext } from 'react'
import { get } from 'lodash'
import { Toast } from 'antd-mobile'
import { MobXProviderContext } from 'mobx-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import OpenEle from 'components/OpenEle'
import { formatNumber, createSysUrlsByType } from 'src/utils'
import styles from './index.module.less'

export default ({ data = {}, onDetail }) => {
  const { UserStore } = useContext(MobXProviderContext)

  const onCopy = () => {
    Toast.show({
      icon: 'success',
      content: '复制成功'
    })
  }
  const mainUrl = useMemo(() => {
    const files = Array.isArray(data.atlas) ? data.atlas : []
    const [fileItem] = files
    if (fileItem) {
      return `${window.location.origin}/api/common/downloadByFileId?fileId=${fileItem.id}`
    } else {
      return ''
    }
  }, [data.atlas])

  const copyUrl = useMemo(() => {
    return createSysUrlsByType({
      type: 'product',
      data: {
        productId: data.id,
        extCorpId: UserStore.corpInfo.corpId,
        staffId: UserStore.userData.extId,
      },
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id])

  const handleDetail = () => {
    if (typeof onDetail === 'function') {
      onDetail(data)
    }
  }
  return (
    <div className={styles['product-item']}>
      <div className={styles['product-item-content']}>
        <img src={mainUrl} alt="" className={styles['product-pic']} />
        <div className={styles['product-info']} onClick={handleDetail}>
          <div className={styles['product-info-header']}>
            <p className={styles['product-name']}>
              <span>{data.name}</span>
            </p>
            <span className={styles['product-price']}>
              ¥{formatNumber(data.price)}
            </span>
          </div>
          <div className={styles['produt-attrs']}>
            <span className={styles['attr-item']}>
              {get(data, 'productType.name')}
            </span>
          </div>
          <p className={styles['create-info']}>
            <OpenEle
              type="userName"
              openid={get(data, 'creatorStaff.name')}
              className={styles['creator']}
            />
            创建于{data.createdAt}
          </p>
        </div>
      </div>
      <div className={styles['product-item-footer']}>
        <span>浏览：{data.views || 0}</span>
        <CopyToClipboard text={copyUrl} onCopy={onCopy}>
          <span className={styles['link-btn']}>复制链接</span>
        </CopyToClipboard>
      </div>
    </div>
  )
}
