import React from 'react'
import cls from 'classnames'
import { Collapse } from 'antd-mobile'
import styles from './index.module.less'

class MyCollapse extends React.Component {
  render() {
    const { className, children, ...rest } = this.props
    return (
      <Collapse
        className={cls({
          [styles['my-collapse']]: true,
        })}
        {...rest}>
        {children}
      </Collapse>
    )
  }
}

MyCollapse.Panel = Collapse.Panel
export default MyCollapse
