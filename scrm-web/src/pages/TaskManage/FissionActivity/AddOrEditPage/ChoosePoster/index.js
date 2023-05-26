import { useState, useRef, forwardRef } from 'react'
import { Button, Dropdown, Menu, message } from 'antd'
import { get } from 'lodash'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import PosterDrawer from './PosterDrawer'
import CommonUpload from 'components/CommonUpload'
import { getFileUrl } from 'src/utils'
import { WX_IMG_FILE_TYPE } from  'src/utils/constants'
import styles from './index.module.less'

export default forwardRef(({ value = {}, onChange, ...rest }, ref) => {
  const uploadBtnRef = useRef()
  const [visible, setVisible] = useState(false)

  const changeValue = (nextVal) => {
    if (typeof onChange === 'function') {
      onChange(nextVal)
    }
  }

  const onOpen = () => {
    setVisible(true)
  }

  const onOk = (keys) => {
    const [data] = keys
    changeValue(data)
    setVisible(false)
  }

  const onCancel = () => {
    setVisible(false)
  }

  const onRemove = () => {
    changeValue({})
  }

  const onSelectMenu = ({ key }) => {
    if (key === 'lib') {
      onOpen()
    } else {
      uploadBtnRef.current.click()
    }
  }

  const onFileChange = async ({ file }) => {
    const fileId = get(file, 'response.data.id')
    if (file.status === 'done') {
      if (fileId) {
        const urls = await getFileUrl({ ids: [fileId] })
        const id = get(file, 'response.data.id')
        changeValue({
          isNew: true,
          fileId: id,
          id,
          filePath: urls[fileId],
          title: file.name,
        })
      } else {
        message.error(get(file, 'response.msg') || '文件上传失败')
      }
    }
  }

  const menu = (
    <Menu onClick={onSelectMenu}>
      <Menu.Item key="lib">从素材库选择</Menu.Item>
      <Menu.Item key="file">直接上传海报</Menu.Item>
    </Menu>
  )
  return (
    <div ref={ref} {...rest}>
      <PosterDrawer
        selectedKeys={value.id ? [{ id: value.id }] : []}
        visible={visible}
        title="选择海报"
        onOk={onOk}
        onCancel={onCancel}
      />
      <div style={{ display: 'none' }}>
        <CommonUpload
          action="/api/common/uploadWithoutWx"
          maxCount={1}
          validOptions={{
            maxFileSize: 2,
            maxFileTotalLen: 2,
            acceptTypeList: WX_IMG_FILE_TYPE,
          }}
          showUploadList={false}
          onBeforeUpload={(_, flag) => flag}
          onChange={onFileChange}>
          <Button ref={(ref) => (uploadBtnRef.current = ref)}></Button>
        </CommonUpload>
      </div>
      {value.id ? (
        <div className={styles['file-name-input']}>
          <span className={styles['file-name']}>{value.title}</span>
          <span>
            <DeleteOutlined className={styles['action']} onClick={onRemove} />
          </span>
        </div>
      ) : (
        <Dropdown overlay={menu} placement="bottomLeft">
          <Button icon={<PlusOutlined />} type="primary" ghost>
            上传海报
          </Button>
        </Dropdown>
      )}
    </div>
  )
})
