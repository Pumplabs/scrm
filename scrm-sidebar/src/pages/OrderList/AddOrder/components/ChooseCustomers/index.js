import { useEffect, useState } from 'react'
import { Radio } from 'antd-mobile'
import { get } from 'lodash'
import MyPopup from 'components/MyPopup'
import InfiniteList from 'components/InfiniteList'
import WeChatCell from 'components/WeChatCell'
import OpenEle from 'components/OpenEle'
import { useInfiniteHook } from 'src/hooks'
import { GetCustomerList } from 'src/services/modules/customer'
import styles from './index.module.less'

export default (props = {}) => {
  const { visible, selectedList = [], onOk, ...rest } = props
  const [productList, setProductList] = useState([])
  const { tableProps, run: runGetCustomerList } = useInfiniteHook({
    request: GetCustomerList,
    manual: true,
    defaultPageSize: 20,
    rigidParams: {
      isPermission: true,
    },
  })

  useEffect(() => {
    if (visible) {
      runGetCustomerList()
      setProductList(selectedList)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onRadioChange = (item, checked) => {
    setProductList((arr) =>
      checked ? [item] : arr.filter((ele) => ele.extId !== item.extId)
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
      popupBodyClassName={styles['popup-content']}
      // bodyStyle={{ height: '40vh' }}
      title="选择客户"
      onOk={handleOk}
      okButtonProps={{
        disabled: productList.length === 0,
      }}
      {...rest}>
      <div className={styles['list-wrap']}>
        <InfiniteList
          {...tableProps}
          listItemClassName={styles['list-item']}
          loadNext={runGetCustomerList}
          rowKey={(record) => `${record.id}_${record.extCreatorId}`}
          renderItem={(ele) => {
            const checked = productList.some((item) => item.extId === ele.extId)
            return (
              <CheckItem
                data={ele}
                checked={checked}
                onRadioChange={onRadioChange}>
                <WeChatCell
                  data={ele}
                  extra={
                    <p>
                      <span className={styles['follower']}>跟进人</span>
                      <OpenEle
                        type="userName"
                        openid={get(ele, 'extCreatorName')}
                        className={styles['follow-staff']}
                      />
                    </p>
                  }
                />
              </CheckItem>
            )
          }}
          bordered={false}></InfiniteList>
      </div>
    </MyPopup>
  )
}
const CheckItem = (props) => {
  const { checked, onRadioChange, data, children } = props
  return (
    <div
      className={styles['check-item']}
      onClick={() => {
        onRadioChange(data, !checked)
      }}>
      <Radio
        checked={checked}
        className={styles['radio-ele']}
        style={{
          '--icon-size': '18px',
          '--font-size': '14px',
          '--gap': '6px',
        }}
      />
      <div className={styles['check-content']}>{children}</div>
    </div>
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
