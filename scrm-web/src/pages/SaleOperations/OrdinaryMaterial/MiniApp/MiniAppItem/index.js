import { useEffect } from 'react'
import { Tooltip } from 'antd'
import { PictureOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { get } from 'lodash'
import OpenEle from 'components/OpenEle'
import { getFileUrl } from 'src/utils'
import styles from './index.module.less'
import miniAppUrl from 'assets/images/icon_miniApp.png'
import miniAppIcon2 from 'assets/images/mini-app-icon2.svg'
import defaultAvatorUrl from 'assets/images/defaultAvator.jpg'

export default ({ data = {}, onEdit, onRemove, onDetail }) => {
  const handleEdit = (e) => {
    e.stopPropagation();
    if (typeof onEdit === 'function') {
      onEdit(data)
    }
  }
  const handleRemove = (e) => {
    e.stopPropagation();
    if (typeof onRemove === 'function') {
      onRemove(data)
    }
  }
  const handleDetail = () => {
    if (typeof onDetail === 'function') {
      onDetail(data)
    }
  }
  const appName = get(data, 'appInfo.name')
  return (
    <div
      className={styles['miniApp-item']}
      onClick={handleDetail}
    >
      <div className={styles['miniApp-item-header']}>
        <img
          src={miniAppUrl}
          alt=""
          className={styles['miniApp-icon']}
        />
        <Tooltip
          title={appName}
          placement="topLeft"
        >
          {appName}
        </Tooltip>
        <div className={styles['miniApp-item-actions']}>
          <EditOutlined
            className={styles['miniApp-item-action']}
            onClick={handleEdit}
          />
          <DeleteOutlined className={styles['miniApp-item-action']}
            onClick={handleRemove}
          />
        </div>
      </div>
      <div className={styles['miniApp-item-body']}>
        <div>
          <img
            src={data.filePath}
            alt=""
            width="100%"
            height={217}
          />
        </div>
      </div>
      <div className={styles['miniApp-item-footer']}>
        <span
          className={styles['miniApp-symbol']}>
          <img
            src={miniAppIcon2}
            className={styles['icon']}
            alt=""
          />
          小程序
        </span>
        <div style={{ float: "right" }}>
          <span className={styles['time-text']}>
            {data.createdAt}
          </span>
          <Tooltip
            title={<OpenEle type="userName" openid={get(data, 'creatorInfo.name')} />}
          >
            <img
              src={get(data, 'creatorInfo.avatarUrl') || defaultAvatorUrl}
              alt=""
              className={styles['user-icon']}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
const DefaultCover = () => {
  return (
    <div>
      <PictureOutlined
        className={styles['default-cover']}
      />
    </div>
  )
}