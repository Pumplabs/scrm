import { forwardRef } from 'react'
import { Input } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { WeChatEle } from 'components/WeChatCell'
import styles from './index.module.less'
export default forwardRef(({ value, ...rest }, ref) => {
  return (
    <div className={styles['remark-preview']} ref={ref}>
      <Input
        placeholder="请输入不超过18个字符"
        maxLength={18}
        value={value}
        {...rest}
        className={styles['remark-input']}
      />
      <div>
        <p className={styles['remark-tip']}>
          <label className={styles['remark-label']}>备注预览</label>
          <span>
            <InfoCircleOutlined className={styles['remark-icon']} />
            例如，客户昵称是“小兔兔”，那么会自动备注为“小兔兔-想买防晒的”
          </span>
        </p>
        <div className={styles['remark-avatar-preview']}>
          <WeChatEle
            size="small"
            userName={`用户昵称${value ? `-${value}` : ''}`}
            showCorpName={false}
            style={{background: "#fff"}}
          />
        </div>
      </div>
    </div>
  )
})
