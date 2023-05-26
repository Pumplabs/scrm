import { useState, useEffect, useRef } from 'react'
import CommonDrawer from 'components/CommonDrawer'
import {
  ImgList,
  ContentList,
} from 'components/WeChatMsgEditor/components/AttachmentFileModal/ChooseMaterialDrawer'
import { MATERIAL_TYPE_EN_VALS } from 'pages/SaleOperations/constants'
import styles from './index.module.less'

export default (props) => {
  const { visible, selectedKeys = [], onOk, ...rest } = props
  const [keys, setKeys] = useState([])
  const listRef = useRef(null)

  useEffect(() => {
    if (visible) {
      setKeys(selectedKeys)
      if (listRef.current) {
        listRef.current.reset()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleOk = () => {
    if (typeof onOk === 'function') {
      onOk(keys)
    }
  }

  const onKeysChange = (nextCheck, item) => {
    setKeys(nextCheck ? [item] : [])
  }

  return (
    <CommonDrawer
      visible={visible}
      width={660}
      onOk={handleOk}
      bodyStyle={{
        paddingTop: 14,
      }}
      okButtonProps={{
        disabled: keys.length === 0,
      }}
      {...rest}
    >
      <ContentList
        ref={r => listRef.current = r}
        isActive={true}
        needRemoteUrl={true}
        type={MATERIAL_TYPE_EN_VALS.POSTER}
        contentClassName={styles['list-content']}
        renderChildren={(list) => {
          return (
            <ImgList
              dataSource={list}
              selectedKeys={keys}
              onChange={onKeysChange}
            />
          )
        }}></ContentList>
    </CommonDrawer>
  )
}
