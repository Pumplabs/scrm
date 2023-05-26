import { Popup } from 'antd-mobile'
import { AddCircleOutline } from 'antd-mobile-icons'
import { useNavigate } from 'react-router'
import PageContent from 'components/PageContent'
import List from 'components/List'
import { useModalHook } from 'src/hooks'
import Content from './Content'
import { MATERIAL_TYPE_CN_VALS, MATERIAL_TYPE_EN_VALS } from '../constants'
import styles from './index.module.less'

const MATERIAL_TYPES_OPTIONS = [
  {
    label: MATERIAL_TYPE_CN_VALS[MATERIAL_TYPE_EN_VALS.POSTER],
    value: MATERIAL_TYPE_EN_VALS.POSTER
  },
  {
    label: MATERIAL_TYPE_CN_VALS[MATERIAL_TYPE_EN_VALS.PICTUER],
    value: MATERIAL_TYPE_EN_VALS.PICTUER
  },
  {
    label: MATERIAL_TYPE_CN_VALS[MATERIAL_TYPE_EN_VALS.TEXT],
    value: MATERIAL_TYPE_EN_VALS.TEXT
  },
  {
    label: MATERIAL_TYPE_CN_VALS[MATERIAL_TYPE_EN_VALS.FILE],
    value: MATERIAL_TYPE_EN_VALS.FILE
  },
  {
    label: MATERIAL_TYPE_CN_VALS[MATERIAL_TYPE_EN_VALS.LINK],
    value: MATERIAL_TYPE_EN_VALS.LINK
  },
  {
    label: MATERIAL_TYPE_CN_VALS[MATERIAL_TYPE_EN_VALS.VIDEO],
    value: MATERIAL_TYPE_EN_VALS.VIDEO
  }
]
export default () => {
  const navigate = useNavigate()
  const { openModal, closeModal, visibleMap } = useModalHook(['add'])

  const onAdd = () => {
    openModal('add')
  }

  const onSelectItem = (key) => {
    navigate(`/addMaterial?type=${key}`)
  }

  return (
    <PageContent
      footer={<Footer onClick={onAdd} />}
      className={styles['material-manage-page']}
    >
      <Popup
        visible={visibleMap.addVisible}
        onMaskClick={closeModal}
        // bodyStyle={{ height: '40vh' }}
      >
        <div className={styles['popup-content']}>
          <div className={styles['popup-header']}>
            <span className={styles['popup-cancel-text']} onClick={closeModal}>
              取消
            </span>
            <p className={styles['popup-title']}>选择添加的素材类型</p>
          </div>
          <List className={styles['type-list']}>
            {MATERIAL_TYPES_OPTIONS.map((item) => (
              <List.Item
                key={item.value}
                className={styles['type-list-item']}
                onClick={() => onSelectItem(item.value)}
              >
                {item.label}
              </List.Item>
            ))}
          </List>
        </div>
      </Popup>
      <Content />
    </PageContent>
  )
}

const Footer = ({ onClick }) => {
  return (
    <div className={styles['page-footer']}>
      <AddCircleOutline className={styles['add-icon-btn']} onClick={onClick} />
    </div>
  )
}
