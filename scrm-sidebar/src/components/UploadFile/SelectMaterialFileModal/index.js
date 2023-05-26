import { useEffect, useState } from 'react'
import { Popup, Button } from 'antd-mobile'
import MaterialContent from './MaterialContent'
import styles from './index.module.less'
export default (props) => {
  const {
    onOk,
    onCancel,
    max,
    visible,
    showNormalMaterial,
    showTrackMaterial,
  } = props
  const [selectedList, setSelectedList] = useState([])

  useEffect(() => {
    if (!visible) {
      setSelectedList([])
    }
  }, [visible])

  const onChange = (arr) => {
    setSelectedList(arr)
  }

  const handleOk = () => {
    if (typeof onOk === 'function') {
      onOk({ selectedList })
    }
  }
  return (
    <Popup visible={visible} onMaskClick={onCancel}>
      <div className={styles['popup-content']}>
        <div className={styles['popup-main']}>
          <MaterialContent
            onChange={onChange}
            selectedList={selectedList}
            max={max}
            searchClassName={styles['material-search']}
            visible={visible}
            showNormalMaterial={showNormalMaterial}
            showTrackMaterial={showTrackMaterial}
          />
        </div>
        <div className={styles['modal-footer']}>
          <Button onClick={onCancel} size="small">
            取消
          </Button>
          <Button
            onClick={handleOk}
            color="primary"
            size="small"
            fill="outline"
            disabled={selectedList.length === 0}>
            确定
          </Button>
        </div>
      </div>
    </Popup>
  )
}
export { TAB_TYPES } from './MaterialContent'
