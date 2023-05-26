import { Fragment, useState } from 'react'
import CommonModal from 'components/CommonModal'
import styles from './index.module.less'
export default ({ src, title = '预览' }) => {
  const [visible, setVisible] = useState(false)
  const onShow = () => {
    setVisible(true)
  }
  const onCancel = () => {
    setVisible(false)
  }
  return (
    <Fragment>
      {
        src ? (
          <img
            src={src}
            alt=""
            className={styles.qrCodeCell}
            onClick={onShow}
          />
        ) : (
          <span>暂无二维码</span>
        )
      }
      <CommonModal
        title={title}
        visible={visible}
        footer={null}
        onCancel={onCancel}
        bodyStyle={{
          padding: 12,
          maxHeight: "420px",
          overflow: "auto",
          textAlign: "center",
          minHeight: 220
        }}
      >
        <img
          src={src}
          alt=""
        />
      </CommonModal>
    </Fragment>
  )
}