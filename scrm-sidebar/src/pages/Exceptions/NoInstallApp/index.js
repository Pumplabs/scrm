import { FrownOutlined } from '@ant-design/icons'
import ExceptionCard from '../ExceptionCard'
import { createSysUrlsByType } from 'src/utils'
import styles from './index.module.less'

export default () => {
  const href = createSysUrlsByType({
    type: 'application',
  })
  return (
    <ExceptionCard icon={<FrownOutlined />}>
      <div className={styles['content']}>
        <div className={styles['tip-box']}>
          <p className={styles['first-tip']}>
          您还没安装蓬勃来客呢，请前往安装吧!
          </p>
          <div>
            <p>
              请在pc端打开此链接添加应用
              <br />
              链接地址：<a href={href}>{href}</a>
            </p>
          </div>
        </div>
      </div>
    </ExceptionCard>
  )
}
